package gw.api.system.cluster

uses com.google.common.annotations.VisibleForTesting
uses com.google.common.collect.Ordering
uses gw.api.system.server.ServerUtil
uses gw.api.tools.ClusterMembersData
uses gw.api.tools.ClusteredServer
uses gw.lang.reflect.features.PropertyReference
uses gw.plugin.InitializablePlugin
uses gw.plugin.PluginParameter

uses java.util.concurrent.TimeUnit

@Export
@PluginParameter(:name="transferTimeoutSec", :type=Integer)
@PluginParameter(:name="longDelaySec", :type=Integer)
@PluginParameter(:name="shortDelaySec", :type=Integer)
@PluginParameter(:name="clusterStartStabilizationPeriodSec", :type=Integer)
@PluginParameter(:name="maxStartDelaySec", :type=Integer)
@PluginParameter(:name="imbalanceThreshold", :type=Integer)
@PluginParameter(:name="maxSimultaneousTransfers", :type=Integer)
@PluginParameter(:name="startablePluginLoadBalancingMode", :type=String)
@PluginParameter(:name="messageDestinationLoadBalancingMode", :type=String)
@PluginParameter(:name="messageProcessorsLoadBalancingMode", :type=String)
class DefaultBackgroundTaskLoadBalancingPlugin implements BackgroundTaskLoadBalancingPlugin, InitializablePlugin {

  protected var _transferTimeoutSec: long = 3 * 60
  protected var _longDelaySec: long = 5 * 60
  protected var _shortDelaySec: long = 30
  protected var _clusterStartStabilizationPeriodSec: long = 5 * 60
  protected var _maxStartDelaySec: long = 20

  protected var _imbalanceThreshold: int = 3
  protected var _maxSimultaneousTransfers: int = 1

  protected var _startablePluginLoadBalancingMode : Mode = NO_TRANSFER
  protected var _messageDestinationLoadBalancingMode : Mode = NO_TRANSFER
  protected var _messageProcessorsLoadBalancingMode : Mode = DYNAMIC

  override function rebalanceStartablePlugins(context: LoadBalancingContext): LoadBalancingResult {
    if (!_startablePluginLoadBalancingMode.RebalancingEnabled) {
      return LoadBalancingResult.neverRepeat()
    }
    return rebalance(context)
  }

  override function rebalanceMessageDestinations(context: LoadBalancingContext): LoadBalancingResult {
    if (!_messageDestinationLoadBalancingMode.RebalancingEnabled) {
      return LoadBalancingResult.neverRepeat()
    }
    return rebalance(context)
  }

  override function rebalanceMessageProcessors(context: LoadBalancingContext): LoadBalancingResult {
    if (!_messageProcessorsLoadBalancingMode.RebalancingEnabled) {
      return LoadBalancingResult.neverRepeat()
    }
    return rebalance(context)
  }

  override function selectStartablePluginsToStartNow(availableStartablePlugins: List<ComponentInfo>, context: LoadBalancingContext): List<ComponentInfo> {
    if (!_startablePluginLoadBalancingMode.AcquisitionStrategyEnabled) {
      return availableStartablePlugins
    }
    return selectComponentsToStartNow(availableStartablePlugins, context)
  }

  override function selectMessageDestinationsToStartNow(availableMessageDestinations: List<ComponentInfo>, context: LoadBalancingContext): List<ComponentInfo> {
    if (!_messageDestinationLoadBalancingMode.AcquisitionStrategyEnabled) {
      return availableMessageDestinations
    }
    return selectComponentsToStartNow(availableMessageDestinations, context)
  }

  override function selectMessageProcessorsToStartNow(availableMessageProcessors: List<ComponentInfo>, context: LoadBalancingContext): List<ComponentInfo> {
    if (!_messageProcessorsLoadBalancingMode.AcquisitionStrategyEnabled) {
      return availableMessageProcessors
    }
    return selectComponentsToStartNow(availableMessageProcessors, context)
  }

  override property set Parameters(parameters: Map) {
    readParameter(parameters, "transferTimeoutSec", #_transferTimeoutSec)
    readParameter(parameters, "longDelaySec", #_longDelaySec)
    readParameter(parameters, "shortDelaySec", #_shortDelaySec)
    readParameter(parameters, "clusterStartStabilizationPeriodSec", #_clusterStartStabilizationPeriodSec)
    readParameter(parameters, "maxStartDelaySec", #_maxStartDelaySec)
    readParameter(parameters, "imbalanceThreshold", #_imbalanceThreshold)
    readParameter(parameters, "maxSimultaneousTransfers", #_maxSimultaneousTransfers)
    readModeParameter(parameters, "startablePluginLoadBalancingMode", #_startablePluginLoadBalancingMode)
    readModeParameter(parameters, "messageDestinationLoadBalancingMode", #_messageDestinationLoadBalancingMode)
    readModeParameter(parameters, "messageProcessorsLoadBalancingMode", #_messageProcessorsLoadBalancingMode)
  }

  private reified function readParameter<T>(parameters: Map, name: String, ref: PropertyReference<DefaultBackgroundTaskLoadBalancingPlugin, T>) {
    var value = parameters[name] as T
    if (value != null) {
      ref.set(this, value)
    }
  }

  private function readModeParameter(parameters: Map, name: String, ref: PropertyReference<DefaultBackgroundTaskLoadBalancingPlugin, Mode>) {
    var strValue = parameters[name] as String
    if (strValue == null) {
      return
    }
    var value = Mode.AllValues.firstWhere( \ e -> e.ModeName == strValue)
    if (value == null) {
      var names = Mode.AllValues*.ModeName.join(', ')
      throw new IllegalArgumentException("Illegal '${name}' parameter value: '${strValue}', possible values: ${names}")
    }
    ref.set(this, value)
  }

  @VisibleForTesting
  protected function rebalance(context: LoadBalancingContext): LoadBalancingResult {
    var components = context.AllComponents
    var servers = aggregateComponents(components, context)
    var thisServer = getThisServerInfo(servers)

    //prevent premature rebalance if several servers start in serial
    var lastStartedServerAge = CurrentTime - LastServerStartTime
    if (lastStartedServerAge < _clusterStartStabilizationPeriodSec * 1000) {
      return LoadBalancingResult.repeatAfter(TimeUnit.MILLISECONDS, _clusterStartStabilizationPeriodSec * 1000 - lastStartedServerAge)
    }

    //someone is already transferring component from this server
    if (thisServer.TransferringFrom.HasElements) {
      return LongDelayAndRepeat
    }

    //only one transfer per server at one time
    if (thisServer.TransferringTo.HasElements) {
      return ShortDelayAndRepeat
    }

    //too many transfers at one time
    if (getTotalTransfersInProgress(servers) >= _maxSimultaneousTransfers) {
      return ShortDelayAndRepeat
    }

    //give less loaded server a chance to take work
    var optimalCnt = calcOptimalComponents(servers.size(), components.size())
    if (thisServer.OwnedUpperBound >= optimalCnt && isLessLoadedServerRebalancing(servers, thisServer)) {
      return ShortDelayAndRepeat
    }

    var bestComponentForStealing = getBestComponentForStealing(servers, thisServer, context)
    if (bestComponentForStealing == null) {
      //nothing to balance
      return LongDelayAndRepeat
    }

    context.requestTransferToThisServer(bestComponentForStealing)
    return ShortDelayAndRepeat
  }

  @VisibleForTesting
  protected function selectComponentsToStartNow(availableComponents: List<ComponentInfo>, context: LoadBalancingContext): List<ComponentInfo> {
    var components = context.AllComponents
    var servers = aggregateComponents(components, context)

    var currentTime = CurrentTime
    var optimalCnt = calcOptimalComponents(servers.size(), components.size())
    var realCnt = getThisServerInfo(servers).OwnedUpperBound

    var selected = new ArrayList<ComponentInfo>()
    for (var component in availableComponents.orderBy( \ e -> e.StartRequested)) {
      if (realCnt + selected.size() < optimalCnt || currentTime - component.StartRequested.Time > _maxStartDelaySec * 1000) {
        selected.add(component)
      } else {
        break
      }
    }

    if (selected.size() != availableComponents.size()) {
      context.scheduleComponentAvailabilityCheck(_maxStartDelaySec, TimeUnit.SECONDS)
    }

    return selected
  }

  @VisibleForTesting
  protected property get ThisServerId(): String {
    return ServerUtil.getServerId()
  }

  @VisibleForTesting
  protected  property get CurrentTime(): long {
    return Date.Now.Time
  }

  @VisibleForTesting
  protected property get LastServerStartTime() : long {
    var servers = new ClusterMembersData().getRunningServers().where( \ e -> canPotentiallyStartBackgroundTask(e))
    return servers.HasElements ? servers.max( \ e -> e.Member.ConnectionStarted.Time) : 0
  }

  private function canPotentiallyStartBackgroundTask(server: ClusteredServer) : boolean {
    //by default any server can potentially start a background task,
    //use server.ServerRoles to ignore UI only servers and speed up the load balancing after the cluster restart
    return true
  }

  private property get ShortDelayAndRepeat(): LoadBalancingResult {
    return LoadBalancingResult.repeatAfter(SECONDS, _shortDelaySec)
  }

  private property get LongDelayAndRepeat(): LoadBalancingResult {
    return LoadBalancingResult.repeatAfter(SECONDS, _longDelaySec)
  }

  private function calcOptimalComponents(totalServers: int, totalComponents: int): int {
    return (totalComponents + totalServers - 1) / totalServers
  }

  private function getBestComponentForStealing(servers: Collection<ServerInfo>, thisServer: ServerInfo, context: LoadBalancingContext) : ComponentInfo {
    var serversOrderingByLoad = servers.orderByDescending( \ e -> e.OwnedLowerBound)
    for (var server in serversOrderingByLoad) {
      if (server.OwnedLowerBound - thisServer.OwnedUpperBound <= _imbalanceThreshold) {
        break
      }
      var componentForTransfer = server.getBestComponentForTransfer(context)
      if (componentForTransfer != null) {
        return componentForTransfer
      }
    }
    return null
  }

  private function getTotalTransfersInProgress(servers: Collection<ServerInfo>): int {
    return servers.sum( \ e -> e.TransferringTo.Count)
  }

  private function isLessLoadedServerRebalancing(servers: Collection<ServerInfo>, thisServer: ServerInfo): boolean {
    for (var server in servers) {
      if (server.ServerId == thisServer.ServerId || server.OwnedLowerBound >= thisServer.OwnedUpperBound) {
        continue
      }
      if (server.TransferringFrom.HasElements || server.TransferringTo.HasElements) {
        return true
      }
      if (CurrentTime - server.LastComponentStarted < 2 * _shortDelaySec * 1000) {
        return true
      }
    }
    return false
  }

  private function aggregateComponents(components: Iterable<ComponentInfo>, context: LoadBalancingContext): Collection<ServerInfo> {
    var map = new HashMap<String, ServerInfo>().toAutoMap( \ k -> new ServerInfo(k))
    map.put(ThisServerId, new ServerInfo(ThisServerId))

    for (var component in components) {
      if (component.State != UNASSIGNED && component.State != ASSIGNED) {
        continue
      }
      var transferInfo = context.getTransferInfo(component, SECONDS, _transferTimeoutSec)
      if (transferInfo == null) {
        if (component.ServerId != null) {
          map[component.ServerId].Owned.add(component)
        }
      } else {
        if (transferInfo.CurrentOwner != null) {
          map[transferInfo.CurrentOwner].TransferringFrom.add(component)
        }
        map[transferInfo.TargetOwner].TransferringTo.add(component)
      }
    }
    return map.values()
  }

  private function getThisServerInfo(servers: Collection<ServerInfo>): ServerInfo {
    var thisServerId = ThisServerId
    return servers.singleWhere(\e -> e.ServerId == thisServerId)
  }

  @VisibleForTesting
  protected static enum Mode {
    DISABLED("disabled", false, false),
    NO_TRANSFER("notransfer", false, true),
    DYNAMIC("dynamic", true, true)

    final var _modeName : String as ModeName
    final var _rebalancingEnabled : boolean as RebalancingEnabled
    final var _acquisitionStrategyEnabled : boolean as AcquisitionStrategyEnabled

    private construct(modeName: String, rebalancingEnabled: boolean, acquisitionStrategyEnabled: boolean) {
      _modeName = modeName
      _rebalancingEnabled = rebalancingEnabled
      _acquisitionStrategyEnabled = acquisitionStrategyEnabled
    }
  }

  private class ServerInfo {
    final var _serverId : String as ServerId
    final var _owned : List<ComponentInfo> as Owned = new ArrayList<ComponentInfo>()
    final var _transferringFrom : List<ComponentInfo> as TransferringFrom = new ArrayList<ComponentInfo>()
    final var _transferringTo : List<ComponentInfo> as TransferringTo = new ArrayList<ComponentInfo>()

    construct(serverId: String) {
      _serverId = serverId
    }

    property get OwnedLowerBound(): int {
      return _owned.size()
    }

    property get OwnedUpperBound(): int {
      return _owned.size() + _transferringTo.size()
    }

    property get LastComponentStarted(): long {
      var times = _owned.where(\e -> e.Started != null).map(\e -> e.Started.Time)
      return times.HasElements ? times.max() : 0
    }

    function getBestComponentForTransfer(context: LoadBalancingContext): ComponentInfo {
      var canBeStartedOnThisServer = _owned.where( \ e-> context.isAllowedToStartOnThisServer(e))
      return canBeStartedOnThisServer
          .orderBy( \ e -> e.TransferRequested, Ordering.natural().nullsFirst())
          .thenBy(\ e -> e.Started, Ordering.natural().nullsLast())
          .first()
    }
  }
}

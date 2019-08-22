package gw.api.system.cluster

uses gw.api.tools.ClusterMembersData
uses java.util.Date
uses java.util.concurrent.TimeUnit

@Export
class DefaultBackgroundTaskFailoverPlugin implements BackgroundTaskFailoverPlugin {
  final static var FAILOVER_TIMEOUT = 15 // 15 seconds
  final static var INITIAL_POSTPONE_TIMEOUT = 3 // 3 minutes

  override function handleBatchProcessFailover(type : BatchProcessType, task : FailoverTaskInfo) : FailoverHandlingResult {
    return failover(task)
  }

  override function handleMessageDestinationFailover(destinationId : int, task : FailoverTaskInfo) : FailoverHandlingResult {
    return failover(task)
  }

  override function handlePreprocessorNodeFailover(destinationId: int, nodeId: int, task: FailoverTaskInfo): FailoverHandlingResult {
    return FailoverHandlingResult.complete()
  }

  override function handleStartablePluginFailover(pluginName : String, task : FailoverTaskInfo) : FailoverHandlingResult {
    return failover(task)
  }

  function failover(task : FailoverTaskInfo) : FailoverHandlingResult {
    // Postpone failover if the previous failover state was NotStarted, i.e. if there was a long database outage we
    // give other servers some time to recover and renew their leases
    if (task.PreviousFailoverState == typekey.FailoverState.TC_NOTSTARTED) {
      return FailoverHandlingResult.postpone(TimeUnit.MINUTES, INITIAL_POSTPONE_TIMEOUT)
    }

    // if server is in the cluster: fail automatic failover
    if (new ClusterMembersData().RunningServers.firstWhere( \ m -> m.ServerId == task.ServerId ) != null) {
      return FailoverHandlingResult.fail()
    }

    // if server is not in the cluster: complete automatic failover
    return FailoverHandlingResult.complete()
  }

  override property get FailoverTimeout() : int {
    return FAILOVER_TIMEOUT
  }

  override property get NodeFailureHandler() : NodeFailureHandler {
    return new NodeFailureHandler() {
      override function isManualCleanupRequiredForBatchProcess( type : BatchProcessType, serverIsRestarting : boolean ) : boolean {
        return false
      }

      override function isManualRestartRequiredForMessageDestination( destinationId : int, serverIsRestarting : boolean ) : boolean {
        return false
      }

      override function isManualRestartRequiredForStartablePlugin( pluginName : String, serverIsRestarting : boolean ) : boolean {
        return false
      }
    }
  }
}

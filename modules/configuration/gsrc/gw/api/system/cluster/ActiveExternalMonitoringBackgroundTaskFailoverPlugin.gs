package gw.api.system.cluster

uses java.util.concurrent.TimeUnit
uses java.util.Set
uses java.lang.Integer

@Export
class ActiveExternalMonitoringBackgroundTaskFailoverPlugin implements BackgroundTaskFailoverPlugin {
  final static var BATCH_PROCESSES_REQUIRING_MANUAL_CLEANUP : Set<BatchProcessType> = { /* TODO */ }

  final static var MESSAGE_DESTINATIONS_REQUIRING_MANUAL_CLEANUP : Set<Integer> = { /* TODO */ }

  final static var STARTABLE_PLUGINS_REQUIRING_MANUAL_CLEANUP : Set<String>  = { /* TODO */ }

  final static var FAILOVER_TIMEOUT = 60 // 60 seconds. This is the max time required to call external monitoring services

  override function handleBatchProcessFailover(type : BatchProcessType, task : FailoverTaskInfo) : FailoverHandlingResult {
    notifyExternalMonitoringAboutExpiredLease(task)
    return FailoverHandlingResult.postpone(TimeUnit.MINUTES, 3)
  }

  override function handleMessageDestinationFailover(destinationId : int, task : FailoverTaskInfo) : FailoverHandlingResult {
    notifyExternalMonitoringAboutExpiredLease(task)
    return FailoverHandlingResult.postpone(TimeUnit.MINUTES, 3)
  }

  override function handlePreprocessorNodeFailover(destinationId: int, nodeId: int, task: FailoverTaskInfo): FailoverHandlingResult {
    notifyExternalMonitoringAboutExpiredLease(task)
    return FailoverHandlingResult.postpone(TimeUnit.MINUTES, 3)
  }

  override function handleStartablePluginFailover(pluginName : String, task : FailoverTaskInfo) : FailoverHandlingResult {
    notifyExternalMonitoringAboutExpiredLease(task)
    return FailoverHandlingResult.postpone(TimeUnit.MINUTES, 3)
  }

  function notifyExternalMonitoringAboutExpiredLease(task : FailoverTaskInfo) {
    // TODO: implement
  }

  override property get FailoverTimeout() : int {
    return FAILOVER_TIMEOUT
  }

  override property get NodeFailureHandler() : NodeFailureHandler {
    return new NodeFailureHandler() {
      override function isManualCleanupRequiredForBatchProcess( type : BatchProcessType, serverIsRestarting : boolean ) : boolean {
        return BATCH_PROCESSES_REQUIRING_MANUAL_CLEANUP.contains(type)
      }

      override function isManualRestartRequiredForMessageDestination( destinationId : int, serverIsRestarting : boolean ) : boolean {
        return MESSAGE_DESTINATIONS_REQUIRING_MANUAL_CLEANUP.contains(destinationId)
      }

      override function isManualRestartRequiredForStartablePlugin( pluginName : String, serverIsRestarting : boolean ) : boolean {
        return STARTABLE_PLUGINS_REQUIRING_MANUAL_CLEANUP.contains(pluginName)
      }
    }

  }
}

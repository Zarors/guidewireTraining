package gw.api.system.cluster

uses gw.api.tools.ClusterMembersData
uses gw.api.system.PLLoggerCategory
uses java.util.Date
uses java.util.concurrent.TimeUnit
uses java.util.Set
uses java.lang.Integer

@Export
class PassiveExternalMonitoringBackgroundTaskFailoverPlugin implements BackgroundTaskFailoverPlugin {
  final static var BATCH_PROCESSES_REQUIRING_MANUAL_CLEANUP : Set<BatchProcessType> = { /* TODO */ }

  final static var MESSAGE_DESTINATIONS_REQUIRING_MANUAL_CLEANUP : Set<Integer> = { /* TODO */ }

  final static var STARTABLE_PLUGINS_REQUIRING_MANUAL_CLEANUP : Set<String>  = { /* TODO */ }

  final static var STARTUP_TIMEOUT = 10 * 60 // 10 minutes in seconds
  final static var RECOVER_AFTER_DATABASE_OUTAGE_TIMEOUT = 5 * 60 // 10 minutes in seconds

  final static var FAILOVER_TIMEOUT = 60 // 60 seconds. This is the max time required to call external monitoring services

  final var _startTime  = Date.CurrentDate.Time

  override function handleBatchProcessFailover(type : BatchProcessType, task : FailoverTaskInfo) : FailoverHandlingResult {
    return failover(task)
  }

  override function handleMessageDestinationFailover(destinationId : int, task : FailoverTaskInfo) : FailoverHandlingResult {
    return failover(task)
  }

  override function handlePreprocessorNodeFailover(destinationId: int, nodeId: int, task: FailoverTaskInfo): FailoverHandlingResult {
    return failover(task)
  }

  override function handleStartablePluginFailover(pluginName : String, task : FailoverTaskInfo) : FailoverHandlingResult {
    return failover(task)
  }

  function failover(task : FailoverTaskInfo) : FailoverHandlingResult {
    // Postpone failover if we started less than 10 minutes ago. Give other servers some time to cleanup after themselves
    var thisNodeUptime = (Date.CurrentDate.Time - _startTime) / 1000
    if (thisNodeUptime < STARTUP_TIMEOUT) {
      return FailoverHandlingResult.postpone(TimeUnit.SECONDS, STARTUP_TIMEOUT - thisNodeUptime)
    }

    // -1 if the server is down
    var uptimeSec = uptimeOfNodeFromExternalMonitoring(task.ServerId)
    var databaseUptimeSec = uptimeOfTheDatabase()

    if (uptimeSec < 0) { // server is down: lets clean up after it
      new ClusterMembersData().nodeFailed(task.ServerId ) // this will cleanup all active background tasks left after that server
      return FailoverHandlingResult.handled()
    } else if (uptimeSec < STARTUP_TIMEOUT) { // server has just started lets wait a bit, it must cleanup after old process itself
      return FailoverHandlingResult.postpone(TimeUnit.SECONDS, STARTUP_TIMEOUT - uptimeSec)
    } else if (databaseUptimeSec < RECOVER_AFTER_DATABASE_OUTAGE_TIMEOUT) { // if the database was down recently give all nodes some time to recover (renew leases)
      return FailoverHandlingResult.postpone(TimeUnit.SECONDS, RECOVER_AFTER_DATABASE_OUTAGE_TIMEOUT - databaseUptimeSec)
    } else { // server is running for more than 10 minutes, expired lease means it is in some error state
      if (killNodeWithExternalMonitoring(task.ServerId)) {
        new ClusterMembersData().nodeFailed(task.ServerId) // this will cleanup all active background tasks left after that server
        startNodeWithExternalMonitoring(task.ServerId) // this is optional
        return FailoverHandlingResult.handled()
      } else {
        // could not kill the server, requires manual intervention!
        return FailoverHandlingResult.fail()
      }
    }
  }

  override property get FailoverTimeout() : int {
    return FAILOVER_TIMEOUT
  }

  function uptimeOfNodeFromExternalMonitoring(serverId: String) : int {
    // TODO : implement
    return -1
  }

  function uptimeOfTheDatabase() : int {
    // TODO : implement
    return -1
  }

  function killNodeWithExternalMonitoring(serverId: String) : boolean {
    // TODO: implement
    return false;
  }

  function startNodeWithExternalMonitoring(serverId: String) : boolean {
    // TODO: implement
    return false;
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

package gw.wsi.pl

uses gw.api.database.AWRReportUserSettings
uses gw.api.database.DatabaseSnapshotInfo
uses gw.api.webservice.systemTools.QueryStoreRuntimeStatsIntervalDTO
uses gw.api.system.cluster.ClusterState
uses gw.api.system.cluster.ComponentType
uses gw.api.system.server.ShutdownOptions
uses gw.api.tools.FilenameDigestPair
uses gw.api.tools.ProcessID
uses gw.api.webservice.exception.RequiredFieldException
uses gw.api.webservice.exception.ServerStateException
uses gw.api.webservice.systemTools.ServerVersion
uses gw.api.webservice.systemTools.SessionData
uses gw.api.webservice.systemTools.SystemRunlevel
uses gw.api.webservice.systemTools.SystemToolsImpl
uses gw.api.webservice.systemTools.UpdateTableStatisticsData
uses gw.util.SystemOutLogger.LoggingLevel
uses gw.xml.ws.WsiAuthenticationException
uses gw.xml.ws.annotation.WsiAvailability
uses gw.xml.ws.annotation.WsiExportable
uses gw.xml.ws.annotation.WsiExposeEnumAsString
uses gw.xml.ws.annotation.WsiGenInToolkit
uses gw.xml.ws.annotation.WsiPermissions
uses gw.xml.ws.annotation.WsiWebService

uses java.util.stream.Collectors

@WsiWebService("http://guidewire.com/pl/ws/gw/wsi/pl/SystemToolsAPI")
@WsiAvailability(MAINTENANCE)
@WsiExposeEnumAsString(typekey.WorkItemSetState)
@WsiGenInToolkit
@Export
class SystemToolsAPI {

  /**
   * Get the version of the server, including application version and schema version.
   * The application version is in the format: <tt>[major].[minor].[build]</tt>.
   * The scheme version is in the format: <tt>[base].[vertical]</tt>.
   *
   * @return  Version of the server, including application version and schema version.
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function getVersion() : ServerVersion {
    return  new SystemToolsImpl().getVersion()
  }

  /**
   * Submit the consistency checks batch job on the underlying physical database.
   *
   * @param tablesToCheck                null - check all tables, else array of tables names to check
   * @param consistencyCheckTypesToCheck null - check all types, else array of types to check
   *                                     Must be valid <code>ConsistencyCheckType</code>s.
   * @return ProcessID  Describes results of consistency checks
   */
  @WsiPermissions({SystemPermissionType.TC_TOOLSINFOVIEW, SystemPermissionType.TC_SOAPADMIN})
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(ServerStateException,"for errors production the report")
  public function submitDBCCBatchJob(tablesToCheck : String[], consistencyCheckTypesToCheck : String[]) : ProcessID {
    return new SystemToolsImpl().submitDBCCBatchJob( tablesToCheck, consistencyCheckTypesToCheck )
  }

  /**
   * Returns the state of the consistency checks process. Only one set of consistency checks can be running at
   * any given moment.
   *
   * @return the state of the consistency checks process
   */
  @WsiPermissions({SystemPermissionType.TC_TOOLSINFOVIEW, SystemPermissionType.TC_SOAPADMIN})
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(ServerStateException,"for errors production the report")
  public function getDBCCState() : typekey.WorkItemSetState {
    return new SystemToolsImpl().getDBCCState()
  }

  /**
   * Run the update stats process on the underlying physical database. Please use isUpdateStatsRunning() to check on
   * the state of the run.
   *
   * @param description null - Description of the job
   * @param incremental true: the process should perform an incremental update; false: the process should perform a full upgrade
   */
  @WsiPermissions({SystemPermissionType.TC_TOOLSINFOVIEW, SystemPermissionType.TC_SOAPADMIN})
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function submitUpdateStats(description : String, incremental : boolean) {
    new SystemToolsImpl().submitUpdateStats( description, incremental )
  }

  /**
   * Cancel the update stats process if running. Please use getUpdateStatsState() to check on the state of the run.
   */
  @WsiPermissions({SystemPermissionType.TC_TOOLSINFOVIEW, SystemPermissionType.TC_SOAPADMIN})
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function cancelUpdateStats() {
    new SystemToolsImpl().cancelUpdateStats()
  }

  /**
   * Returns the state of the update stats process. Only one update stats process can be running at
   * any given moment.
   *
   * @return the state of the update stats process
   */
  @WsiPermissions({SystemPermissionType.TC_TOOLSINFOVIEW, SystemPermissionType.TC_SOAPADMIN})
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function getUpdateStatsState() : typekey.WorkItemSetState {
    return new SystemToolsImpl().getUpdateStatsState()
  }

  /**
   * Retrieve the latest N SQL Server Query Store runtime stats intervals
   *
   * @param numIntervals                 Number of intervals to retrieve.
   *
   * @return String[]                    Requested Query Store runtime stats interval information
   * @throws gw.api.webservice.exception.PermissionException SOAPException
   */
  @WsiPermissions({SystemPermissionType.TC_TOOLSINFOVIEW, SystemPermissionType.TC_SOAPADMIN})
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function getRecentQueryStoreRuntimeStatsIntervalInfo(numIntervals : int) : QueryStoreRuntimeStatsIntervalDTO[] {
    return new SystemToolsImpl().getRecentQueryStoreRuntimeStatsIntervalInfo(numIntervals)
  }

  /**
   * Submit the SQL Server DMV Performance Report batch job. This version of the report will not include
   * an analysis of the Query Store statistics.
   *
   * @param includeDatabaseStatistics Whether to snapshot the state of the database statistics
   *
   * @return ProcessID  pid of batch job
   */
  @WsiPermissions({SystemPermissionType.TC_TOOLSINFOVIEW, SystemPermissionType.TC_SOAPADMIN})
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(ServerStateException,"for errors production the report")
  public function submitSqlServerPerfReportWithoutQueryStoreBatchJob(includeDatabaseStatistics : boolean) : ProcessID {
    return new SystemToolsImpl().submitSqlServerPerfReportBatchJob(includeDatabaseStatistics)
  }

  /**
   * Submit the SQL Server DMV Performance Report batch job. This version of the report will include an
   * analysis of the Query Store statistics. The begin and end intervals are required. If they are the same,
   * only the statistics for that interval will be analyzed.
   *
   * @param includeDatabaseStatistics Whether to snapshot the state of the database statistics
   * @param beginIntervalID first interval in the Query Store, exclusive, on which to run the report
   * @param endIntervalID last interval in the Query Store, inclusive, on which to run the report
   *
   * @return ProcessID  pid of batch job
   */
  @WsiPermissions({SystemPermissionType.TC_TOOLSINFOVIEW, SystemPermissionType.TC_SOAPADMIN})
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(ServerStateException,"for errors production the report")
  public function submitSqlServerPerfReportWithQueryStoreBatchJob(includeDatabaseStatistics : boolean, beginIntervalID : long, endIntervalID : long) : ProcessID {
    return new SystemToolsImpl().submitSqlServerPerfReportBatchJob(includeDatabaseStatistics, beginIntervalID, endIntervalID)
  }

  /**
   * Retrieve the latest N Oracle AWR snapshots.
   *
   * @param numSnapshots                 Number of snapshots to retrieve.
   *
   * @return String[]                    Requested AWR snapshot information
   * @throws gw.api.webservice.exception.PermissionException SOAPException
   */
  @WsiPermissions({SystemPermissionType.TC_TOOLSINFOVIEW, SystemPermissionType.TC_SOAPADMIN})
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function getRecentAWRSnapshotInfo(numSnapshots : int) : DatabaseSnapshotInfo[] {
    return new SystemToolsImpl().getRecentAWRSnapshotInfo(numSnapshots)
  }

  /**
   * Submit the Oracle AWR Performance Report batch job with three parameters.
   *
   * @param awrReportUserSettings        all settings
   *
   * @return ProcessID  pid of batch job
   * @throws gw.api.webservice.exception.PermissionException SOAPException
   */
  @WsiPermissions({SystemPermissionType.TC_TOOLSINFOVIEW, SystemPermissionType.TC_SOAPADMIN})
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(ServerStateException,"for errors production the report")
  public function submitAwrReportBatchJob(awrReportUserSettings : AWRReportUserSettings) : ProcessID {
   return new SystemToolsImpl().submitAwrReportBatchJob( awrReportUserSettings )
  }

  /**
   * Retrieve the information about the latest N Oracle AWR downloads.
   *
   * @param numDownloads                 How many AWR downloads for which to return info.
   *                                     Passing 0 means to return all available.
   *
   * @return String[]                    Requested AWR download information
   * @throws gw.api.webservice.exception.PermissionException SOAPException
   */
  @WsiPermissions({SystemPermissionType.TC_TOOLSINFOVIEW, SystemPermissionType.TC_SOAPADMIN})
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function getPerfReportsInfo(numDownloads : int) : String[] {
    return new SystemToolsImpl().getPerfDownloadsInfo(numDownloads)
  }

  /**
   * Obtains the set of SQL statements that are required to update database statistics
   *
   * @return An array of UpdateTableStatisticsData items, one for each table that has
   *         updateable statistics
   */
  @WsiPermissions({SystemPermissionType.TC_TOOLSINFOVIEW, SystemPermissionType.TC_SOAPADMIN})
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function getUpdateTableStatisticsData() : UpdateTableStatisticsData[] {
    return new SystemToolsImpl().getUpdateTableStatisticsData()
  }

  /**
   * Obtains the set of SQL statements that are required to update database statistics
   * based on user specific threshold value that specifies percentage of table has been
   * modified
   *
   * @return An array of UpdateTableStatisticsData items, one for each table that has
   *         updateable statistics
   */
  @WsiPermissions({SystemPermissionType.TC_TOOLSINFOVIEW, SystemPermissionType.TC_SOAPADMIN})
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function getIncrementalUpdateTableStatisticsData() : UpdateTableStatisticsData[] {
    return new SystemToolsImpl().getIncrementalUpdateTableStatisticsData()
  }

  /**
   * Creates a report of the state of the database catalog statistics for all tables.
   *
   * @return a zip file of an HTML report to view the database catalog statistics.
   */
  @WsiPermissions({SystemPermissionType.TC_TOOLSINFOVIEW, SystemPermissionType.TC_SOAPADMIN})
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function reportDatabaseCatalogStatistics() : byte[]  {
    return new SystemToolsImpl().reportDatabaseCatalogStatistics()
  }

  /**
   * Creates a report of the state of the database catalog statistics for all tables.
   *
   * @param tables         null - report on all tables, else array of tables names to on which to report
   * @param stagingTables  null - report on all staging tables, else array of staging tables names to on which to report
   * @param typelistTables null - report on all typelist tables, else array of typelist tables names to on which to report
   * @return a zip file of an HTML report to view the database catalog statistics on the selected tables.
   */
  @WsiPermissions({SystemPermissionType.TC_TOOLSINFOVIEW, SystemPermissionType.TC_SOAPADMIN})
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(ServerStateException,"for errors production the report")
  public function reportPartialDatabaseCatalogStatistics(tables : String[], stagingTables : String[], typelistTables : String[]): byte[] {
   return new SystemToolsImpl().reportPartialDatabaseCatalogStatistics(tables, stagingTables, typelistTables)
  }

  /**
   * Verify that the data mode matches the physical database
   * @return String[] Any differences between the data model and the physical database.
   */
  @WsiPermissions({SystemPermissionType.TC_TOOLSINFOVIEW, SystemPermissionType.TC_SOAPADMIN})
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function verifyDatabaseSchema() : String[]{
    return new SystemToolsImpl().verifyDatabaseSchema()
  }

  /**
   * Sets the run level of this specific server. If the server is currently undergoing a runlevel change, this method will block
   * until that level change has completed.
   * <p/>
   * The valid run levels that the server can be set to through this method are <code>SystemRunlevel.GW_DB_MAINTENANCE</code>,
   * <code>SystemRunlevel.GW_MAINTENANCE</code>, and <code>SystemRunlevel.GW_MULTIUSER</code>.  See the definitions of those constants
   * for more information.
   *
   * @param runLevel The level at which the server should run.
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(ServerStateException,"for errors setting the run level")
  public function setRunlevel(runLevel : SystemRunlevel){
    new SystemToolsImpl().setRunlevel(runLevel)
  }

  /**
   * Gets the run level of the server.  See the definition of the run level constants for details of how to interpret
   * this value.
   *
   * @return An int containing the runlevel
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function getRunlevel() : SystemRunlevel{
    return new SystemToolsImpl().getRunlevel()
  }

  /**
   * Gets the highest run level of the cluster.  See the definition of the run level constants for details of how to
   * interpret this value.
   *
   * @return An int containing the highest runlevel of the cluster.
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function getHighestRunlevel() : SystemRunlevel {
    return new SystemToolsImpl().getHighestRunlevel()
  }

  /**
   * Returns all server session information.  The session information is returned as an array of SessionData objects,
   * each of which contains the user's name, ID, and session ID for a session that's currently open.
   *
   * @return all server session information.
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function getActiveSessionData() : SessionData[] {
    return new SystemToolsImpl().getActiveSessionData()
  }

  /**
   * Dynamically updates the logging level of the given logger.
   *
   * @param logger The name of the logger to be updated - this should be a qualified class or package
   * @param level One of 5 possible logging levels: INFO, DEBUG, WARN, ERROR, TRACE
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(RequiredFieldException, "if logger is not defined")
  public function updateLoggingLevel(logger : String, level : LoggingLevel) {
    if (level == null) {
      throw new IllegalArgumentException("Level must be one of INFO, DEBUG, WARN, ERROR, TRACE")
    }
    new SystemToolsImpl().updateLoggingLevel(logger, level.name())
  }

  /**
   * Causes a reload of the log4j2.xml.
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function reloadLoggingConfig(){
    new SystemToolsImpl().reloadLoggingConfig()
  }

  /**
   * Get a list of all of the logger categories available in the system. These can be used
   * directly in log4j2.xml.
   *
   * @return An array of Strings containing all logger categories in the system
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function getLoggingCategories() : String[] {
    return new SystemToolsImpl().getLoggingCategories()
  }

  /**
  * Checks config represented by set of file name/file digest pairs.
  *
  * @return report about config check results
  */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function verifyConfig(appVerifiersConfigFP : String, plVerifiersConfigFP : String, fileDigestPairs : FilenameDigestPair[]) : String {
    return new SystemToolsImpl().verifyConfig(appVerifiersConfigFP, plVerifiersConfigFP, fileDigestPairs)
  }

  /**
   * Checks config represented by set of file name/file digest pairs. Calculating of local digests occurs on server side
   * using server's external configuration properties to perform substitution in local configuration files in case substitution is performed,
   * all other files are digested on client.
   *
   * @return report about config check results
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function verifyConfigUsingRemoteExtCfg(appVerifiersConfigFP : String, plVerifiersConfigFP : String, compressedFiles : FilenameDigestPair[]) : String {
    return new SystemToolsImpl().verifyConfigUsingRemoteExtCfg(appVerifiersConfigFP, plVerifiersConfigFP, compressedFiles)
  }

  /**
   * Sets the intention to perform a FULL upgrade. Please refer to the docs for more details.
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function startFullUpgrade() {
    new SystemToolsImpl().startFullUpgrade()
  }

  /**
   * Get a list of roles that are supported by this server.
   *
   * @return An array of Strings containing all role's code
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function getServerRoles() : String[] {
    return new SystemToolsImpl().getServerRoles()
  }

  /**
   * Get the server id of the server at this address and port
   *
   * @return A string with the server id
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function getServerId() : String {
    return new SystemToolsImpl().getServerId()
  }

  /**
   * Returns a list of all nodes in the cluster, their roles, and what distributed components they run.
   *
   * @return a list of all nodes states in the cluster.
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function getClusterState() : ClusterState {
    return new SystemToolsImpl().ClusterState
  }

  /**
   * Cleans and releases resources (batch processes, plugins, message destinations etc) holding by a specified node.
   *
   * This method might have a dangerous impact if the node is still running.
   *
   * @param serverId Server Id.
   * @param evenIfInCluster Consider node as failed even if it is still in the cluster.
   */
  @Throws(IllegalArgumentException,"If the node is in the cluster and evenIfInCluster is false")
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function nodeFailed(serverId : String, evenIfInCluster : boolean) {
    new SystemToolsImpl().nodeFailed(serverId, evenIfInCluster)
  }

  /**
   * Schedules the shutdown of a specified server.
   *
   * @param serverId server id
   * @param options shutdown options
   * @return true if the shutdown has been scheduled, false if the shutdown has been scheduled before
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function scheduleShutdown(serverId : String,  options : ShutdownOptions) : boolean {
    return new SystemToolsImpl().scheduleShutdown(serverId, options)
  }

  /**
   * Cancels shutdown of a specified server.
   *
   * @param serverId server id
   * @return true if the shutdown has been canceled, false if there was no shutdown to cancel
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function cancelShutdown(serverId : String) : boolean {
    return new SystemToolsImpl().cancelShutdown(serverId)
  }

  /**
   * Completes component failover.
   *
   * @param componentType The component type.
   * @param componentId The component unique id.
   */
  @Throws(IllegalArgumentException,"If the component not found")
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function completeFailedFailover(componentType : ComponentType, componentId : String) {
    new SystemToolsImpl().completeFailedFailover(componentType, componentId)
  }

  /**
   * Requests component transfer.
   *
   * @param componentType The component type.
   * @param componentId The component unique id.
   * @param targetOwner The target owner.
   */
  @Throws(IllegalArgumentException,"If the component not found")
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function requestComponentTransfer(componentType : ComponentType, componentId : String, targetOwner : String) {
    new SystemToolsImpl().requestComponentTransfer(componentType, componentId, targetOwner)
  }

  /**
   * Returns a collection of hashes of all entities and typelists.
   *
   * Format of name is 'entity.EntityName` or 'typelist.TypelistName'.
   * Hash for every entity / typelist is aggregated from all files that defines
   * entity.
   *
   * For example 'entity.Document' = 'abc' hash might be computed from combination of
   * 'Document.eti', 'Document.eix' and 'Document.etx' files.
   *
   * Normally if hash of the same entry changed that means that the entry
   * got some semantic changes. E.g. changing formatting of files or modification
   * of field descriptions does not lead to a change of the hash of entry, while
   * adding a new field does.
   * 
   * Note: changes in the supertype of a type DO NOT change its hash. E.g.
   * change of 'entity.Contact' will change hash entry of 'entity.Contact' but
   * not 'entity.Person'.
   *
   * This method might be useful if you want to detect changes in data model
   * of particular entity type or typelist.
   * @return
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function getMetadataHashes(): List<MetadataHash> {
    return SystemToolsImpl.getMetadataHashes().entrySet().stream()
        .map(\nameChecksum -> {
          var entry = new MetadataHash();
          entry.Name = nameChecksum.Key
          entry.Hash = nameChecksum.Value
          return entry
        })
        .collect(Collectors.toList<MetadataHash>())
  }

  @WsiExportable("http://guidewire.com/pl/ws/gw/wsi/pl/SystemToolsAPI/MetadataHash")
  public static class MetadataHash {
    var _name: String as Name
    var _hash: String as Hash
  }
}

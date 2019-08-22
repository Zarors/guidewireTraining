package gw.wsi.pl

uses gw.api.tools.ProcessID
uses gw.api.webservice.tableImport.TableImportImpl
uses gw.api.webservice.tableImport.TableImportResult
uses gw.xml.ws.annotation.WsiWebService
uses gw.xml.ws.annotation.WsiAvailability
uses gw.xml.ws.WsiAuthenticationException
uses gw.xml.ws.annotation.WsiGenInToolkit

uses java.lang.Deprecated


/**
 * This interface provides methods for integrity checking and loading data via
 * the  staging tables.
 * <p/>
 * In particular, it allows the caller to instruct the server
 * to perform the following staging table operations:
 * <ol>
 * <li>Clear error table.</li>
 * <li>Clear exclusion table.</li>
 * <li>Clear staging tables.</li>
 * <li>Delete rows from staging tables based on contents of exclusion table.</li>
 * <li>Populate exclusion table with rows to be excluded.</li>
 * <li>Integrity check the contents of the staging tables.</li>
 * <li>Integrity check the contents of the Zone staging tables and load Zone source tables if no errors.</li>
 * <li>Integrity check the contents of the staging tables and load source tables if no errors.</li>
 * </ol>
 */
@SuppressWarnings("unused")
@WsiWebService("http://guidewire.com/pl/ws/gw/wsi/pl/TableImportAPI")
@WsiAvailability(MAINTENANCE)
@WsiGenInToolkit
@Export
class TableImportAPI {
  /**
   * Instructs the server to clear the error tables.
   *
   * @deprecated Use {@link #clearErrorTableAsBatchProcess()} and use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Deprecated
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function clearErrorTable(){
    //noinspection GosuDeprecatedAPIUsage
    new TableImportImpl().clearErrorTable()
  }

  /**
   * Instructs the server to clear the error tables.
   *
   * @return a {@link gw.api.tools.ProcessID}. Use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function clearErrorTableAsBatchProcess() : ProcessID {
    return new TableImportImpl().clearErrorTableAsBatchProcess()
  }

  /**
   * Instructs the  server to clear the exclusion table.
   *
   * @deprecated Use {@link #clearExclusionTableAsBatchProcess()} and use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Deprecated
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function clearExclusionTable(){
    //noinspection GosuDeprecatedAPIUsage
    new TableImportImpl().clearExclusionTable()
  }

  /**
   * Instructs the  server to clear the exclusion table.
   *
   * @return a {@link gw.api.tools.ProcessID}. Use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function clearExclusionTableAsBatchProcess() : ProcessID {
    return new TableImportImpl().clearExclusionTableAsBatchProcess()
  }

  /**
   * Instructs the server to clear all staging tables.
   *
   * @deprecated Use {@link #clearStagingTablesAsBatchProcess()} and use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Deprecated
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function clearStagingTables(){
    //noinspection GosuDeprecatedAPIUsage
    new TableImportImpl().clearStagingTables()
  }

  /**
   * Instructs the server to clear all staging tables.
   *
   * @return a {@link gw.api.tools.ProcessID}. Use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function clearStagingTablesAsBatchProcess() : ProcessID {
    return new TableImportImpl().clearStagingTablesAsBatchProcess()
  }

  /**
   * Instructs the server to delete rows from staging tables
   * based on the contents of the exclusion table (delete all rows in all
   * staging tables where the LUWID matches a LUWID in the exclusion table.)
   *
   * @deprecated Use {@link #deleteExcludedRowsFromStagingTablesAsBatchProcess()} and use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Deprecated
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function deleteExcludedRowsFromStagingTables() {
    //noinspection GosuDeprecatedAPIUsage
    new TableImportImpl().deleteExcludedRowsFromStagingTables()
  }

  /**
   * Instructs the server to delete rows from staging tables
   * based on the contents of the exclusion table (delete all rows in all
   * staging tables where the LUWID matches a LUWID in the exclusion table.)
   * <p/>
   * The same as deleteExcludedRowsFromStagingTables except that the operation
   * is done asynchronously in a batch process.  Note that this batch process
   * can't be terminated.
   *
   * @return a {@link gw.api.tools.ProcessID}. Use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function deleteExcludedRowsFromStagingTablesAsBatchProcess() : ProcessID {
    return new TableImportImpl().deleteExcludedRowsFromStagingTablesAsBatchProcess()
  }

  /**
   * Instructs the server to populate the exclusion table
   * with rows to be excluded (add rows to the exclusion table for every
   * unique LUWID in the load error tables that is not already in the exclusion table).
   *
   * @deprecated Use {@link #populateExclusionTableAsBatchProcess()} and use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Deprecated
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function populateExclusionTable(){
    //noinspection GosuDeprecatedAPIUsage
    new TableImportImpl().populateExclusionTable()
  }

  /**
   * Instructs the  server to populate the exclusion table
   * with rows to be excluded (add rows to the exclusion table for every
   * unique LUWID in the error tables that is not already in the exclusion table).
   * <p/>
   * The same as deleteExcludedRowsFromStagingTables except that the operation
   * is done asynchronously in a batch process. Note that this batch process
   * can't be terminated.
   *
   * @return a {@link gw.api.tools.ProcessID}. Use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function populateExclusionTableAsBatchProcess(): ProcessID{
    return new TableImportImpl().populateExclusionTableAsBatchProcess()
  }

  /**
   * Instructs the  server to update the database statistics on the staging tables.
   * (Database statistics will not be updated on the other tables.)
   *
   * @deprecated Use {@link #updateStatisticsOnStagingTablesAsBatchProcess()} and use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Deprecated
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function updateStatisticsOnStagingTables(){
    //noinspection GosuDeprecatedAPIUsage
    new TableImportImpl().updateStatisticsOnStagingTables()
  }

  /**
   * Instructs the  server to update the database statistics on the staging tables.
   * (Database statistics will not be updated on the other tables.)  The same as updateStatisticsOnStagingTables
   * except that the process will be performed asynchronously in a batch process.  After completion,
   * the process status will contain the number of tables that were updated in the opsCompleted field.  
   * Note that this batch process can't be terminated.
   *
   * @return a {@link gw.api.tools.ProcessID}. Use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function updateStatisticsOnStagingTablesAsBatchProcess() : ProcessID {
    return new TableImportImpl().updateStatisticsOnStagingTablesAsBatchProcess()
  }

  /**
   * Instructs the  server to check the integrity of the contents of the staging
   * tables, inserting details about any failures into the load error tables.
   *
   * @param clearErrorTable        If true, the load error tables will be cleared
   *                               before executing integrity checking (defaults to true if this parameter is null).
   * @param populateExclusionTable If true, populate exclusion table with any newly
   *                               excluded rows before executing integrity checking (defaults to true if this parameter
   *                               is null).
   * @param allowRefsToExistingNonAdminRows  If true, rows in the staging tables are allowed to reference
   *                                         existing rows in any table, regardless of whether or not the tables
   *                                         are admin tables.
   * @param numThreadsIntegrityChecking If not null, overrides configured value of Loader attribute num-threads-integrity-checking.
   *                                    If 1, do not multithread integrity checks.  If greater than 1, do multithread.
   * @return a TableImportResult object containing load error information and
   *         any raised exception.
   *
   * @deprecated Use {@link #integrityCheckStagingTableContentsAsBatchProcess()} and use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Deprecated
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function integrityCheckStagingTableContents(
    clearErrorTable : Boolean, populateExclusionTable : Boolean,
    allowRefsToExistingNonAdminRows : Boolean,
    numThreadsIntegrityChecking : Integer) : TableImportResult
  {
    //noinspection GosuDeprecatedAPIUsage
    return new TableImportImpl().integrityCheckStagingTableContents(
         clearErrorTable, 
         populateExclusionTable,
         allowRefsToExistingNonAdminRows,
         numThreadsIntegrityChecking)
  }

  /**
   * Instructs the  server to check the integrity of the contents of the staging
   * tables, inserting details about any failures into the load error tables.  Works like
   * integrityCheckStagingTableContents, but does so in a batch process. After
   * completion, the process status will indicate whether or not the load succeeded, and the
   * failedOps field will contain the number of integrity check errors that occurred (if any).  Note that this batch process
   * can't be terminated.
   *
   * @param clearErrorTable        If true, the load error tables will be cleared
   *                               before executing integrity checking (defaults to true if this parameter is null).
   * @param populateExclusionTable If true, populate exclusion table with any newly
   *                               excluded rows before executing integrity checking (defaults to true if this parameter
   *                               is null).
   * @param allowRefsToExistingNonAdminRows  If true, rows in the staging tables are allowed to reference
   *                                         existing rows in any table, regardless of whether or not the tables
   *                                         are admin tables.
   * @param numThreadsIntegrityChecking If not null, overrides configured value of Loader attribute num-threads-integrity-checking.
   *                                    If 1, do not multithread integrity checks.  If greater than 1, do multithread.
   *
   * @return a {@link gw.api.tools.ProcessID}. Use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function integrityCheckStagingTableContentsAsBatchProcess(
    clearErrorTable : Boolean,
    populateExclusionTable : Boolean,
    allowRefsToExistingNonAdminRows : Boolean,
    numThreadsIntegrityChecking : Integer) : ProcessID{
      return new TableImportImpl().integrityCheckStagingTableContentsAsBatchProcess( 
         clearErrorTable, 
         populateExclusionTable,
         allowRefsToExistingNonAdminRows,
         numThreadsIntegrityChecking)
    }

  /**
   * Instructs the server to check the integrity of the contents of the staging
   * tables, inserting details about any failures into the error tables. If no integrity check
   * errors are detected, the server will load the source tables (the main application
   * tables) with the contents of the staging tables.
   *
   * @param clearErrorTable        If true, the load error tables will be cleared
   *                               before executing integrity checking (defaults to true if this parameter is null).
   * @param populateExclusionTable If true, populate exclusion table with any newly
   *                               excluded rows before executing integrity checking (defaults to true if this parameter
   *                               is null).
   * @param updateDBStatisticsWithEstimates
   *                               If true, then update the database statistics on any table that will be loaded with
   *                               estimated changes based on the contents of the associated staging table.  When
   *                               loading large amounts of data which will cause a source table to grow significantly, the optimizer could choose
   *                               a bad query plan based on the existing state of the database statistics unless the loader updates the database
   *                               statistics to reflect the expected size of the table after the load has completed.  This
   *                               parameter is only meaningful when running against Oracle.
   * @param allowRefsToExistingNonAdminRows  If true, rows in the staging tables are allowed to reference
   *                                         existing rows in any table, regardless of whether or not the tables
   *                                         are admin tables.
   * @param numThreadsIntegrityChecking If not null, overrides configured value of Loader attribute num-threads-integrity-checking.
   *                                    If 1, do not multithread integrity checks.  If greater than 1, do multithread.
   * @return a TableImportResult object containing load error information and
   *         any raised exception.
   *
   * @deprecated Use {@link #integrityCheckStagingTableContentsAndLoadSourceTablesAsBatchProcess(Boolean, Boolean, Boolean, Boolean, Integer)} and use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Deprecated
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function integrityCheckStagingTableContentsAndLoadSourceTables(
    clearErrorTable : Boolean, 
    populateExclusionTable : Boolean,
    updateDBStatisticsWithEstimates : Boolean, 
    allowRefsToExistingNonAdminRows : Boolean,
    numThreadsIntegrityChecking : Integer
    ) : TableImportResult
  {
    //noinspection GosuDeprecatedAPIUsage
    return new TableImportImpl().integrityCheckStagingTableContentsAndLoadSourceTables(
         clearErrorTable, 
         populateExclusionTable,
         updateDBStatisticsWithEstimates,
         allowRefsToExistingNonAdminRows,
         numThreadsIntegrityChecking)
  }

  /**
   * Instructs the server to check the integrity of the contents of the Zone staging
   * tables, inserting details about any failures into the error tables. If no integrity check
   * errors are detected, the server will load the Zone source tables (the Zone main application
   * tables) with the contents of the staging tables.
   *
   * @param clearErrorTable        If true, the load error tables will be cleared
   *                               before executing integrity checking (defaults to true if this parameter is null).
   * @param populateExclusionTable If true, populate exclusion table with any newly
   *                               excluded rows before executing integrity checking (defaults to true if this parameter
   *                               is null).
   * @param updateDBStatisticsWithEstimates
   *                               If true, then update the database statistics on any table that will be loaded with
   *                               estimated changes based on the contents of the associated staging table.  When
   *                               loading large amounts of data which will cause a source table to grow significantly, the optimizer could choose
   *                               a bad query plan based on the existing state of the database statistics unless the loader updates the database
   *                               statistics to reflect the expected size of the table after the load has completed.  This
   *                               parameter is only meaningful when running against Oracle.
   * @param numThreadsIntegrityChecking If not null, overrides configured value of Loader attribute num-threads-integrity-checking.
   *                                    If 1, do not multithread integrity checks.  If greater than 1, do multithread.
   * @return a TableImportResult object containing load error information and
   *         any raised exception.
   *
   * @deprecated Use {@link #integrityCheckZoneStagingTableContentsAndLoadZoneSourceTablesAdBatchProcess(Boolean, Boolean, Boolean, Integer)} and use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Deprecated
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function integrityCheckZoneStagingTableContentsAndLoadZoneSourceTables(
    clearErrorTable : Boolean, 
    populateExclusionTable : Boolean,
    updateDBStatisticsWithEstimates : Boolean,
    numThreadsIntegrityChecking : Integer
    ) : TableImportResult
  {
    //noinspection GosuDeprecatedAPIUsage
    return new TableImportImpl().integrityCheckZoneStagingTableContentsAndLoadZoneSourceTables(
         clearErrorTable, 
         populateExclusionTable,
         updateDBStatisticsWithEstimates,
         numThreadsIntegrityChecking)
  }

  /**
   * Instructs the server to check the integrity of the contents of the Zone staging
   * tables, inserting details about any failures into the error tables. If no integrity check
   * errors are detected, the server will load the Zone source tables (the Zone main application
   * tables) with the contents of the staging tables.
   *
   * @param clearErrorTable        If true, the load error tables will be cleared
   *                               before executing integrity checking (defaults to true if this parameter is null).
   * @param populateExclusionTable If true, populate exclusion table with any newly
   *                               excluded rows before executing integrity checking (defaults to true if this parameter
   *                               is null).
   * @param updateDBStatisticsWithEstimates
   *                               If true, then update the database statistics on any table that will be loaded with
   *                               estimated changes based on the contents of the associated staging table.  When
   *                               loading large amounts of data which will cause a source table to grow significantly, the optimizer could choose
   *                               a bad query plan based on the existing state of the database statistics unless the loader updates the database
   *                               statistics to reflect the expected size of the table after the load has completed.  This
   *                               parameter is only meaningful when running against Oracle.
   * @param numThreadsIntegrityChecking If not null, overrides configured value of Loader attribute num-threads-integrity-checking.
   *                                    If 1, do not multithread integrity checks.  If greater than 1, do multithread.
   *
   * @return a {@link gw.api.tools.ProcessID}. Use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function integrityCheckZoneStagingTableContentsAndLoadZoneSourceTablesAdBatchProcess(
    clearErrorTable : Boolean,
    populateExclusionTable : Boolean,
    updateDBStatisticsWithEstimates : Boolean,
    numThreadsIntegrityChecking : Integer
    ) : ProcessID
  {
    return new TableImportImpl().integrityCheckZoneStagingTableContentsAndLoadZoneSourceTablesAsBatchProcess(
         clearErrorTable,
         populateExclusionTable,
         updateDBStatisticsWithEstimates,
         numThreadsIntegrityChecking)
  }

  /**
   * Instructs the server to check the integrity of the contents of the staging
   * tables, inserting details about any failures into the load error tables. If no integrity check
   * errors are detected, the server will load the source tables (the main application
   * tables) with the contents of the staging tables.  This method does the load asynchronously
   * via the batch process mechanism, and the process ID that is returned can be used to query
   * the status of the load and find out if it succeeded or failed (or is still running).  After
   * completion, the process status will indicate whether or not the load succeeded, and the
   * failedOps field will contain the number of validation errors that occurred (if any).  Note that this batch process
   * can't be terminated.
   *
   * @param clearErrorTable        If true, the load error tables will be cleared
   *                               before executing integrity checking (defaults to true if this parameter is null).
   * @param populateExclusionTable If true, populate exclusion table with any newly
   *                               excluded rows before executing integrity checking (defaults to true if this parameter
   *                               is null).
   * @param updateDBStatisticsWithEstimates
   *                               If true, then update the database statistics on any table that will be loaded with
   *                               estimated changes based on the contents of the associated staging table.  When
   *                               loading large amounts of data which will cause a source table to grow significantly, the optimizer could choose
   *                               a bad query plan based on the existing state of the database statistics unless the loader updates the database
   *                               statistics to reflect the expected size of the table after the load has completed.  This
   *                               parameter is only meaningful when running against Oracle.
   * @param allowRefsToExistingNonAdminRows  If true, rows in the staging tables are allowed to reference
   *                                         existing rows in any table, regardless of whether or not the tables
   *                                         are admin tables.
   * @param numThreadsIntegrityChecking If not null, overrides configured value of Loader attribute num-threads-integrity-checking.
   *                                    If 1, do not multithread integrity checks.  If greater than 1, do multithread.
   *
   * @return a {@link gw.api.tools.ProcessID}. Use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function integrityCheckStagingTableContentsAndLoadSourceTablesAsBatchProcess(
    clearErrorTable : Boolean, 
    populateExclusionTable : Boolean,
    updateDBStatisticsWithEstimates : Boolean, 
    allowRefsToExistingNonAdminRows : Boolean,
    numThreadsIntegrityChecking : Integer) : ProcessID
  {
    return new TableImportImpl().integrityCheckStagingTableContentsAndLoadSourceTablesAsBatchProcess( 
         clearErrorTable, 
         populateExclusionTable,
         updateDBStatisticsWithEstimates,
         allowRefsToExistingNonAdminRows,
         numThreadsIntegrityChecking)
  }

  /**
   * Encrypt columns configured to be encrypted in the staging tables
   *
   * @return The number of staging tables whose columns were encrypted

   * @deprecated Use {@link #encryptDataOnStagingTablesAsBatchProcess()} and use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion
   */
  @Deprecated
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function encryptDataOnStagingTables() : int
  {
    //noinspection GosuDeprecatedAPIUsage
    return new TableImportImpl().encryptDataOnStagingTables()
  }

  /**
   * Encrypt columns configured to be encrypted in the staging tables, running as a batch proces
   *
   * @return a {@link gw.api.tools.ProcessID}. Use MaintenanceToolsAPI#batchProcessStatusByID to poll for completion.
   *   The number of staging columns that were encrypted can be obtained by calling ProcessStatus#getOpsCompleted().
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function encryptDataOnStagingTablesAsBatchProcess() : ProcessID
  {
    return new TableImportImpl().encryptDataOnStagingTablesAsBatchProcess()
  }

  /**
   * Retrieve the information about the latest N Load History downloads.
   *
   * @param numDownloads                 How many Load History downloads for which to return info.
   *                                     Passing 0 means to return all available.
   *
   * @return String[]                    Requested Load History download information
   * @throws gw.api.webservice.exception.PermissionException SOAPException
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function getLoadHistoryReportsInfo(numDownloads : int) : String[] {
    return new TableImportImpl().getLoadHistoryDownloadsInfo(numDownloads)
  }

}

package gw.wsi.pl

uses gw.api.admin.BaseAdminUtil
uses gw.api.config.external.ConfigServiceInfo
uses gw.api.locale.DisplayKey
uses gw.api.system.PLConfigParameters
uses gw.api.tools.UpgradeInfo
uses gw.api.webservice.exception.DataConversionException
uses gw.api.webservice.importTools.ImportResults
uses gw.api.webservice.importTools.ImportToolsImpl
uses gw.transaction.Transaction
uses gw.xml.ws.annotation.WsiAvailability
uses gw.xml.ws.annotation.WsiExportable
uses gw.xml.ws.annotation.WsiGenInToolkit
uses gw.xml.ws.annotation.WsiPermissions
uses gw.xml.ws.annotation.WsiWebService

uses java.util.stream.Collectors

/**
 * AdminDataAPI is a remote interface to a set of tools for importing admin data XML to the server.
 */
@WsiWebService("http://guidewire.com/pl/ws/gw/wsi/pl/AdminDataAPI")
@WsiPermissions({SystemPermissionType.TC_SOAPADMIN})
@WsiAvailability(MAINTENANCE)
@WsiGenInToolkit
@Export
class AdminDataAPI {

  /**
   * Import XML data.
   * <p>
   * Note that importing data through this call does not generate events for the newly imported objects.
   * <p>
   * <b>WARNING</b>: this is <em>only</em> supported for administrative database tables (such as User)
   * because these XML import routines do not perform complete data validation tests on imported data.
   * Any other use (claims, policies, etc) is dangerous and is <b>NOT</b> supported
   *
   * @param xmlData The data to import, passed as a String.    This may not be null or empty.
   * @return Set of results of the import (number of entities imported by type, and so on).  If the import failed,
   * ImportResults will have the ok flag set to <code>false</code>, and the errorLog element will
   * contain descriptions of the errors that were encountered.
   */
  @Throws(DataConversionException, "If the data can't be imported because it violates duplicate key constraints, contains nulls in non-nullable fields, or otherwise can't be safely inserted into the database.")
  @Throws(IllegalArgumentException, "If xmlData is null or empty.")
  @Throws(UnsupportedOperationException, "If this API is disabled")
  @Throws(IllegalStateException, "If Rolling Upgrade in progress")
  public function importXmlData(xmlData: String): ImportResults {
    throwIfFeatureIsDisabled()
    throwIfRollingUpgradeInProgress()
    if (xmlData == null || xmlData.trim().length == 0) {
      throw new IllegalArgumentException("xmlData is either null or empty")
    }
    var importResults: ImportResults
    Transaction.runWithNewBundle(\bundle -> {
      importResults = new ImportToolsImpl().importExternalConfigXmlData(xmlData)
    })
    return importResults
  }

  /**
   * Export all available admin data.
   *
   * @return xml string representation
   */
  @Throws(UnsupportedOperationException, "If this API is disabled")
  @Throws(IllegalStateException, "If Rolling Upgrade in progress")
  public function exportEverything(): String {
    throwIfFeatureIsDisabled()
    throwIfRollingUpgradeInProgress()
    return BaseAdminUtil.exportConfigSupportedData()
  }

  /**
   * Export entities matching specified criteria.
   * See @link{ExportQuery} for fields description.
   *
   * @return encoded xml string
   */
  @Throws(UnsupportedOperationException, "If this API is disabled")
  @Throws(IllegalStateException, "If Rolling Upgrade in progress")
  public function export(conditions: List<EntityExportQuery>): String {
    throwIfFeatureIsDisabled()
    throwIfRollingUpgradeInProgress()
    var queries = conditions.stream().map(\dto -> {
      var baseQuery = new BaseAdminUtil.ExportQuery(dto.EntityType);
      baseQuery.PublicIds = dto.PublicIds
      baseQuery.ExportReferenced = dto.ExportReferenced
      baseQuery.IncludeRetired = dto.IncludeRetired
      if (dto.ModifiedAfter != null && dto.ModifiedAfter >= 0) {
        baseQuery.ModifiedAfter = new Date(dto.ModifiedAfter)
      }
      return baseQuery;
    }).collect(Collectors.toList<BaseAdminUtil.ExportQuery>())
    return BaseAdminUtil.exportConfigSupportedData(queries);
  }

  /**
   * Returns admin data info dto which contains information regarding
   * latest admin data version and import timestamp.
   *
   * @return admin data info dto
   */
  @Throws(UnsupportedOperationException, "If this API is disabled")
  @Throws(IllegalStateException, "If Rolling Upgrade in progress")
  public function getAdminDataInfo(): AdminDataInfo {
    throwIfFeatureIsDisabled()
    throwIfRollingUpgradeInProgress()
    var adminDataInfo = new AdminDataInfo();
    adminDataInfo.AdminDataVersion = ConfigServiceInfo.getAdminDataVersion()
    adminDataInfo.AdminDataImportTimestamp = ConfigServiceInfo.getAdminDataImportTimestamp()
    return adminDataInfo;
  }

  private function throwIfFeatureIsDisabled() {
    if (!PLConfigParameters.ConfigurationServiceEnabled.getValue()) {
      throw new UnsupportedOperationException("External configuration is disabled")
    }
  }

  private function throwIfRollingUpgradeInProgress() {
    if (UpgradeInfo.isRollingUpgradeProcessInProgress()) {
      throw new IllegalStateException(DisplayKey.get("ExportImport.Error.RollingUpgradeInProgress"))
    }
  }

  /**
   * Conditions to select set of entity instances for export.
   */
  @WsiExportable("http://guidewire.com/pl/ws/gw/wsi/pl/ExportQuery")
  public static class EntityExportQuery {
    // e.g. "ActivityPattern"
    private var _entityType: String as EntityType = null;
    // If public ids are specified then only entities from this set will be
    // considered for export.
    private var _publicIds: List<String> as PublicIds = null;
    // Export all entities referenced from matched one.
    private var _exportReferenced: boolean as ExportReferenced = false;
    // If specified, only entities modified not before given date will match
    // (NOT applied to referenced entities).
    private var _modifiedAfter: Long as ModifiedAfter = null;
    private var _includeRetired: boolean as IncludeRetired = false;
  }
}
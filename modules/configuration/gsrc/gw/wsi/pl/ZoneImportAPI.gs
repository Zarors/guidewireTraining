package gw.wsi.pl

uses gw.api.locale.DisplayKey
uses gw.api.webservice.exception.SOAPException
uses gw.api.webservice.zone.ZoneImportHelper
uses gw.xml.ws.annotation.WsiWebService
uses gw.xml.ws.WsiAuthenticationException
uses java.lang.IllegalArgumentException
uses gw.xml.ws.annotation.WsiGenInToolkit
/**
* IZoneImportAPI is a remote interface to a set of tools to import zone data (in csv format)
* into the staging tables.  See documentation for the zone data csv format.
*/
@WsiWebService("http://guidewire.com/pl/ws/gw/wsi/pl/ZoneImportAPI")
@WsiGenInToolkit
@Export
class ZoneImportAPI {

  /**
   * Import csv formatted data containg zone information.  See the documentation
   * for details of the expected csv format.
   * This gives you the option of clearing out the staging tables before loading the data.
   *
   * @param countryCode the code for the country to which this data belongs
   * @param zoneData     The data to import, passed as a String.
   * @param clearStaging Clears the staging tables before doing the import, this only clears the staging
   * tables of the data for the specified country, if all data needs to be cleared, use table import instead
   */
  @Throws (WsiAuthenticationException, "if the caller does not have soapadmin permission")
  @Throws (IllegalArgumentException, "if country code not defined")
  public function importToStaging(countryCode : String, zoneData : String, clearStaging : boolean) : int {
    if (Country.get(countryCode) == null) {
      throw new IllegalArgumentException(DisplayKey.get("Java.Validation.Field.UnknownTypeCodeException.Reason", countryCode, Country.Type.RelativeName))
    }
    return ZoneImportHelper.importToStaging(countryCode, zoneData, clearStaging)
  }

  /**
   * Clears the production tables that contain zone data in preparation for
   * zone data to be imported from the staging tables via the Table Import Tools.
   * This should be called after the staging tables have gone through an integrity check
   * and any offending rows are excluded/corrected.
   *
   * @param countryCode a valid country code that has a zone configuartion defined or null.  A null value here will clear all zone information.
   */
  @Throws (WsiAuthenticationException, "if the caller does not have soapadmin permission")
  @Throws (IllegalArgumentException, "if country code not defined")
  public function clearProductionTables(countryCode : String) {
    if (countryCode != null && Country.get(countryCode) == null) {
      throw new IllegalArgumentException(DisplayKey.get("Java.Validation.Field.UnknownTypeCodeException.Reason", countryCode, Country.Type.RelativeName))
    }
    ZoneImportHelper.clearProductionTables(countryCode)
  }

  /**
   * Clears the staging tables tables that contain zone data in preparation for
   * zone data to be imported to the staging tables.  If countryCode is specified
   * and is a valid value, only rows for that country are cleared.
   *
   * @param countryCode a valid country code or null. A null value here will clear all zone information.
   */
  @Throws (WsiAuthenticationException, "if the caller does not have soapadmin permission")
  @Throws (IllegalArgumentException, "if country code not defined")
  public function clearStagingTables(countryCode : String){
    if (countryCode != null && Country.get(countryCode) == null) {
      throw new IllegalArgumentException(DisplayKey.get("Java.Validation.Field.UnknownTypeCodeException.Reason", countryCode, Country.Type.RelativeName))
    }
    ZoneImportHelper.clearStagingTables( countryCode )
  }
}

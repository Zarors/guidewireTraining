package gw.webservice.ab.internal

uses gw.api.server.AvailabilityLevel
uses gw.xml.ws.annotation.WsiWebService
uses gw.xml.ws.annotation.WsiAvailability
uses gw.xml.ws.annotation.WsiPermissions
uses java.util.Date

/**
 * Webservice API to load sample data in the application
 */
@WsiWebService( "http://guidewire.com/ab/ws/gw/webservice/ab/internal/SampleDataAPI" )
@WsiAvailability(AvailabilityLevel.MAINTENANCE)
@WsiPermissions({SystemPermissionType.TC_INTERNALTOOLS})
@Export
class SampleDataAPI {

  function loadSampleData() : String {
    return new gw.command.ImportSampleData().import() + ":\t" + Date.CurrentDate
  }

  function loadDuplicatesSampleData() : String {
    return new gw.command.ImportSampleData().importDuplicateContacts() + ":\t" + Date.CurrentDate
  }

}
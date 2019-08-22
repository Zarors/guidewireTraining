package gw.webservice.ab.ab1000.abcontactapi

/**
 * This is the ABContactAPI representation of a SpecialistService
 * 
 * Make @Export because it corresponds to the SpecialistService entity which 
 * the customer may extend.
 */
@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/ab/ws/gw/webservice/ab/ab1000/abcontactapi/ABContactAPISpecialistService" )
final class ABContactAPISpecialistService implements IABContactAPISpecialistService {
  
  private var _code : String as Code
  private var _name : String as Name

  construct() {}

  construct(service : SpecialistService) {
    _code = service.Code
    _name = service.Name
  }
}

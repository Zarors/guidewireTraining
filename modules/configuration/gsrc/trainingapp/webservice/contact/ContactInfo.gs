package trainingapp.webservice.contact
uses gw.xml.ws.annotation.WsiExportable

@WsiExportable

final class ContactInfo {
  construct() {
  }
  // ContactInfo class properties
  var _contactName : String as contactName
  var _contactType : String as contactType
  var _primaryPhone : String as primaryPhone
  var _email : String as email
}



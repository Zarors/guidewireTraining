package gw.webservice.ab.ab900.abcontactapi

@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/ab/ws/gw/webservice/ab/ab900/abcontactapi/ABContactAPIRelatedContact" )
final class ABContactAPIRelatedContact implements IABContactAPIRelatedContact {
  var _linkID              : String as LinkID
  var _relationship        : typekey.ContactBidiRel as Relationship
  var _contactLinkID       : String as ContactLinkID
  var _contactFirstName    : String as ContactFirstName
  var _contactLastName     : String as ContactLastName
  var _contactName         : String as ContactName
  var _contactSubtype      : typekey.ABContact as ContactSubtype
}

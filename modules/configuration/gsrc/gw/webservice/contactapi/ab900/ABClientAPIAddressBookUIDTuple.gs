package gw.webservice.contactapi.ab900

uses gw.webservice.contactapi.AddressBookUIDTuple


/**
 * Representing the entity type, public id and AddressBookUID that is used
 * to map the Public ID to AddressBookUID for new entities created as part of a Contact update in
 * ContactManager.
 */
@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/pl/ws/gw/webservice/contactapi/ab900/ABClientAPIAddressBookUIDTuple")
final class ABClientAPIAddressBookUIDTuple implements AddressBookUIDTuple {

  var _entityType : String as EntityType

  var _publicId : String as External_PublicID

  var _linkID : String as LinkID
}

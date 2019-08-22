package gw.api.contact

uses gw.webservice.contactapi.AddressBookUIDTuple
uses gw.xml.ws.annotation.WsiExportable

/**
 * This is a container for the Contact LinkID and the tuples
 * representing the LinkID assignments for the entities in the
 * claim graph.
 *
 * This class is used internally in ContactManager to store this
 * data in a webservice version independent manner.
 */
@Export
@WsiExportable("http://guidewire.com/ab/ws/gw/api/contact/AddressBookUIDContainer" )
final class AddressBookUIDContainer implements IAddressBookUIDContainer{
  /**
   * The ABUID of the AB Contact that was updated.
   */
  var _contactABUID         : String as ContactABUID

  /**
   * The set of mappings from public IDs to ABUIDs.
   */
  public var AddressBookUIDTuples : gw.api.contact.AddressBookUIDTuple[]

  construct() {}

  override function updateAddressBookUIDTuples(value: List<AddressBookUIDTuple>) {
    AddressBookUIDTuples = new gw.api.contact.AddressBookUIDTuple[value.size()]
    for(tuple in value index i) {
      AddressBookUIDTuples[i] = new gw.api.contact.AddressBookUIDTuple(){
          :LinkID = tuple.LinkID, :EntityType = tuple.EntityType, :External_PublicID = tuple.External_PublicID
          }
    }
  }

}
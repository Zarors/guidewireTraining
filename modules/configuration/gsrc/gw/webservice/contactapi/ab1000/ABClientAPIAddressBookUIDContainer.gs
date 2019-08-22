package gw.webservice.contactapi.ab1000

uses gw.webservice.contactapi.AddressBookUIDTuple
uses gw.webservice.contactapi.ab1000.IABClientAPIAddressBookUIDContainer

/**
 * An ABClientAPIAddressBookUIDContainer is passed as an argument to ABClientAPI.pendingUpdateApproved().
 * It contains the the mapping between client public ids and addressbookuids for entities created by the update.
 */
@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/pl/ws/gw/webservice/contactapi/ab1000/ABClientAPIAddressBookUIDContainer")
final class ABClientAPIAddressBookUIDContainer implements IABClientAPIAddressBookUIDContainer {

  /**
   * The ABUID of the AB Contact that was updated.
   */
  var _contactABUID         : String as ContactABUID

  /**
   * The set of mappings from public IDs to ABUIDs.
   */
  public var AddressBookUIDTuples : ABClientAPIAddressBookUIDTuple[]

  construct() {}

  override function updateAddressBookUIDTuples(value: List<AddressBookUIDTuple>) {
    AddressBookUIDTuples = value.toArray(new ABClientAPIAddressBookUIDTuple[value.size()])
  }
}

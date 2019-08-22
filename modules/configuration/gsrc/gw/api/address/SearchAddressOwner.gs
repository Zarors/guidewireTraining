package gw.api.address

uses java.util.Set

/**
 * A Wrapper for search contacts.
 */
@Export
class SearchAddressOwner extends AbstractAddressOwner{
  var _address : Address

  construct(theAddress : Address ) {
    _address = theAddress
    AlwaysShowSeparateFields = true
  }

  override property get HiddenFields() : Set<AddressOwnerFieldId> {
    return ABAddressOwnerFieldId.HIDDEN_FOR_SEARCH
  }

  override property get Address() : Address {
    return _address
  }

  override property set Address( value : Address ) {
    _address = value
  }
  
  override function isPlace() : boolean {
    return _address.ABContact typeis ABPlace
  }

  override property get ShowAddressSummary() : boolean {
    return false
  }
}

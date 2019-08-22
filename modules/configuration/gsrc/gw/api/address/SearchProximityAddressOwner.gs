package gw.api.address

/**
 * A Wrapper for search contacts.
 */
@Export
class SearchProximityAddressOwner extends AbstractAddressOwner{
  var _address : Address

  construct(theAddress : Address ) {
    _address = theAddress
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
  
  override function isVisible(fieldId : AddressOwnerFieldId) : boolean{
    return not gw.api.address.AddressOwnerFieldId.HIDDEN_FOR_PROXIMITY_SEARCH.contains(fieldId)
  }
  
  override property get ShowAddressSummary() : boolean {
    return false
  }
}

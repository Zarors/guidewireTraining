package gw.api.address

/**
 * A Wrapper for secondary contacts.
 */
@Export
class SecondaryAddressOwner extends AbstractAddressOwner {
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
}

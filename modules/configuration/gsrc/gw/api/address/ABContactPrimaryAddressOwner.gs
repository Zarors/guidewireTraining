package gw.api.address

/**
 * An Wrapper around {@link ABContact} when we need to satisfy the {@link AddressOwner} 
 * interface for PCFs that modify the {@link ABContact#PrimaryAddress} field.
 */
@Export
class ABContactPrimaryAddressOwner extends AbstractAddressOwner {

  var _contact : ABContact as readonly Owner

  construct(aContact : ABContact) {
    _contact = aContact
  }

  override property get Address() : Address {
    return Owner.PrimaryAddress
  }

  override property set Address( value : Address ) {
    Owner.PrimaryAddress = value
  }
  
  override function isPlace() : boolean {
    return Owner typeis ABPlace
  }
}

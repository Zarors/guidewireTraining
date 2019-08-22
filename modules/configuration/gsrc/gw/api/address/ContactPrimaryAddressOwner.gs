package gw.api.address

/**
 * An Wrapper around {@link Contact} when we need to satisfy the {@link AddressOwner} 
 * interface for PCFs that modify the {@link Contact#PrimaryAddress} field.
 */
@Export
class ContactPrimaryAddressOwner extends AbstractAddressOwner {
    
  var _contact : Contact as readonly Owner

  construct(aContact : Contact) {
    _contact = aContact
  }

  override function isPlace() : boolean {
    return Owner typeis Place
  }

  override property get Address() : Address {
    return Owner.PrimaryAddress
  }

  override property set Address(value : Address) {
    Owner.PrimaryAddress = value
  }

}

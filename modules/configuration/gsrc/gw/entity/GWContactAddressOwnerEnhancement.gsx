package gw.entity

uses gw.api.address.ContactPrimaryAddressOwner
uses gw.api.address.AbstractAddressOwner

/**
 * Enhancement that provides a property a {@link AddressOwner} from the {@link UserContact#PrimaryAddress}.
 */
@Export
enhancement GWContactAddressOwnerEnhancement : entity.Contact {
  
  property get AddressOwner() : AbstractAddressOwner {
    return new ContactPrimaryAddressOwner(this)
  }

  property get Country() : Country {
    return this.AddressOwner.SelectedCountry
  }
}

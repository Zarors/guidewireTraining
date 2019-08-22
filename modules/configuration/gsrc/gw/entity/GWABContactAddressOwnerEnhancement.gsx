package gw.entity

uses gw.api.address.ABContactPrimaryAddressOwner
uses gw.api.address.AbstractAddressOwner

/**
 * Enhancement that provides a property a {@link AddressOwner} from the {@link ABContact#PrimaryAddress}
 */
@Export
enhancement GWABContactAddressOwnerEnhancement : entity.ABContact {
  
  property get AddressOwner() : AbstractAddressOwner {
    return new ABContactPrimaryAddressOwner(this)    
  }

  property get Country() : Country {
    return this.AddressOwner.SelectedCountry
  }
}

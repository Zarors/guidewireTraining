package gw.api.address

uses java.util.*
uses gw.api.admin.BaseAdminUtil

@Export
abstract class AbstractAddressOwner extends AddressOwnerBase implements AddressOwner {
  
  /**
   * Determine which fields must be populated in order to create/edit a Contact
   * based on the country field of the contact. If the country field is not set,
   * the default country is used.
   *
   * @return a java.util.Set of AddressOwnerFieldId that is applicable for the Contact's country
   */
  override property get RequiredFields() : Set<AddressOwnerFieldId> {
    switch (SelectedCountry) {
      case typekey.Country.TC_US:
        return isPlace() ? ABAddressOwnerFieldId.COUNTRY_WITH_STATES_PLACE_REQUIRED : ABAddressOwnerFieldId.NO_FIELDS
      case typekey.Country.TC_CA:
        return isPlace() ? ABAddressOwnerFieldId.COUNTRY_WITH_STATES_PLACE_REQUIRED : ABAddressOwnerFieldId.NO_FIELDS
      case typekey.Country.TC_AU:
        return isPlace() ? ABAddressOwnerFieldId.COUNTRY_WITH_STATES_PLACE_REQUIRED : ABAddressOwnerFieldId.NO_FIELDS
      default:
        return  isPlace() ? ABAddressOwnerFieldId.COUNTRY_WITHOUT_STATES_PLACE_REQUIRED : ABAddressOwnerFieldId.NO_FIELDS
    }  
  }

  override property get HiddenFields() : Set<AddressOwnerFieldId> {
    return ABAddressOwnerFieldId.NO_FIELDS
  }
  
  abstract function isPlace() : boolean

  /**
   * The currently selected country. If the current address specifies a country
   * then return that, otherwise return the default country
   */
  override property get SelectedCountry() : Country {
    return (this.Address != null) ? this.Address.Country : DefaultCountry
  }
  
  /**
   * Set the currently selected country. If the current address is non null, or
   * it is currently null and we are setting the country to something other than
   * the default, then set the addresses country (possibly autocreating a new
   * address in the process). Otherwise do nothing because we don't have an
   * address and we're just setting the value to the default country.
   */
  override property set SelectedCountry(newValue : Country)  {
    this.Address.Country = newValue
  }
  
  /**
   * The default country, used if the address is null or does not have a
   * country set up. The default implementation returns the default country
   * as specified by BaseAdminUtil.getDefaultCountry()
   */
  property get DefaultCountry() : Country {
     return BaseAdminUtil.getDefaultCountry()
  }

}

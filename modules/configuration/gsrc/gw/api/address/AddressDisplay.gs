package gw.api.address
uses gw.api.locale.DisplayKey
uses gw.api.address.AddressFillable

/**
 * Provides methods for setting the labels and visibility of 
 * address fields of an an AddressAutofillable entity.
 */
@Export
class AddressDisplay
{
  private construct()
  {
  }
  
  static function isCountyVisible(addr : AddressFillable) : boolean {
    if (addr != null and addr.Country != null) {
      return addr.Country == Country.TC_US
    }
    return gw.api.admin.BaseAdminUtil.getDefaultCountry() == Country.TC_US
  }
  
  static function getCountry(addr : AddressFillable) : Country {
    if (addr != null and addr.Country != null) {
      return addr.Country
    }
    return gw.api.admin.BaseAdminUtil.getDefaultCountry()
  }
  
  static function getPostalCodeTooltip(addr : AddressFillable) : String {
    var addrCountry = getCountry(addr)
    if (addrCountry == TC_US) {
      return DisplayKey.get("AutoFill.OverrideUsingZipCode")
    } else {
      return DisplayKey.get("AutoFill.OverrideUsingPostalCode")
    }
  }
    
  static function getCityTooltip(addr : AddressFillable) : String {
    var addrCountry = getCountry(addr)
    if (addrCountry == TC_CA) {
      return DisplayKey.get("AutoFill.OverrideUsingCityProvince")
    } else {
      return DisplayKey.get("AutoFill.OverrideUsingCityState")
    }
  }
    
  static function getPostalCodeLabel(addr : AddressFillable) : String {
    var addrCountry = getCountry(addr)
    if (addrCountry == TC_US) {
      return DisplayKey.get("Web.AddressDetail.ZipCode")
    } else {
      return DisplayKey.get("Web.AddressDetail.PostalCode")
    }
  }
    
  static function getStateLabel(addr : AddressFillable) : String {
    var addrCountry = getCountry(addr)
    if (addrCountry == TC_CA) {
      return DisplayKey.get("Web.AddressDetail.Province")
    } else {
      return DisplayKey.get("Web.AddressDetail.State")
    }
  }
}

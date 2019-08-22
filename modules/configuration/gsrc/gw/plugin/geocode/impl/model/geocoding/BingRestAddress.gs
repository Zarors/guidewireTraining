package gw.plugin.geocode.impl.model.geocoding

/**
 * Address deserialization class
 */
@Export
class BingRestAddress {
  private var _addressLine : String as AddressLine
  private var _locality : String as Locality
  private var _neighborhood : String as Neighborhood
  private var _adminDistrict : String as AdminDistrict
  private var _adminDistrict2 : String as AdminDistrict2
  private var _postalCode : String as PostalCode
  private var _countryRegion : String as CountryRegion
}
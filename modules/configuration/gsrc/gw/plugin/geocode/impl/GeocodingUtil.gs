package gw.plugin.geocode.impl

uses org.apache.commons.lang.StringUtils
uses entity.Address

/**
 * Geocoding class that has geocoding utilities for returning populated geocoding requests.
 * Also defines the geocoding implementation of the response class with all the geocoded address results
 */
@Export
class GeocodingUtil {
  private construct() {

  }

  /**
   * This is a helper to prepare the standard fields on a geocoding location request with an Address
   *
   * @param Context
   * @param address
   * @return GeocodingRequest
   */
  public static function geocodeAddress(context: Context, address: Address): GeocodingRequest {
    var request = new GeocodingRequest(context)
    var addr = new StringBuilder()
    if (address.AddressLine1 != null) {
      addr.append(address.AddressLine1).append(" ")
    }
    if (address.AddressLine2 != null) {
      addr.append(address.AddressLine2).append(" ")
    }
    if (address.AddressLine3 != null) {
      addr.append(address.AddressLine3).append(" ")
    }

    if (StringUtils.isNotBlank(addr.toString())) {
      request.setAddressLine(addr.toString())
    }
    if (StringUtils.isNotBlank(address.City)) {
      request.setLocality(address.City)
    }
    if (StringUtils.isNotBlank(address.State.Code)) {
      request.setAdminDistrict(address.State.Code)
    }
    if (StringUtils.isNotBlank(address.PostalCode)) {
      request.setPostalCode(address.PostalCode)
    }
    if (StringUtils.isNotBlank(address.Country.Code)) {
      request.setCountryRegion(address.Country.Code)
    }
    return request
  }
}
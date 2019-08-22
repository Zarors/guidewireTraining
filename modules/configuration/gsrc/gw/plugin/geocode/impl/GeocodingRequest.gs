package gw.plugin.geocode.impl

uses gw.api.geocode.AbstractGeocodePlugin

/**
 * Request class for the geocoding service - sets the Locations Bing Service config and contains methods to add the supported query parameter key-value pairs
 */
@Export
class GeocodingRequest extends PendingResultBase<Collection<GeocodingResult>, GeocodingResponse, GeocodingRequest> {

  public final static var NO_QUERY_PARAMETERS : String = "A Geocoding Request must not have empty query parameters"
  public final static var REVERSE_GEOCODING_WITH_GEOCODING_PARAMS : String = "Cannot include both 'point' (reverse geocoding) and geocoding fields in a single request"
  public final static var INVALID_MAX_RESULTS : String = "The number of results should be between 1 and 20"
  public final static var INVALID_LATLONG : String = "This point's LatLong is invalid"
  public final static var GEOCODING_FIELDS : Set<String> =
      new HashSet<String>() { "locality", "adminDistrict", "postalCode", "addressLine", "countryRegion", "query" }.freeze()

  private static var CONFIG = new Config(BingMapUtils.GEOCODE_PATH)
  // Find a Location By Address - https://msdn.microsoft.com/en-us/library/ff701714.aspx - unstructured URL

  /**
   * Constructor that accepts a Context and uses a default "/Locations" path Config
   */
  public construct(context : Context) {
    super(context, CONFIG, GeocodingResponse)
  }

  /**
   * Constructor that accepts a Context and a Config
   */
  public construct(context : Context, config : Config) {
    super(context, config, GeocodingResponse)
  }

  /**
   * This validates that the request has parameters, and that there are no reverse geocoding parameters with geocoding parameters {@link GEOCODING_FIELDS}
   */
  protected override function validateRequest() {
    if (Parameters.isEmpty()) {
      throw new IllegalArgumentException(NO_QUERY_PARAMETERS)
    }

    if (Parameters.containsKey("point") && (Parameters.keySet().where(\k -> GEOCODING_FIELDS.contains(k))).size() > 0) {
      throw new IllegalArgumentException(REVERSE_GEOCODING_WITH_GEOCODING_PARAMS)
    }
  }

  function setAdminDistrict(adminDistrict : String) : GeocodingRequest {
    return putParameter("adminDistrict", adminDistrict)
  }

  function setLocality(locality : String) : GeocodingRequest {
    return putParameter("locality", locality)
  }

  function setAddressLine(addressLine : String) : GeocodingRequest {
    return putParameter("addressLine", addressLine)
  }

  function setPostalCode(postalCode : String) : GeocodingRequest {
    return putParameter("postalCode", postalCode)
  }

  function setCountryRegion(countryRegion : String) : GeocodingRequest {
    return putParameter("countryRegion", countryRegion)
  }

  function setQuery(query : String) : GeocodingRequest {
    // unsure if this can be used with all the other normal 'address' parameters
    return putParameter("query", query)
  }

  function setIncludeNeighborhood(includeNeighborhood : boolean) : GeocodingRequest {
    if (includeNeighborhood) {
      return putParameter("includeNeighborhood", "1")
    }
    return putParameter("includeNeighborhood", "0")
  }

  /**
   * This sets the max number of locations to return, 1-20 - default is 5
   */
  function setMaxResults(maxResults : int) : GeocodingRequest {
    // should be between 1 and 20
    if (maxResults < 1 || maxResults > 20) {
      throw new IllegalArgumentException(INVALID_MAX_RESULTS)
    }
      return putParameter("maxResults", new Integer(maxResults).toString())
  }

  // reverse geocoding
  function setPointLatLong(latLong : AbstractGeocodePlugin.LatLong) : GeocodingRequest {
    if (!latLong?.isValid()) {
      throw new IllegalArgumentException(INVALID_LATLONG)
    }
    var request = putParameter("point", latLong._latitude + "," + latLong._longitude)
    return request
  }

  /**
   * This sets the reverse geocoding query string - cannot be used if any of the {@link GEOCODING_FIELDS} has been set
   */
  function setPointString(location : String) : GeocodingRequest {
    return putParameter("point", location)
  }

}
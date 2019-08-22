package gw.plugin.geocode.impl

uses gw.api.geocode.AbstractGeocodePlugin

/**
 * Request class for the geocoding service - sets the Routes Bing Service config and contains methods to add the supported query parameter key-value pairs
 */
@Export
class RoutingRequest extends PendingResultBase<Collection<RoutingResult>, RoutingResponse, RoutingRequest> {
  public static var NO_QUERY_PARAMETERS : String = "A Routing Request must not have empty query parameters"
  public static var NOT_ENOUGH_WAYPOINTS : String = "A Routing Request must have at least two way points"
  public static var INVALID_WAYPOINT : String = "This waypoint is invalid"
  public static var INVALID_DISTANCE_UNIT : String = "Invalid distance unit specified - must be km, kilometer, mile, or mi"
  public static var INVALID_OPTIMIZE_PARAM : String = "Invalid optimization parameter specified - must be distance, time, timeWithTraffic, or timeAvoidClosure"
  public static var INVALID_MAX_SOLUTIONS : String = "The number of solutions can only be between 1 and 3"
  public static var INVALID_TRAVEL_MODE : String = "Invalid travel mode specified - must be driving, walking or transit"

  private var _wayPointCounter : int
  private static var CONFIG = new Config(BingMapUtils.ROUTE_PATH)
  // Calculate a Route - https://msdn.microsoft.com/en-us/library/ff701717.aspx

  /**
   * Constructor that accepts a Context and uses a default "/Routes" path Config
   */
  public construct(context : Context) {
    super(context, CONFIG, RoutingResponse)
    _wayPointCounter = 0
  }

  /**
   * Constructor that accepts a Context and uses a default "/Locations" path Config with a specified resource path
   */
  public construct(context : Context, resourcePath : String) {
    super(context, CONFIG.withResourcePath(resourcePath), RoutingResponse)
    _wayPointCounter = 0
  }

  /**
   * Constructor that accepts a Context and a Config
   */
  public construct(context : Context, config : Config) {
    super(context, config, RoutingResponse)
    _wayPointCounter = 0
  }

  /**
   * This validates that the request has parameters, and that there are at least 2 waypoints
   */
  protected override function validateRequest() {
    if (Parameters.isEmpty()) {
      throw new IllegalArgumentException(NO_QUERY_PARAMETERS)
    }

    if (_wayPointCounter < 2) {
      throw new IllegalArgumentException(NOT_ENOUGH_WAYPOINTS)
    }
  }

  /**
   * This adds a waypoint query parameter based on a LatLong object.
   * There is an internal counter which will set the wayPoint number for the actual query parameter
   */
  function addWayPointLatLong(latLong : AbstractGeocodePlugin.LatLong) : RoutingRequest {
    if (!latLong?.isValid()) {
      throw new IllegalArgumentException(INVALID_WAYPOINT)
    }
    var request = putParameter("wayPoint." + _wayPointCounter, latLong._latitude + "," + latLong._longitude)
    _wayPointCounter++
    return request
  }

  /**
   * This adds a waypoint query parameter based on a LatLong object.
   * There is an internal counter which will set the wayPoint number for the actual query parameter
   */
  function addWayPointString(location : String) : RoutingRequest {
    var request = putParameter("wayPoint." + _wayPointCounter, location)
    _wayPointCounter++
    return request
  }

  /**
   * This sets the distance unit query parameter - km, kilometer, mile, or mi
   */
  function setDistanceUnit(unit : String) : RoutingRequest {
    if ("km".equalsIgnoreCase(unit) or "kilometer".equalsIgnoreCase(unit) or "mile".equalsIgnoreCase(unit) or "mi".equalsIgnoreCase(unit)) {
      return putParameter("distanceUnit", unit)
    } else {
      throw new IllegalArgumentException(INVALID_DISTANCE_UNIT)
    }
  }

  /**
   * This sets optimization query parameter - distance, time, timewithtraffic, or timeavoidclosure
   */
  function setOptimize(optParam : String) : RoutingRequest {
    if ("distance".equalsIgnoreCase(optParam) or "time".equalsIgnoreCase(optParam) or "timeWithTraffic".equalsIgnoreCase(optParam) or "timeAvoidClosure".equalsIgnoreCase(optParam)) {
      return putParameter("optimize", optParam)
    } else {
      throw new IllegalArgumentException(INVALID_OPTIMIZE_PARAM)
    }
  }

  /**
   * This sets the max number of driving direction solutions, 1-3 - default is 1
   */
  function setMaxSolutions(maxSolutions : int) : RoutingRequest {
    // should be between 1 and 3
    if (maxSolutions < 1 || maxSolutions > 3) {
      throw new IllegalArgumentException(INVALID_MAX_SOLUTIONS)
    }
    return putParameter("maxSolutions", new Integer(maxSolutions).toString())
  }

  /**
   * This sets the travelmode query parameter - driving, walking, or transit
   */
  function setTravelMode(travelMode : String) : RoutingRequest {
    if ("driving".equalsIgnoreCase(travelMode) or "walking".equalsIgnoreCase(travelMode) or "transit".equalsIgnoreCase(travelMode)) {
      return putParameter("travelMode", travelMode)
    } else {
      throw new IllegalArgumentException(INVALID_TRAVEL_MODE)
    }
  }
}
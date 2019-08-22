package gw.plugin.geocode.impl

uses com.fasterxml.jackson.annotation.JsonIgnore
uses gw.api.geocode.AbstractGeocodePlugin
uses org.apache.commons.lang.StringUtils

/**
 * RoutingUtil class that has routing utilities for returning populated routing requests.
 * Also defines the routing implementation of the response class with all the routing results
 */
@Export
class RoutingUtil {
  private construct() {

  }

  /**
   * This is a helper to prepare the standard fields on a driving direction object with start and end latlong and units
   *
   * @param Context
   * @param startLatLong
   * @param endLatLong
   * @param unit
   * @return RoutingRequest
   */
  public static function calculateSimpleDrivingRoute(context : Context, startLatLong : AbstractGeocodePlugin.LatLong, endLatLong : AbstractGeocodePlugin.LatLong, unit : String) : RoutingRequest {
    var request = new RoutingRequest(context, BingMapUtils.ROUTE_RESOURCE_PATH)
    if (startLatLong != null) {
      request.addWayPointLatLong(startLatLong)
    }
    if (endLatLong != null) {
      request.addWayPointLatLong(endLatLong)
    }
    if (StringUtils.isNotBlank(unit.trim())) {
      request.setDistanceUnit(unit.trim())
    }
    return request
  }

  /**
   * This is a helper to prepare the standard fields on a driving direction object with start and end addresses and units
   *
   * @param Context
   * @param startAddress
   * @param endAddress
   * @param unit
   * @return RoutingRequest
   */
  public static function calculateSimpleDrivingRoute(context : Context, startAddress : Address, endAddress : Address, unit : String) : RoutingRequest {
    var request = new RoutingRequest(context, BingMapUtils.ROUTE_RESOURCE_PATH)
    var startString = StringUtils.substring(startAddress.toString(), 0, 256).trim()
    var endString = StringUtils.substring(endAddress.toString(), 0, 256).trim()
    if (StringUtils.isNotBlank(startString)) {
      request.addWayPointString(startString)
    }
    if (StringUtils.isNotBlank(endString)) {
      request.addWayPointString(endString)
    }
    if (StringUtils.isNotBlank(unit.trim())) {
      request.setDistanceUnit(unit.trim())
    }
    return request
  }

}

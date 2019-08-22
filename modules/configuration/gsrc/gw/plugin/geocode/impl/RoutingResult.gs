package gw.plugin.geocode.impl

uses gw.plugin.geocode.impl.model.routing.RouteLeg

/**
 * Result class for an individual route request - also used for Jackson deserialization
 */
@Export
class RoutingResult {
  private var _id : String as Id
  private var _distanceUnit : String as DistanceUnit
  private var _durationUnit : String as DurationUnit
  private var _travelDistance : double as TravelDistance
  private var _travelDuration : double as TravelDuration
  private var _travelDistanceTraffic : double as TravelDurationTraffic
  private var _routeLegs : List<RouteLeg> as RouteLegs
}
package gw.plugin.geocode.impl.model.routing

uses gw.plugin.geocode.impl.GeocodingResult
uses gw.plugin.geocode.impl.model.geocoding.Point

/**
 * Deserialization class for routing steps between two way points
 */
@Export
class RouteLeg {
  private var _alternateVias : List<String> as AlternateVias
  private var _cost : int as Cost
  private var _travelDistance : double as TravelDistance
  private var _travelDuration : double as TravelDuration
  private var _description : String as Description
  private var _actualStart : Point as ActualStart
  private var _actualEnd : Point as ActualEnd
  private var _startLocation : GeocodingResult as StartLocation
  private var _endLocation : GeocodingResult as EndLocation
  private var _itineraryItems : List<ItineraryItem> as ItineraryItems

}
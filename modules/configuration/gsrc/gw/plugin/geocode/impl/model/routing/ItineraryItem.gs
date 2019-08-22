package gw.plugin.geocode.impl.model.routing

/**
 * Deserialization class for a Bing Maps ItineraryItem, which contains all the information for a step in a route
 */
@Export
class ItineraryItem {
  private var _childItineraryItems : List<ItineraryItem> as ChildItineraryItems
  private var _compassDirection : String as CompassDirection
  private var _instruction : Instruction as Instruction
  private var _travelDistance : double as TravelDistance
  private var _travelDuration : double as TravelDuration
  private var _travelMode : String as TravelMode
}
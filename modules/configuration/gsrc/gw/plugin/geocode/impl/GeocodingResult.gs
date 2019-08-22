package gw.plugin.geocode.impl

uses gw.plugin.geocode.impl.model.geocoding.BingRestAddress
uses gw.plugin.geocode.impl.model.geocoding.Point

/**
 * Result class for an individual geocode result - also used for Jackson deserialization
 */
@Export
class GeocodingResult {
  var _name : String as Name
  var _point : Point as Point
  var _address : BingRestAddress as Address
  var _confidence : String as Confidence
  var _entityType : String as EntityType
  var _matchCodes : List<String> as MatchCodes
}
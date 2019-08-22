package gw.plugin.geocode.impl.deserializers

uses com.fasterxml.jackson.core.JsonParser
uses com.fasterxml.jackson.databind.DeserializationContext
uses com.fasterxml.jackson.databind.deser.std.StdDeserializer
uses gw.plugin.geocode.impl.BingMapUtils
uses gw.plugin.geocode.impl.GeocodingResponse
uses gw.plugin.geocode.impl.GeocodingResult

/**
 * Deserializer for the overall Bing Maps geocode response, {@code GeocodingResponse},
 * which contains one or more {@code GeocodingReults}
 */
@Export
class GeocodeDeserializer extends StdDeserializer<GeocodingResponse> {

  construct() {
    super(GeocodingResponse)
  }

  override function deserialize(jp: JsonParser, ctxt: DeserializationContext): GeocodingResponse {
    var objectMapper = BingMapUtils.OBJECT_MAPPER
    var objectCodec = jp.getCodec()
    var node = objectCodec.readTree(jp)
    var location = new GeocodingResponse()
    location.StatusCode = BingMapUtils.getStatusCode(node)
    location.StatusDescription = BingMapUtils.getStatusDescription(node)
    if (!location.successful()) {
      return location
    }
    var resources = BingMapUtils.getResources(node)
      if (resources?.isArray()) {
        var resourceList = objectMapper.readValue(resources.traverse(), objectMapper.getTypeFactory().constructCollectionType(List, GeocodingResult)) as List<GeocodingResult>
        location.LocationResources = resourceList
      }
    return location
  }
}
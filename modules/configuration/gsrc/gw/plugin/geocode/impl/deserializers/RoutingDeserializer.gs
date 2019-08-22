package gw.plugin.geocode.impl.deserializers

uses com.fasterxml.jackson.core.JsonParser
uses com.fasterxml.jackson.databind.DeserializationContext
uses com.fasterxml.jackson.databind.deser.std.StdDeserializer
uses gw.plugin.geocode.impl.BingMapUtils
uses gw.plugin.geocode.impl.RoutingResponse
uses gw.plugin.geocode.impl.RoutingResult

/**
 * Deserializer for the overall Bing Maps routing response, {@code RoutingResponse},
 * which contains one or more {@code RoutingingResult}
 */
@Export
class RoutingDeserializer extends StdDeserializer<RoutingResponse> {

  construct() {
    super(RoutingResponse)
  }

  override function deserialize(jp: JsonParser, ctxt: DeserializationContext): RoutingResponse {
    var objectMapper = BingMapUtils.OBJECT_MAPPER
    var objectCodec = jp.getCodec()
    var node = objectCodec.readTree(jp)
    var route = new RoutingResponse()
    route.StatusCode = BingMapUtils.getStatusCode(node)
    route.StatusDescription = BingMapUtils.getStatusDescription(node)
    var resources = BingMapUtils.getResources(node)
      if (resources?.isArray()) {
        var resourceList = objectMapper.readValue(resources.traverse(), objectMapper.getTypeFactory().constructCollectionType(List, RoutingResult)) as List<RoutingResult>
        route.RoutingResources = resourceList
      }
    return route
  }
}
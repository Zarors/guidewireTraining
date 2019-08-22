package gw.plugin.geocode.impl

uses com.fasterxml.jackson.core.TreeNode
uses com.fasterxml.jackson.databind.DeserializationFeature
uses com.fasterxml.jackson.databind.JsonNode
uses com.fasterxml.jackson.databind.ObjectMapper
uses com.fasterxml.jackson.databind.module.SimpleModule
uses gw.plugin.geocode.impl.deserializers.GeocodeDeserializer
uses gw.plugin.geocode.impl.deserializers.RoutingDeserializer

/**
 * Class of static strings that for node names in a Bing Maps JSON response
 */
@Export
class BingMapUtils {
  public static final var STATUS_CODE : String = "statusCode"
  public static final var STATUS_DESCRIPTION : String = "statusDescription"
  public static final var RESOURCE_SETS : String = "resourceSets"
  public static final var RESOURCES : String = "resources"
  public static final var GEOCODE_PATH : String = "/Locations"
  public static final var ROUTE_PATH : String = "/Routes"
  public static final var ROUTE_RESOURCE_PATH : String = "/Driving"
  public static final var HOST_NAME : String = "https://dev.virtualearth.net/REST/"
  public static final var VERSION : String = "v1"
  public static final var DEFAULT_HTTP_METHOD : String = "GET"
  public static final var OBJECT_MAPPER : ObjectMapper = initMapper()

  private static function initMapper() : ObjectMapper {
    var mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
    var module = new SimpleModule()
    module.addDeserializer(GeocodingResponse, new GeocodeDeserializer())
    module.addDeserializer(RoutingResponse, new RoutingDeserializer())
    mapper.registerModule(module)
    return mapper
  }

  public static function statusCodeNotError(statusCode : int) : boolean {
    return statusCode >= 200 and statusCode < 300
  }

  public static function getStatusCode(node : TreeNode) : int {
    return (node.get(BingMapUtils.STATUS_CODE) as JsonNode)?.asInt()
  }

  public static function getStatusDescription(node : TreeNode) : String {
    return (node.get(BingMapUtils.STATUS_DESCRIPTION) as JsonNode)?.asText()
  }

  /**
   * From the root node of a Bing Maps JSON response, returns the first resource set if it can find one;
   * from the documentation, it is not clear what multiple resourceSets add, and there are no examples where there are multiple resourceSets
   * Otherwise, returns null
   */
  public static function getResources(node : TreeNode) : TreeNode {
    var resourceSets = node.path(BingMapUtils.RESOURCE_SETS)
    if (resourceSets.isArray()) {
      // from the documentation, it is not clear what multiple resourceSets add, and there are no examples where there are multiple resourceSets
      return resourceSets.get(0)?.path(BingMapUtils.RESOURCES)
    }
    return null
  }
}
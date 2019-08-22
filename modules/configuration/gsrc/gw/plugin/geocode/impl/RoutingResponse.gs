package gw.plugin.geocode.impl

uses com.fasterxml.jackson.annotation.JsonIgnore

@Export
class RoutingResponse implements Response<List<RoutingResult>> {
  var _statusCode: int as StatusCode
  var _errorDetails: List<String> as ErrorDetails
  var _statusDescription: String as StatusDescription
  @JsonIgnore
  var _routingResources: List<RoutingResult>as RoutingResources

  override function successful(): boolean {
    return BingMapUtils.statusCodeNotError(_statusCode)
  }

  property get Result(): List<RoutingResult> {
    return RoutingResources
  }
}
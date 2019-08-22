package gw.plugin.geocode.impl

uses com.fasterxml.jackson.annotation.JsonIgnore

@Export
class GeocodingResponse implements Response<List<GeocodingResult>> {
  var _statusCode: int as StatusCode
  var _errorDetails: List<String>as ErrorDetails
  var _statusDescription: String as StatusDescription
  @JsonIgnore
  var _locationResources: List<GeocodingResult>as LocationResources

  override function successful(): boolean {
    return BingMapUtils.statusCodeNotError(_statusCode)
  }

  property get Result(): List<GeocodingResult> {
    return LocationResources
  }
}
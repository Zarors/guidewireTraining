package gw.plugin.geocode.impl

uses gw.api.system.PLLoggerCategory
uses java.io.BufferedInputStream
uses java.io.Closeable
uses java.net.HttpURLConnection
uses java.net.URL

/**
 * A PendingResult backed by a HTTP call executed by a Java HttpURLConnection
 * {@code S} is the Result class of an individual resource, and {@code R} is the class of the overall Response class
 */
@Export
class HttpURLConnectionPendingResult<S, R extends Response<S>> implements PendingResult<R> {
  private static var _logger = PLLoggerCategory.GEODATA
  private var _client : HttpURLConnection
  private var _responseClass : Class<R>
  private var _request : URL

  construct(request: URL, client: HttpURLConnection, responseClass: Class<R>) {
    _client = client
    _responseClass = responseClass
    _request = request
  }

  override function execute(): R {
    using (var closeable = (\-> _client.disconnect()) as Closeable) {
      var statusCode = _client.getResponseCode()
      var resp: R
      // if the statusCode is an error, getInputStream() will fail with an IOException, so we process those cases here
      if (!BingMapUtils.statusCodeNotError(statusCode)) {
        resp = _responseClass.newInstance()
        resp.StatusDescription = _client.getResponseMessage()
        resp.StatusCode = statusCode
        _logger.error("The request was not successful - " + resp.StatusCode + " : " + resp.StatusDescription)
        return resp
      }
      using (var response = new BufferedInputStream(_client.getInputStream())) {
        var result = parseResponse(response)
        return result
      }
    }
  }

  function parseResponse(response : BufferedInputStream) : R {
    var objectMapper = BingMapUtils.OBJECT_MAPPER
    var result = objectMapper.readValue(response , _responseClass)
    if (!result.successful()) {
      // unlikely the http status code wouldn't match the json code but we'll check anyway
      _logger.error("The request was not successful - " + result.StatusDescription + " : " + result.ErrorDetails)
    }
    return result
  }
}
package gw.plugin.geocode.impl

uses gw.api.system.PLLoggerCategory

uses java.net.HttpURLConnection
uses java.net.URL

/**
 * RequestHandler for Java HttpURLConnection Client - defaults to a default request config but certain settings can be modified which will apply
 * to the requests. Contains handle methods for GET and POST which return a {@code PendingResult} implementation, which is a ready to execute
 * request on which {@code execute} can be called, and which uses a new HttpURLConnection for each {@code PendingResult}, unlike the Apache
 * request handler
 */
@Export
class HttpURLConnectionRequestHandler implements RequestHandler {
  private static var _logger = PLLoggerCategory.GEODATA
  private static var _connectTimeout : int = 0 //disabled
  private static var _readTimeout : int = 0 //disabled
  private var _client : HttpURLConnection

  construct() {  }

  construct(connect : int, read : int) {
    _connectTimeout = connect
    _readTimeout = read
  }

  override reified function handleGet<S, R extends Response<S>>(hostName: String, url: String, clazz: Class<R>): PendingResult<R> {
    var request = new URL(hostName + url)
    _client = request.openConnection() as HttpURLConnection
    _client.setRequestMethod("GET")
    _client.setConnectTimeout(_connectTimeout)
    _client.setReadTimeout(_readTimeout)
    return new HttpURLConnectionPendingResult<S, R>(request, _client, clazz)
  }

  override function handlePost<S, R extends Response<S>>(hostName: String, url: String, bodyParameters: Map<String, String>, clazz: Class<R>): PendingResult<R> {
    // OOTB Geocoding plugin does not use any Bing REST service that accepts POST
    /**
     * var request = new URL(hostName + url)
    _client = request.openConnection() as HttpURLConnection
    _client.setRequestMethod("POST")
    _client.setConnectTimeout(_connectTimeout)
    _client.setReadTimeout(_readTimeout)
    _client.setDoOutput(true)
    // setup output stream
    return new HttpURLConnectionPendingResult<S, R>(request, _client, errorTimeout, maxRetries, clazz)
     **/
    _logger.debug("handlePost is not implemented in HttpURLRequestHandler")
    throw new UnsupportedOperationException("handlePost is not yet implemented in the HttpURLRequestHandler")
  }

  override function setConnectTimeout(timeout: int) {
    _connectTimeout = timeout
  }

  override function setReadTimeout(timeout: int) {
    _readTimeout = timeout
  }

  override function setSocketTimeout(timeout: int) {
    _logger.error("SocketTimeout is not supported by the HttpURLConnection in HttpURLConnectionRequestHandler")
    throw new UnsupportedOperationException("SocketTimeout is not supported by the HttpURLConnection")
  }
}

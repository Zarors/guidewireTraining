package gw.plugin.geocode.impl

uses gw.api.system.PLLoggerCategory

uses java.net.URLEncoder

/**
 * This class contains the http request handler, and several properties that will be used to process a PendingResultBase request
 * and also contains general get/post processing that it passes onto the handler
 */
@Export
class Context {
  public static var INVALID_KEY : String = "Invalid or missing API key"
  private static var _logger = PLLoggerCategory.GEODATA
  private var _requestHandler : RequestHandler
  private var _culture : String as Culture
  private var _bingMapsApiKey : String as BingMapsApiKey
  /**
   * Creates a context with default provided httpurlconnection request handler
   */
  construct() {
    this(new HttpURLConnectionRequestHandler())
  }

  construct(handler : RequestHandler) {
    this._requestHandler = handler
  }

  /**
   * Constructs the URI for the GET request from the Context, the Config and map of parameters
   * @param config specific Config used to determine REST service endpoint
   * @param clazz the Response class
   * @param parameters - parameters populated by the Request extends PendingResultBase
   * @param <S> Result type
   * @param <R> Response type
   * @return PendingResult
   */
  reified function get<S, R extends Response<S>>(config : Config, clazz : Class<R>, parameters : Map<String, String>) : PendingResult<R> {
    var query = new StringBuilder()
    for (parameter in parameters.entrySet()) {
      query.append('&').append(parameter.getKey()).append('=');
      query.append(URLEncoder.encode(parameter.getValue(), "UTF-8"));
    }
    if (_bingMapsApiKey != null) {
      var url = new StringBuilder(config.Path + config.ResourcePath)
      if (_culture != null) {
        url.append("?c=").append(_culture).append("&")
      } else {
        url.append("?")
      }
      url.append("key=").append(_bingMapsApiKey);
      url.append(query)
      _logger.debug("Generated GET URI - " + url.toString())
      return _requestHandler.handleGet(config.HostName + config.Version, url.toString(), clazz)
    }
    throw new IllegalStateException(INVALID_KEY)
  }

  /**
   * Constructs the URI for the POST request from the Context and the Config. The specifics of populating the body
   * from the map of parameters is left to the individual request handler implementations
   * @param config specific Config used to determine REST service endpoint
   * @param clazz the Response class
   * @param parameters - parameters populated by the Request extends PendingResultBase
   * @param <S> Result type
   * @param <R> Response type
   * @return PendingResult
   */
  function post<S, R extends Response<S>>(config : Config, clazz : Class<R>, parameters : Map<String, String>) : PendingResult<R> {
    if (_bingMapsApiKey != null) {
      var url = new StringBuilder(config.Path + config.ResourcePath)
      if (_culture != null) {
        url.append("?c=").append(_culture).append("&")
      } else {
        url.append("?")
      }
      url.append("key=").append(_bingMapsApiKey);
      _logger.debug("Generated POST URI - " + url.toString())
      return _requestHandler.handlePost(config.HostName + config.Version, url.toString(), parameters, clazz)
    }
    throw new IllegalStateException(INVALID_KEY)
  }

}

package gw.plugin.geocode.impl

uses org.apache.commons.lang.StringUtils
uses java.rmi.RemoteException


/**
 * Abstract request base with common methods for populating the query parameter K-V map, creating the {@code PendingResult} request delegate
 * and performing the actual request.
 * <p>{@code S} - result resource type, e.g. collection of location, route.
 * <p>{@code T} - Specific Type of PendingResultBase, e.g. the request type - geocoding request.
 * <p>{@code R} - response class, e.g. GeocodingUtil.GeocodingReponse - wrapper which includes usually a collection of S and status codes/details
 */
@Export
abstract class PendingResultBase<S, R extends Response<S>, T extends PendingResultBase<S, R, T>> implements PendingResult<R> {
  public static var INVALID_PARAMETER_PAIR : String = "Not allowed to add a parameter pair with a null/empty/whitespace only key or value"
  private var _context: Context
  private var _responseClass: Class<R>
  private var _resultDelegate: PendingResult<R>
  private var _config: Config as Config
  private var _params = new HashMap<String, String>()

  construct(context: Context, config: Config, response: Class<R>) {
    _context = context
    _config = config
    _responseClass = response
  }

  protected abstract function validateRequest()

  protected function putParameter(key: String, val: String): T {
    if (StringUtils.isNotBlank(key)
          and StringUtils.isNotBlank(val)) {
      _params.put(key, val)
    } else {
      throw new IllegalArgumentException(INVALID_PARAMETER_PAIR)
    }
    var result = this as T
    return result
  }

  property get Parameters(): Map<String, String> {
    return Collections.unmodifiableMap(_params)
  }

  private function createRequestDelegate(): PendingResult<R> {
    if (_resultDelegate != null) {
      throw new IllegalStateException("A request delegate has already been created for this request")
    }
    validateRequest()
    if (_config.HttpMethod == "GET") {
      _resultDelegate = _context.get(_config, _responseClass, Parameters)
    } else if (_config.HttpMethod == "POST") {
      _resultDelegate = _context.post(_config, _responseClass, Parameters)
    } else {
      throw new UnsupportedOperationException("An unsupported http method has been set in the Config for this request: " + _config.HttpMethod)
    }

    return _resultDelegate
  }

  /**
   * This creates a request delegate of {@code PendingResult<R>}, i.e. {@code HttpURLConnectionPendingResult} based on the Context and parameters
   * if it does not exist already, or throws an IllegalStateException if it has (since it will have been executed already).
   * The delegate will then be executed to perform the request.
   */
  override final function execute(): R {
    var request = createRequestDelegate()
    try {
      return request.execute()
    } catch (e : Throwable) {
      throw new RemoteException(e.toString(), e)
    }
  }

  // these are user context parameters that should be supported by all requests
  function setUserLocation(userLocation: String): T {
    return putParameter("userLocation", userLocation)
  }

  function setUserIp(userIp: String): T {
    return putParameter("userIp", userIp)
  }

  function setUserRegion(userRegion: String): T {
    return putParameter("userRegion", userRegion)
  }
}

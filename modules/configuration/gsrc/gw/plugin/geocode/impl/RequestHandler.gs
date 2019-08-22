package gw.plugin.geocode.impl

/**
 * Interface for requests to be handled - contains the specific implementations for the back end GET and POST handling that
 * return a {@code PendingResult}, as well as basic timeout settings
 */
@Export
public interface RequestHandler {
  reified function handleGet<S, R extends Response<S>>(hostName: String, url: String, clazz: Class<R>) : PendingResult<R>
  function handlePost<S, R extends Response<S>>(hostName: String, url: String, bodyParameters: Map<String, String>, clazz: Class<R>) : PendingResult<R>
  function setConnectTimeout(timeout: int)
  function setReadTimeout(timeout: int)
  function setSocketTimeout(timeout: int)
}

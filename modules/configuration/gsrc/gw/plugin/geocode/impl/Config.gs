package gw.plugin.geocode.impl

/**
 * Config class used to set the REST service path, and the optionally a more specific resource path,
 * as well as other service properties such as the version, hostname, and http method
 */
@Export
class Config {
  var _path : String as Path
  var _version : String as Version = BingMapUtils.VERSION
  var _resourcePath : String as ResourcePath = ""
  var _hostName : String as HostName = BingMapUtils.HOST_NAME
  var _httpMethod : String as HttpMethod = BingMapUtils.DEFAULT_HTTP_METHOD

  construct(pathName: String) {
    _path = pathName
  }

  function withResourcePath(rpath : String) : Config {
    this._resourcePath = rpath
    return this
  }

  function withVersion(version : String) : Config {
    this._version = version
    return this
  }

  function withHostName(hostName : String) : Config {
    this._hostName = hostName
    return this
  }

  function withHttpMethod(method : String) : Config {
    this._httpMethod = method
    return this
  }
}
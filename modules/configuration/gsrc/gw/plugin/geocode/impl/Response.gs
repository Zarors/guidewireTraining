package gw.plugin.geocode.impl

/**
 * Interface that is implemented by each of the OOTB Bing Map REST API responses
 */
@Export
public interface Response<S> {
  function successful() : boolean

  property get Result() : S

  property get StatusCode() : int

  property set StatusCode(code : int)

  property get StatusDescription() : String

  property set StatusDescription(descr : String)

  property get ErrorDetails() : List<String>
}
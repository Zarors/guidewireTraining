package gw.util
uses java.lang.Throwable


        /**
         * @deprecated use org.slf4j.Logger or better org.slf4j.Logger instead!
         */

enhancement GWILoggerEnhancement : gw.util.ILogger
{
  function debug(log():String) {
    debug(log, null)
  }
  
  function debug(log():String, t:Throwable) {
    if (this.DebugEnabled) {
      this.debug(log(), t)
    }
  }
  
  function trace(log():String) {
    trace(log, null)
  }
  
  function trace(log():String, t:Throwable) {
    if (this.TraceEnabled) {
      this.trace(log(), t)
    }
  }
  
  function info(log():String) {
    info(log, null)
  }
  
  function info(log():String, t:Throwable) {
    this.info(log(), t)
  }
  
  function warn(log():String) {
    warn(log, null)
  }
  
  function warn(log():String, t:Throwable) {
    this.warn(log(), t)
  }
  
  function error(log():String) {
    error(log, null)
  }
  
  function error(log():String, t:Throwable) {
    this.error(log(), t)
  }
  
  function fatal(log():String) {
    fatal(log, null)
  }
  
  function fatal(log():String, t:Throwable) {
   this.fatal(log(), t)
  }  
  
}

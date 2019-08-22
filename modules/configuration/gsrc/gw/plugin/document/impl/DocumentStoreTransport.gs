package gw.plugin.document.impl

uses gw.plugin.InitializablePlugin
uses gw.plugin.messaging.MessageTransport
uses java.util.Map
uses java.lang.Throwable
uses java.lang.Integer
uses gw.api.util.DateUtil
uses gw.api.util.RetryableException
uses gw.plugin.Plugins
uses gw.plugin.document.IDocumentContentSource
uses gw.api.system.ABLoggerCategory

/**
 *  IMPORTANT: This implementation is for Demo purpose only. Please do not modify it.
 *
 *  Note: this implementation notifies the DocumentStore that a document
 *  is waiting to be stored in the DMS. If you need to make changes, use this as an example for your
 *  documentStoreTransport implementation and define it in the plugin-gosu for your
 *  documentStoreTransport.gwp.
 *
 *  Message transport implementation for asynchronous document creation. The destination ID is 324
 */
@Export
class DocumentStoreTransport implements MessageTransport, InitializablePlugin {

  static var MAX_RETRIES_PARAM = "MaxRetries"
  static var MAX_RETRIES_DEFAULT = 5
  static var RETRY_MINUTES_PARAM = "RetryMinutes"
  static var RETRY_MINUTES_DEFAULT = 1
  var _maxRetries : int
  var _retryMinutes : int
  var _destId : int

  construct () {

  }

  override function send( msg: Message, transformedPayload: String ) : void  {
    var document = msg.getMessageRoot() as Document
    ABLoggerCategory.DOCUMENT.debug("DocumentStoreTransport-Sending message id=${msg.ID} for Document:${document.ID} from '${document.PendingDocUID}'")
    var iDocContentSource = Plugins.get(IDocumentContentSource)

    // When handling a "FailedDocumentStore" event. We create a message from the "Async Document Store Failed" rule
    if (msg.EventName == "FailedDocumentStore") {
      ABLoggerCategory.DOCUMENT.error(transformedPayload)
      msg.reportAck()
      return
    }

    try {
      iDocContentSource.addDocument( null, document )
      msg.reportAck()
    } catch (e : RetryableException) {
      document = document.Bundle.loadBean( document.ID ) as Document
      if (msg.RetryCount < _maxRetries) {
        var retryTime = e.SuggestedRetryTime
        if (retryTime == null) {
          retryTime = DateUtil.currentDate().addMinutes( _retryMinutes )
        }
        ABLoggerCategory.DOCUMENT.debug("Retry requested for Document:${document.ID} '${document.Name}' will retry again at ${retryTime.format( "HH:mn" )}", e)
        msg.reportError(retryTime)
      } else {
        ABLoggerCategory.DOCUMENT.error("Error processing Document:${document.ID} '${document.Name}' exceeded maxRetry, will discard.", e)
        document.addEvent( "FailedDocumentStore" )
        msg.reportNonRetryableError()
      }
    } catch (e : Throwable) {
      document = document.Bundle.loadBean( document.ID ) as Document
      ABLoggerCategory.DOCUMENT.error("Error processing Document:${document.ID} '${document.Name}'", e)
      document.addEvent( "FailedDocumentStore" )
      msg.reportNonRetryableError()
    }
  }

  override property set Parameters( params: Map<Object,Object> ) {
    _maxRetries = parseAndSetInt(params, MAX_RETRIES_PARAM, MAX_RETRIES_DEFAULT)
    _retryMinutes = parseAndSetInt(params, RETRY_MINUTES_PARAM, RETRY_MINUTES_DEFAULT)
    ABLoggerCategory.DOCUMENT.debug("DocumentStoreTransport starting with maxRetries=${_maxRetries}, retryMinutes=${_retryMinutes}")
  }

  override function resume() : void {
    // since communication is through IDCS & IDMS, there is nothing to do here
  }


  override function shutdown() : void {
    // since communication is through IDCS & IDMS, there is nothing to do here
  }

  override function suspend() : void {
    // since communication is through IDCS & IDMS, there is nothing to do here
  }

  override property set DestinationID( destId : int ) {
    _destId = destId
  }

  private function parseAndSetInt(params : Map<Object,Object>, paramName : String, defaultValue : int) : int{
    var valueStr = params.get(paramName) as String
    if (valueStr != null) {
      try {
        return Integer.parseInt( valueStr )
      } catch(e : Throwable) {
      }
    }
    return defaultValue
  }

}
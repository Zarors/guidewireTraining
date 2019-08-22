package trainingapp.messaging

uses gw.plugin.PluginCallbackHandler
uses gw.plugin.messaging.MessageFinder
uses gw.plugin.messaging.MessageReply
uses gw.transaction.Transaction

uses javax.jms.MessageListener
uses javax.jms.QueueReceiver
uses javax.jms.TextMessage

class PolicyPeriodReply implements MessageReply, MessageListener {
  var _messageFinder: MessageFinder
  var _pluginCallbackHandler: PluginCallbackHandler
  var _destinationID: int
  var _senderRefID: String
  var _queueReceiver: QueueReceiver = null
  var _queueReceiverName: String = "entitychangereplies"
  static final var _MESSAGE_OK = "REQUEST_MESSAGE_OK"
  static final var _MESSAGE_DUPLICATE = "REQUEST_MESSAGE_DUPLICATE"
  static final var _MESSAGE_INVALID = "REQUEST_MESSAGE_INVALID"
  static final var _TEMP_UNAVAILABLE = "TEMP_UNAVAILABLE"
  override function initTools(p0: PluginCallbackHandler, p1: MessageFinder) {
  }

  override function shutdown() {
  }

  override function suspend() {
  }

  override function resume() {
  }

  override property set DestinationID(destinationID: int) {
    _destinationID = destinationID
  }

  /* This message type can be used to transport plain-text messages, and XML messages.*/
  override function onMessage(message: javax.jms.Message) {
    if (message typeis TextMessage){
      try {
        _pluginCallbackHandler.execute(\-> {
          var aMessage = _messageFinder.findBySenderRefID(_senderRefID, _destinationID)
          if (aMessage != null && aMessage.AckCount == 0) {
            // code to handle message acknowledgement
            if (message.getStringProperty(_MESSAGE_INVALID) != null)  {
              aMessage.reportError()
            }
            if (message.getStringProperty(_TEMP_UNAVAILABLE) != null)  {
              aMessage.reportError(typekey.ErrorCategory.TC_NO_CONNECTION)
            }
            if (message.getStringProperty(_MESSAGE_OK) != null) {
              aMessage.reportAck()
            }
            if (message.getStringProperty(_MESSAGE_DUPLICATE) != null) {
              var aMessageHistory = _messageFinder.findHistoryBySenderRefID(_senderRefID, _destinationID)
              if (aMessageHistory != null){
                var currentTransaction = Transaction.getCurrent()
                aMessageHistory = currentTransaction.add(aMessageHistory)
                aMessageHistory.reportDuplicate()
              }
            }
          } else {
            var aMessageHistory = _messageFinder.findHistoryBySenderRefID(_senderRefID, _destinationID)
            if (aMessageHistory != null){
              var currentTransaction = Transaction.getCurrent()
              aMessageHistory = currentTransaction.add(aMessageHistory)
              aMessageHistory.reportDuplicate()
            }
          }
        })
      } catch (throwable : Exception) {
        throwable.printStackTrace()// log in the realworld
      }
    }
  }
}

/** TODO: CurrDev 8.0.1 Add to TA for INTG Messaging Reply Plugin Example
 *  Check with ExampleJMSReply ?
 */
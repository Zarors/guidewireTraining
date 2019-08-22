package trainingapp.demo.messaging

uses gw.plugin.PluginCallbackHandler
uses gw.plugin.messaging.MessageFinder
uses gw.plugin.messaging.MessageReply
uses gw.transaction.Transaction

uses javax.jms.MessageListener
uses javax.jms.QueueReceiver
uses javax.jms.TextMessage

class ExampleJMSReply implements MessageReply, MessageListener {
  var _finder: MessageFinder
  var _handler: PluginCallbackHandler
  var _destinationID: int
  var _senderRefID: String
  var _queueReceiver: QueueReceiver = null
  var _queueReceiverName = "entitychangereplies"
  static final var _MESSAGE_OK = "REQUEST_MESSAGE_OK"
  static final var _MESSAGE_DUPLICATE = "REQUEST_MESSAGE_DUPLICATE"
  static final var _MESSAGE_INVALID = "REQUEST_MESSAGE_INVALID"
  static final var _TEMP_UNAVAILABLE = "TEMP_UNAVAILABLE"
  override function initTools(pluginCallBackHandler: PluginCallbackHandler, messageFinder: MessageFinder) {
    _handler = pluginCallBackHandler
    _finder = messageFinder
  }

  override function shutdown() {
  }

  override function suspend() {
  }

  override function resume() {
  }

  override property set DestinationID(destinationID : int) {
  }

  /* This message type can be used to transport plain-text messages, and XML messages.*/

  override function onMessage(jmsMessage: javax.jms.Message) {
    if (jmsMessage typeis TextMessage){
      try {
        _handler.execute(\-> {
          var aMessage = _finder.findBySenderRefID(_senderRefID, _destinationID)
          // handle duplicate
          if (aMessage == null || jmsMessage.getStringProperty(_MESSAGE_DUPLICATE).HasContent || aMessage.AckCount > 0) {
            var aMessageHistory = _finder.findHistoryBySenderRefID(_senderRefID, _destinationID)
            if (aMessageHistory != null){
              var currentTransaction = Transaction.getCurrent()
              aMessageHistory = currentTransaction.add(aMessageHistory)
              aMessageHistory.reportDuplicate()
            }
          }
          // handle errors and acknowledgement
          if (aMessage != null && aMessage.AckCount == 0) {
            // code to handle message acknowledgement
            if (jmsMessage.getStringProperty(_MESSAGE_INVALID).HasContent)  {
              aMessage.reportError()
            }
            if (jmsMessage.getStringProperty(_TEMP_UNAVAILABLE).HasContent)  {
              aMessage.reportError(typekey.ErrorCategory.TC_NO_CONNECTION)
            }
            if (jmsMessage.getStringProperty(_MESSAGE_OK).HasContent) {
              aMessage.reportAck()
            }
          }
        })
      } catch (throwable : Exception) {
        throwable.printStackTrace()// log in the realworld
      }
      jmsMessage.acknowledge()
    }
  }
}
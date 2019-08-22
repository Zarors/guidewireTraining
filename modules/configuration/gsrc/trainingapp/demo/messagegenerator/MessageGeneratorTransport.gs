package trainingapp.demo.messagegenerator
uses gw.plugin.messaging.MessageTransport
uses gw.api.util.RetryableException

class MessageGeneratorTransport implements MessageTransport {

  construct() {
  }


  override function resume() {

  }

  override property set DestinationID(destinationID : int) {

  }


  override function shutdown() {

  }

  override function suspend() {

  }

  override function send(aMessage : Message, transformedPayload : String) {

    print ("Message Generator - Beginning send() for message " + (aMessage.MessageRoot as MessageGenerator).Name)

    if ((aMessage.MessageRoot as MessageGenerator).ThrowExceptionInTransport) {
      var demoException : RetryableException
      throw demoException
    }
    
    print ("Message Generator - Sending message:      " + transformedPayload)
    if ((aMessage.MessageRoot as MessageGenerator).AutoAckMessage) {
      aMessage.reportAck()
      print ("Message Generator - Message acknowledged: " + transformedPayload) 
    }
    
  }

}


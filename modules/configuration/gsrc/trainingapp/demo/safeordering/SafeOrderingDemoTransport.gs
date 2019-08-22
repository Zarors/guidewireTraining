package trainingapp.demo.safeordering
uses gw.plugin.messaging.MessageTransport

class SafeOrderingDemoTransport implements MessageTransport {

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
      
    print ("Safe Order Demo - Sending message:      " + transformedPayload)
    if (aMessage.EventName == "SafeOrderingDemoWithAck") {
      aMessage.reportAck()
      print ("Safe Order Demo - Message acknowledged: " + transformedPayload)   
    }
  }

}


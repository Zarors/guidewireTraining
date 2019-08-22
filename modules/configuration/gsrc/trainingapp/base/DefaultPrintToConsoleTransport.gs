package trainingapp.base
uses gw.plugin.messaging.MessageTransport

class DefaultPrintToConsoleTransport implements MessageTransport {

  override function resume() {

  }

  override property set DestinationID(destinationID : int) {

  }


  override function shutdown() {

  }

  override function suspend() {

  }

/*  This implementation simply prints the message payload to the console.
*/
 override function send(aMessage : Message, transformedPayload : String) {
    
    print ("Executing DefaultPrintToConsoleTransport send() method")
    print ("Payload for message " + aMessage.ID + ": " + transformedPayload)

  }

}

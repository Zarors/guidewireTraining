package trainingapp.messaging.legalreport
uses gw.plugin.messaging.MessageRequest

class LegalReportRequest implements MessageRequest {

  construct() {
  }
  
  override function resume() {
    //## todo: Implement me
  }

  override property set DestinationID(destinationID : int) {
    //## todo: Implement me
  }

  override function shutdown() {
    //## todo: Implement me
  }

  override function suspend() {
    //## todo: Implement me
  }

  override function afterSend(p0 : Message) {
    //## todo: Implement me
  }

  override function beforeSend(aMessage : Message) : String {
    print("\n*** Stage 3(a) -- Transforming the message payload with late binding ***")
    print("    Request plugin: LegalReportRequest -- beforeSend()")
    print("    Message ID is " + aMessage.ID)

    // The best practice is to set the SenderRefID only once per message. It is
    // possible that a message may need to be resent one or more times. Each
    // send includes a call to the Request plugin. You ought to ensure that
    // the same SenderRefID is used for all attempts to send a given message.
    // Therefore, set the SenderRefID only if it hasn't already been set.
    if (aMessage.SenderRefID == null) {
      aMessage.SenderRefID = aMessage.PublicID
      print ("SenderRefID set to: " + aMessage.SenderRefID) 
    }  

    var transformedPayload = aMessage.Payload + "," + aMessage.SenderRefID
    return transformedPayload
  }

}

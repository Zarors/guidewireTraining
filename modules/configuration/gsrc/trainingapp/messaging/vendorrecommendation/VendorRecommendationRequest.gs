package trainingapp.messaging.vendorrecommendation
uses gw.plugin.messaging.MessageRequest

class VendorRecommendationRequest implements MessageRequest {
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

  override function afterSend(p0: Message) {

  }

  /*  Vendor recommendation messages are replied to asynchronously. Therefore, a
      SenderRefID is required. In this case, the value must be determined by Guidewire
      (as opposed to the external system). Therefore, the SenderRefID is simply set
      in the Request plugin to the Public ID, which should be unique.
  */

  override function beforeSend(aMessage: Message): String {
    print("\n*** Stage 3(a) -- Transforming the message payload with late binding ***")
    print("    Request plugin: VendorRecommendationRequest -- beforeSend()")
    print("    Message ID is " + aMessage.ID)
    // The best practice is to set the SenderRefID only once per message. It is
    // possible that a message may need to be resent one or more times. Each
    // send includes a call to the Request plugin. You ought to ensure that
    // the same SenderRefID is used for all attempts to send a given message.
    // Therefore, set the SenderRefID only if it hasn't already been set.
    if (aMessage.SenderRefID == null) {
      aMessage.SenderRefID = aMessage.PublicID
      print("    SenderRefID set to: " + aMessage.SenderRefID)
    }
    var transformedPayload = aMessage.Payload.replace(
        "<@@senderRefID@@>", aMessage.PublicID)
    print("    Returning payload string")
    return transformedPayload
  }
}

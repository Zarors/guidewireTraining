package trainingapp.messaging.bank

uses gw.plugin.messaging.MessageRequest
uses gw.api.util.DateUtil
uses gw.xml.XmlElement
uses gw.xml.XmlSerializationOptions
uses javax.xml.namespace.QName

class BankAccountVerificationRequest implements MessageRequest {

  /**
   * Messages are transformed by adding the SenderRefID to the payload. If a message
   * has a late binding value, the token is replaced by an appropriate value.
   */
  @Param("aMessage", "Message object sent by event fired rule")
  @Returns("Payload, transformed or not")
  override function beforeSend(aMessage : Message) : String {
    // Set the SenderRefID
    if (aMessage.SenderRefID == null) {
      aMessage.SenderRefID = aMessage.PublicID
    }
    // Transform payload based on bank account type
    var transformedPayload = aMessage.Payload
    if ((aMessage.MessageRoot as BankAccount).AccountType == BankAccountType.TC_SAVINGS) {
      // Add SenderRefID on the outbound request payload
      transformedPayload += "\n" + "senderRefID," + aMessage.SenderRefID
      // Set late binding value
      var ageInSeconds = String.valueOf(DateUtil.secondsSince(aMessage.CreationTime))
      var token = "<@@ageOfMessageInSeconds@@>"
      if (transformedPayload.containsIgnoreCase(token)) {
        transformedPayload = transformedPayload.replace(token, ageInSeconds)
      }
    } else {
        // Add SenderRefID on the outbound request payload
        var xml = XmlElement.parse(transformedPayload)
        var namespace = xml.$Namespace.NamespaceURI
        var senderRefID = new XmlElement(new QName(namespace,"SenderRefID"))
        senderRefID.set$Text(aMessage.SenderRefID)
        xml.addChild(senderRefID)
        // Create transformedPayload with serialization options
        var opts = new XmlSerializationOptions()
        opts.XmlDeclaration = false
        opts.Sort = false
        opts.Validate = false
        transformedPayload = xml.asUTFString(opts)
    }
    // Print statement is for training purposes only
    print("\n*** Stage 3 -- Optionally transform the message payload ***" +
          "\n    Request plugin: BankAccountVerificationRequest -- beforeSend()" +
          "\n    Sending transformed payload to console:" +
          "\n" + transformedPayload)

    return transformedPayload    // beforeSend() must return a payload
  }

  override function afterSend(p0 : Message) {
    //## todo: Implement me
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

}

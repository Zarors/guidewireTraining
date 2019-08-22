package trainingapp.messaging.bank

uses gw.plugin.messaging.MessageTransport
uses trainingapp.webservice.bank.bankaccountverificationwsc.bankverificationapi.BankVerificationAPI

class BankAccountVerificationTransport implements MessageTransport {

  /**
   * Messages are acknowledged synchronously by ExternalApp.
   */
  @Param("aMessage", "Message object")
  @Param("transformedPayload", "Payload sent by request plugin")
  override function send(aMessage : Message, transformedPayload : String) {
    // Create external web service object and set API properties
    var bankAPI = new BankVerificationAPI()
    bankAPI.Config.Http.Authentication.Basic.Username = "externalappuser"
    bankAPI.Config.Http.Authentication.Basic.Password = "gw"
    bankAPI.Config.CallTimeout = 30000
    // Determine ackCode based on first 3 digits in bank account number
    var accNumber = (aMessage.MessageRoot as BankAccount).AccountNumber
    var ackCode = bankAPI.verifyAccount(aMessage.SenderRefID, transformedPayload, accNumber)
    // Synchrounous acknowledgment
    switch (ackCode) {
      case "000":
        // Message acknowledged - Invalid
        aMessage.reportAck()
        (aMessage.MessageRoot as BankAccount).IsVerified = VerificationStatus.TC_INVALID
        break
      case "999":
        // Payload format message error
        aMessage.reportError(ErrorCategory.TC_PAYLOAD_FORMAT)
        break
      default:
        // Message acknowledged - Verified
        aMessage.reportAck()
        (aMessage.MessageRoot as BankAccount).IsVerified = VerificationStatus.TC_VERIFIED
        break
    }
    // Print statement is for training purposes only
    var output : String
    output = "\n    *** Stage 4 -- Sending the message *** " +
             "\n    Transport plugin: BankAccountVerificationTransport -- send()" +
             "\n    The Request Plugin transformed the payload" +
             "\n    Sending transformed payload to console:" +
             "\n" + transformedPayload + "\n"

    output += "\n    *** Stage 5 -- Message acknowledgement *** " +
              "\n    Transport plugin: BankAccountVerificationTransport -- send()" +
              "\n    Message acknowledged synchronously" +
              "\n    Verification status is: " + (aMessage.MessageRoot as BankAccount).IsVerified.DisplayName
    print(output)
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

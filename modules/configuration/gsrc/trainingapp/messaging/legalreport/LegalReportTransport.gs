package trainingapp.messaging.legalreport

uses trainingapp.messaging.legalreport.legalreportwsc.legalreportapi.LegalReportAPI
uses gw.plugin.messaging.MessageTransport
uses trainingapp.demo.messageack.MessageAckUtil

class LegalReportTransport implements MessageTransport {
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
  /* Throwing an exception triggers automatic retry.
     Once message reaches the maximum number of retries, the Guidewire application suspends the messaging destination.
     This function does not throw the exception, but rather catches it.
     Based on the exception, the function calls reportError message in the MessageAckUtil class.
   */
  override function send(aMessage: Message, transformedPayload: String) {
    var output : String = ""
    output += "\n*** Stage 3(b) -- Sending the message ***"
    output +="\n    Transport plugin: LegalReportTransport -- send()"
    // Create web service
    var API = new LegalReportAPI()
    // setting web service authentication properties
    API.Config.Http.Authentication.Basic.Username = "su"
    API.Config.Http.Authentication.Basic.Password = "gw"
    try {
      API.submitReportRequest(transformedPayload)
      output += String.format("\n    Sending payload to web service for Message ID %s \n",{aMessage.ID})
    } catch (e : Exception) {
      // probably should delete this code here, ther reaosn being we want to distinguish between reporting a send
      // error for an exception and an exception
      // basicall we just we want to demonstrate that an external system can report an error.
//      if (e.Message.startsWith("java.net.ConnectException")) {       // The external application is down, report the sending error.
//        output += MessageAckUtil.reportSendingError(aMessage, ErrorCategory.TC_NO_CONNECTION)
//      } else if (e.Message.startsWith("gw.xml.ws.WsiAuthenticationException")) { // the user authentication information is incorrect, report the sending error
//        output +=  MessageAckUtil.reportSendingError(aMessage, ErrorCategory.TC_USER_AUTHENTICATION)
//      } else {    // handle other unknown exceptions  and report error
//        output += MessageAckUtil.reportSendingError(aMessage, ErrorCategory.TC_UNEXPECTED_ERROR)
//        output += String.format("Unexpected exception caught: %s; Message %s has not been processed." , {e.Message.toString(), aMessage.SenderRefID})
//      }
      throw(e)
    } // end try catch exception
   print(output)
  }// end send()
}

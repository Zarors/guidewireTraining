package trainingapp.demo.messageack

uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.pl.persistence.core.Key
uses gw.transaction.Transaction

class MessageAckPage {
  /** This function process acknowledgements, both positive and negative
   *   ExternalSystemResponseTypes
      {"1: Positive Acknowledgement", "2: Negative Acknowledgement (error)", "3: Duplicate", "4: No Response"}
   */
  public static function handlePageErrors(destination: String, senderRefID: String, externalSystemResponseType: String, errorCategory: String, vendorProfileCode: String): String {
    // Check for user errors from the MessageAcknowledgements page
    if (destination == null) {
      return "You must specify a destination."
    }
    if (destination == "Bank Account Verification" and senderRefID == null) {
      return "For Bank Account Verification, you must specify a Message ID."
    }
    if (senderRefID == null) {
      return "You must specify a SenderRefID."
    }
    if (externalSystemResponseType == null) {
      return "You must specify an external system response type."
    }
    if (destination == "Vendor Recommendation" and externalSystemResponseType == "1: Positive Acknowledgement" and vendorProfileCode == null) {
      return "For positive acknowledgements of vendor recommendations, you must specify a vendor profile code."
    }
    if (externalSystemResponseType == "2: Negative Acknowledgement (error)"  and errorCategory == null) {
      return "For negative acknowledgement (error), you must specify an error category."
    }
    return ""
  }

  public static function processAcknowledgement(destination: String, senderRefID: String, externalSystemResponseType: String, errorCategory: String, vendorProfileCode: String): String {
    var resultString = handlePageErrors(destination, senderRefID, externalSystemResponseType, errorCategory, vendorProfileCode)
    if (resultString == ""){
      Transaction.runWithNewBundle(\bundle -> {
        if (!externalSystemResponseType.startsWith("3")) {

          var aMessage = getOriginalMessage(destination, senderRefID)

          if (aMessage == null) {
            // production code would throw an exception here
            resultString = String.format("There is no message with the given ID of %s for the given destination %s in the Message table.", { senderRefID, destination})
          } else {// begin message-was-found code
            aMessage = bundle.add(aMessage)
            if (externalSystemResponseType.startsWith("1")) {
              // For positive acknowledgements, report acknowledgement and do any
              // destination-specific data updates.
              // Vendor Recommendations need the vendor profile code set.
              if (destination == "Vendor Recommendation") {
                aMessage.ABContact.VendorProfileCode = vendorProfileCode
              }
              // Legal Case Reports need the status and last report date updated.
              if (destination == "Legal Case Report") {
                var relatedContact = aMessage.MessageRoot as ABContact
                relatedContact.LegalCaseReportStatus = LegalCaseReportStatus.TC_REQUESTED_RECEIVED
                relatedContact.LastLegalCaseReportDate = gw.api.util.DateUtil.currentDate()
              }
              resultString = "Message " + senderRefID + " acknowledged."
              aMessage.reportAck()
            }

            if (externalSystemResponseType.startsWith("2")) {
              // For negative acknowledgements, report acknowledgement and do any
              // destination-specific data updates.
              resultString = MessageAckUtil.reportExternalSystemError(aMessage, ErrorCategory.get(errorCategory))
            }

            if (externalSystemResponseType.startsWith("4")) {
              // No response
              resultString = " no response from external system"
            }
          }
        } else {
          // duplicate, so need message history
          resultString = MessageAckUtil.reportDuplicate(senderRefID)
        }
      }, "su")
    }
    return resultString
  }

  // end processAcknowledgement

  /* This function retrieves the message to which the reply corresponds.
  */

  static function getOriginalMessage(destination: String, uniqueID: String): Message {
    var queryObj = Query.make(Message)

    // Bank account verification is acknowledged synchronously. Therefore, SenderRefID is not
    // set. For this destination, the unique ID for messages is the Message ID. All other
    // destinations make use of senderRefIDs.
    if (destination == "Bank Account Verification") {
      var queryKey = new Key(ABContact, Long.parseLong(uniqueID))
      queryObj.compare(Message#ID, Relop.Equals, queryKey)
    } else {
      queryObj.compare(Message#SenderRefID, Relop.Equals, uniqueID)
    }


    // Constrain query to messages pertaining to the appropriate destination, if possible.
    switch (destination) {
      case "Bank Account Verification":
          queryObj.compare(Message#DestinationID, Relop.Equals, 13)
          break
      case "Vendor Recommendation":
          queryObj.compare(Message#DestinationID, Relop.Equals, 14)
          break
      case "Message Generator":
          queryObj.compare(Message#DestinationID, Relop.Equals, 21)
          break
      case "Safe Ordering Demo":
          queryObj.compare(Message#DestinationID, Relop.Equals, 20)
          break
      case "Student-Defined":
          // Query cannot be constrained by destination ID is destination is student-defined
          break
    }
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.AtMostOneRow
    } else {
      return null
    }
  }

  // end getOriginalMessage

}



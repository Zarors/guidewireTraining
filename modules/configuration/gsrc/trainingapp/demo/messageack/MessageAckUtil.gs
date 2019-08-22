package trainingapp.demo.messageack

uses gw.api.database.Query
uses gw.api.database.QuerySelectColumns
uses gw.api.database.Relop
uses gw.api.path.Paths
uses gw.api.util.DateUtil
uses gw.transaction.Transaction


class MessageAckUtil {
  /* Property overrides destination max retries using script parameters */

  static property get maxRetriesForRetryableMessage(): int {
    var value: int = 3
    if (ScriptParameters.MaxRetriesForRetryableMessage > 0) {
      value = ScriptParameters.MaxRetriesForRetryableMessage
    }
    return value
  }

  /** For an external system to call using a remote API or reply plugin. This function takes a message, determines if the error can be retried, and then  reports the error
   */
  @Param("aMessage", "The message instance")
  @Param("errorCategory", "a Typekey from the Error Category typelist")
  static function reportExternalSystemError(aMessage: Message, errorCategory: ErrorCategory): String {
    var output = String.format("External System Error reported for message %s with error category of %s", {aMessage.SenderRefID, errorCategory})
    if (aMessage.RetryCount < maxRetriesForRetryableMessage) {
      var backOffMultiplier = aMessage.RetryCount + 1
      var waitTime: int = backOffMultiplier * 30
      // wait time in seconds
      var retryTime = DateUtil.addSeconds(DateUtil.currentDate(), waitTime)
      // report the message error with retryTime
      aMessage.reportError(retryTime)
      output += String.format("; retry attempt is: %s; the next retry attempt is at %s", {( backOffMultiplier), retryTime.formatDateTime(SHORT, SHORT)})
    } else {// max is reached
      output += String.format("; retry max reached %s", {maxRetriesForRetryableMessage})
      // Report the error category
      aMessage.reportError(errorCategory)
      // Alert the administrator
      alertAdminAboutMessageError(aMessage)
    }
    return output
  }

  /** For a Transport plugin to call when handling an exception during the sending of message. Reports the error with an error category and alerts the administrator
   */
  @Param("aMessage", "The message instance")
  @Param("errorCategory", "a Typekey from the Error Category typelist")
  static function reportSendingError(aMessage: Message, errorCategory: ErrorCategory): String {
    var output = String.format("Sending Error reported for message %s with error category of %s", {aMessage.SenderRefID, errorCategory})
    aMessage.reportError(errorCategory)
    alertAdminAboutMessageError(aMessage)
    return output
  }

  @Param("aMessage", "The message instance")
  static function reportSkip(aMessage: Message): String {
    var output = String.format("Message %s is skipped \n has this payload: %s", {aMessage.SenderRefID, aMessage.Payload})
    aMessage.skip()
    return output
  }

  /** Function reports the duplication of a message. There may be more than one duplicate in the message history table.
   */
  @Param("senderRefID", "The SenderRefID of the message")
  static function reportDuplicate(senderRefID: String): String {
    var output: String
    var aMessageHistory = Query.make(MessageHistory).compare(MessageHistory#SenderRefID, Relop.Equals, senderRefID).select().AtMostOneRow
    if (aMessageHistory != null) {// history found so duplicate
      Transaction.Current.add(aMessageHistory)
      aMessageHistory.reportDuplicate()
      output = String.format("Duplicate reported for MessageHistory with SenderRefID: %s with count %s", {aMessageHistory.SenderRefID, aMessageHistory.DuplicateCount})
    } else {
      // production code would throw an exception here
      output = String.format("There is no MessageHistory in the MessageHistory table for the message with SenderRefID", {aMessageHistory.SenderRefID})
    }
    return output
  }

  /** Function takes a message and reports the but does not attempt to retry the message. It is provided for educational purposes only.
   */
  static function reportError(aMessage: Message): String {
    // You would typically not see this sort of code in production. In production, the message
    // should be retried unless the max retries had been exceeded. It has been provided solely
    // so students can see what a message looks like when an error has been reported
    // and no further action is taken on the message.
    var output = String.format("Sending and/or processing error reported for message %s with error category of %s. .", {aMessage.SenderRefID, aMessage.ErrorCategory})
    aMessage.reportError()
    return output
  }

  /** Function alerts the administrator to the fact that there is a message for which an
   *  error has been reported and the message has been sent the maximum number of times.
   */
  static function alertAdminAboutMessageError(aMessage: Message): void {
    // In a production environment, a method like this would send an email to the admin
    // or create an activity that was assigned to him or her. TrainingApp does not have
    // access to an email server, and activities are not fully enabled. So, this method
    // simply prints the alert to the console.
    var output = "--------------- BEGIN :: ADMIN ALERT --------------------- \n"
    output += "Message has exceed max tries and needs to be skipped manually!\n"
    output += String.format("STATS: ID %s for destination %s using SenderRefID: %s \n", {aMessage.ID, aMessage.DestinationID, aMessage.SenderRefID })
    // if message has a sender ref ID, print history of messages sent
    if (aMessage.SenderRefID != null) {
      var queryObj = Query.make(MessageHistory)
      queryObj.compare(MessageHistory#SenderRefID, Relop.Equals, aMessage.SenderRefID)
      var resultSet = queryObj.select().orderByDescending(QuerySelectColumns.path(Paths.make(MessageHistory#SendTime)))
      for (currentMessageHistory in resultSet index i) {
        output += String.format("Attempt %s was sent at %s  \n", {i, currentMessageHistory.SendTime.formatDateTime(SHORT, SHORT)})
      }
    }
    output += "--------------- END :: ADMIN ALERT --------------------- \n"
    print(output)
  }

  // end alertAdminAboutMessageError
}

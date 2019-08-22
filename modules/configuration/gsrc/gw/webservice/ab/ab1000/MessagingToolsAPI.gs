package gw.webservice.ab.ab1000

uses gw.api.locale.DisplayKey
uses gw.api.messaging.ExternalDestinationConfig
uses gw.api.messaging.MessageProcessingDirection
uses gw.api.webservice.exception.DataConversionException
uses gw.api.webservice.exception.SOAPException
uses gw.api.webservice.exception.SOAPSenderException
uses gw.api.webservice.messagingTools.Acknowledgement
uses gw.api.webservice.messagingTools.MessageStatisticsData
uses gw.xml.ws.WsiAuthenticationException
uses gw.xml.ws.annotation.WsiAvailability
uses gw.xml.ws.annotation.WsiGenInToolkit
uses gw.xml.ws.annotation.WsiWebService

/**
 * MessagingTools is a remote interface to a set of tools to get messaging
 * statistics and perform operations on messages.
 */
@WsiWebService("http://guidewire.com/ab/ws/gw/webservice/ab/ab1000/MessagingToolsAPI")
@WsiAvailability(MAINTENANCE)
@WsiGenInToolkit
@Export
class MessagingToolsAPI {
    
  /**
   * Resync the abcontact against specified destination
   *
   * @param destID  The destination against which the abcontact should be resynced.
   * @param abcontactID The identifier of the abcontact that should be resynced.
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  @Throws(DataConversionException, "If abcontact cannot be found")
  function resyncABContact(destID : int, abcontactID : String) {
    getDelegate().resyncABContact( destID, abcontactID )
  }
    
  /**
   * Purges the message history table of completed messages.
   * Deletes all messages with send time less than supplied before date.
   *
   * @param cutoff Remove messages with send time less than this date.
   */
  @Throws(IllegalArgumentException, "if cutoff date is null")
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  function purgeCompletedMessages(cutoff : Date) {
    if (cutoff == null) {
      throw new IllegalArgumentException(DisplayKey.get("Webservice.Messaging.CutoffDateRequired"))
    }
    getDelegate().purgeCompletedMessages( cutoff )
  }

  /**
   * Suspends the destination with the specified destination id
   *
   * @param destID The destination id of the destination to suspend
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  @Throws(IllegalArgumentException, "if destination id is invalid")
  function suspendDestinationBothDirections(destID : int){
    getDelegate().suspendDestination( destID )
  }

  /**
   * Resumes the destination with the specified destination id
   *
   * @param destID The destination id of the destination to resume
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  @Throws(IllegalArgumentException, "if destination id is invalid")
  function resumeDestinationBothDirections(destID : int){
    getDelegate().resumeDestination( destID )
  }

  /**
   * This will restart the destination with changes to the configuration settings, note that this
   * will wait for the destination to stop for the specified timeToWaitInSecs.
   *
   * @param destID The destination id of the destination to be restarted
   * @param maxretries max retries
   * @param initialretryinterval initial retry interval
   * @param retrybackoffmultiplier additional retry backoff
   * @param pollinterval how often to poll (from start to start)
   * @param numsenderthreads number of sender threads for multithreaded sends
   * @param chunksize number of messages to read in a chunk
   * @param timeToWaitInSec how long to wait for the destination to shutdown before forcing it
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  @Throws(IllegalArgumentException, "if destination id is invalid")
  function configureDestination(destID : int, timeToWaitInSec : int,
       maxretries : Integer,
        initialretryinterval : Long,
        retrybackoffmultiplier : Integer,
        pollinterval : Integer,
        numsenderthreads : Integer,
        chunksize : Integer ) {
    getDelegate().configureDestination(destID, timeToWaitInSec, maxretries, initialretryinterval, retrybackoffmultiplier, pollinterval, numsenderthreads, chunksize);
  }

  /**
   * This is will return the configuration for this destination
   *
   * @param destID The destination id of the destination to query
   * @return the configuration for that destination
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  @Throws(IllegalArgumentException, "if destination id is invalid")
  function getConfiguration(destID : int) : ExternalDestinationConfig {
    return getDelegate().getConfiguration(destID);
  }

  /**
   * Gets the message id for a message with a specific sender ref id and a specific destination id.
   * If there are multiple messages that match, this will throw an exception.
   *
   * @param senderRefID The sender ref id for the message we want to get
   * @param destID The destination id for the message we want to get.
   * @return message id, or null if message is not found.
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  @Throws(IllegalArgumentException, "if destination id is invalid")
  function getMessageIdBySenderRefId(senderRefID: String, destID: int) : Long {
    if (destID <= 0) {
      throw new IllegalArgumentException(DisplayKey.get("Webservice.Messaging.DestinationIdInvalid", destID))
    }
    return getDelegate().getMessageIdBySenderRefId( senderRefID, destID)
  }

  /**
   * Acknowledges message
   *
   * @param ack The acknowledgement to report
   * @throws SOAPException If the ack could not be committed to the database
   * @return true if the message was found and acked, false otherwise.
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  @Throws(IllegalArgumentException, "if ack is invalid")
  @Throws(SOAPSenderException, "If caller has not supplied valid acknowledgement")
  @Throws(SOAPException, "If processing was in error")
  function ackMessage(ack : Acknowledgement) : boolean {
    if (ack == null || ack.MessageID <= 0) {
      throw new IllegalArgumentException(DisplayKey.get("Webservice.Messaging.Ack.Required"))
    }
    return getDelegate().ackMessage( ack )
  }

  /**
   * Retries a single message (retryable error or inflight).
   *
   * @param messageID The message to retry.
   * @return Returns whether or not the message was successfully retried.
   *         If the message with this messageID does not exist, this returns false.
   *         If the message is not a retryable error message or an inflight message, this returns false.
   *         Returning true does not necessarily mean that the retry was successful; it just means that the message was retried.
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  function retryMessage(messageID : long) : boolean{
    if (messageID <= 0) {
      throw new IllegalArgumentException(DisplayKey.get("Webservice.Messaging.MessageIdInvalid", messageID))
    }
    return getDelegate().retryMessage( messageID )
  }

  /**
   * Skips a single message (error or inflight).
   *
   * @param messageID The message to skip.
   * @return Returns whether the message was successfully skipped.
   *         If the message with this messageId does not exist, this returns false.
   *         If the message is not in an active state(active states are:
   *         pending send, inflight, error, retryable error and pending retry),
   *         this returns false.
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  function skipMessage(messageID : long) : boolean {
    if (messageID <= 0) {
      throw new IllegalArgumentException(DisplayKey.get("Webservice.Messaging.MessageIdInvalid", messageID))
    }
    return getDelegate().skipMessage( messageID )
  }

  /**
   * Retries all messages in retryable error state for the given destination.
   *
   * @param destID The destination that should be retried.
   * @return Returns true if all messages were successfully retried; false if any errors occurred.
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  @Throws(IllegalArgumentException, "if destId is invalid")
  function retryRetryableErrorMessages(destID : int) : boolean{
    getDelegate().validateDestination(destID)
    return getDelegate().retryRetryableErrorMessages( destID )
  }

  /**
   * Retries messages in retryable error state for the given destination where the message
   * has previously been retried fewer than retryLimit times.  Each message maintains a retry
   * count; attempts to retry the message increment the retry count.  If there are messages
   * whose retry count >= retryLimit, they will not be retried.
   * <p/>
   * Specifying a retryLimit of 0 retries all retryable error messages,
   * and is identical to retryRetryableErrorMessages(int destID).
   *
   * @param destID     The destination that should be retried.
   * @param retryLimit Retry only messages with retryCount < retryLimit; if retryLimit
   *                   is 0, retry all messages.
   * @return Returns true if all messages were successfully retried; false if any errors occurred.
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  @Throws(IllegalArgumentException, "if ack is invalid")
  function retryRetryableSomeErrorMessages(destID : int, retryLimit : int) : boolean {
    getDelegate().validateDestination(destID)
    return getDelegate().retryRetryableErrorMessages( destID, retryLimit)
  }

  /**
   * Retries messages in retryable error state for the given destination and error category,
   *
   * @param destID     The destination that should be retried.
   * @param category The error category of the messages that should be retried.
   * @return Returns true if all messages were successfully retried; false if any errors occurred.
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  @Throws(IllegalArgumentException, "if ack is invalid")
  function retryRetryableErrorMessagesForCategory(destID : int, category : ErrorCategory) : boolean {
    getDelegate().validateDestination(destID)
    return getDelegate().retryRetryableErrorMessagesForCategory( destID, category)
  }

  /**
   * Gets all the message statistics of a given destination and safe ordered object.
   *
   * @param destID  The destination to get the message statistics.
   * @param safeOrderedObjectId The public id of the safe ordered object of interest
   * @return the message statistics for the specified destination and safe order object
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  @Throws(IllegalArgumentException, "if ack is invalid")
  function getMessageStatisticsForSafeOrderedObject(destID : int, safeOrderedObjectId : String) : MessageStatisticsData {
    getDelegate().validateDestination(destID)
    return getDelegate().getMessageStatisticsForSafeOrderedObject( destID, safeOrderedObjectId )
  }

  /**
   * Gets all the message statistics of a given destination.
   *
   * @param destID  The destination to get the message statistics.
   * @return the message statistics for the specified destination
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  @Throws(IllegalArgumentException, "if ack is invalid")
  function getTotalStatistics(destID : int) : MessageStatisticsData {
    getDelegate().validateDestination(destID)
    return getDelegate().getTotalStatistics(destID)
  }

  /**
   * Suspend inbound or outbound processing for the destination
   * depending on the specified direction.
   * When outbound processing is suspended, the request and transport
   * plugins are suspended, along with message sending.
   * When inbound processing is suspended, the reply plugin is suspended
   * Returns true if processing was previously
   * active and is now suspended.
   * Returns false if processing was already suspended.
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  @Throws(IllegalArgumentException, "if ack is invalid")
  @Throws(SOAPSenderException, "If caller has not supplied valid direction")
  @Throws(SOAPException, "If processing was in error")
  function suspendDestination(destID : int, direction :MessageProcessingDirection) : boolean {
    getDelegate().validateDestination(destID)
    return getDelegate().suspendDestination( destID, direction);
  }

  /**
   * Resume outbound or inbound message processing
   * depending on the specified direction.
   * When outbound processing is resumed, this resumes the
   * request and transport plugins, and resumes message sending.
   * When inbound processing is resumed, the reply plugin is resumed
   * Returns true if processing was previously suspended and is now resumed.
   * Returns false if processing was already active.
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  @Throws(IllegalArgumentException, "if ack is invalid")
  @Throws(SOAPSenderException, "If caller has not supplied valid direction")
  @Throws(SOAPException, "If processing was in error")
  function resumeDestination(destID: int, direction : MessageProcessingDirection): boolean {
    getDelegate().validateDestination(destID)
    return getDelegate().resumeDestination( destID, direction);
  }

  /**
   * Returns true if the processing for the specified destination
   * and direction is suspended, returns false otherwise.
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  @Throws(IllegalArgumentException, "if ack is invalid")
  function isSuspended(destID: int, direction : MessageProcessingDirection): boolean {
    getDelegate().validateDestination(destID)
    return getDelegate().isSuspended( destID, direction);
  }

  /**
   * Returns true if the processing for the specified destination
   * and direction is resumed.
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  @Throws(IllegalArgumentException, "if ack is invalid")
  function isResumed(destID: int, direction : MessageProcessingDirection): boolean {
    getDelegate().validateDestination(destID)
    return getDelegate().isResumed(destID, direction);
  }

  /**
   * Returns status of Destination
   */
  @Throws(WsiAuthenticationException, "if there are permission/authentication issues")
  @Throws(IllegalArgumentException, "if ack is invalid")
  public function getDestinationStatus(destID : int) : String {
    getDelegate().validateDestination(destID)
    var d = gw.api.admin.DestinationMessageStatisticsUtil.getMessageStatisticsForDestination(destID)
    return d?.Status
  }

  //----------------------------------------------------------------- private helper methods
  
  private function getDelegate() : gw.api.webservice.ab.messagingTools.ABMessagingToolsImpl {
    return new gw.api.webservice.ab.messagingTools.ABMessagingToolsImpl()
  }
}

package gw.plugin.email.impl

uses gw.api.email.AbstractEmailMessageTransport
uses gw.api.email.Email
uses gw.plugin.email.HtmlEmail

uses java.lang.Exception
uses java.lang.Throwable
uses java.net.ConnectException
uses java.net.UnknownHostException
uses javax.mail.MessagingException
uses javax.mail.SendFailedException

/** This is an plugin that hides the javax libraries so is extremely limited in controlling the session.
 */
@Deprecated("Since 8.0.0.  Please use JavaxEmailMessageTransport instead.")
@Export
public class EmailMessageTransport extends AbstractEmailMessageTransport {

  override function handleGeneralException(message : Message, email : Email, exception : Throwable) {
    message.ErrorDescription = exception.Message
    message.reportError()
  }

  override function handleMessageException(message : Message, email : Email, exception : MessagingException) : boolean {
    var retry = false
    // If the problem is with an email address, extract them from the exception, log the error, remove them from the message, and send again
    if (exception typeis SendFailedException) {
      var rootCause = getRootCause(exception)
      if (rootCause != null &&
              (rootCause typeis UnknownHostException 
              || rootCause typeis ConnectException)) {
        handleErrorConnectingToMailServer(message, exception)
      } else {
        var invalidAddresses = exception.InvalidAddresses
        if (invalidAddresses != null && !invalidAddresses.IsEmpty) {
          retry = handleInvalidAddresses(email, invalidAddresses)
        }
        if (!retry) {
          message.ErrorDescription = exception.Message
          message.skip() // skip in this case, to avoid having all of the messages held up by one bad address
        }
      }
    } else {
      message.ErrorDescription = exception.Message
      message.reportError()
    }
    return retry
  }

  /**
   * Handles the case where the message could not be send due to problem connecting to email server
   * @param message Message to send
   * @param exception Exception occurred.  Its cause would be either UnknownHostException or ConnectionException
   */
  function handleErrorConnectingToMailServer(message : Message, exception : MessagingException) {
    message.ErrorDescription = exception.Message
    message.reportError()
  }

  function getRootCause(me : Exception) : Exception {
    var e = me
    while (e typeis MessagingException) {
      e = e.NextException
    }
    return e
  }

  /**
   * Template method to handle sending the email.  This method does not need to do exception handling
   * @param wkSmtpHost SMTP host name
   * @param wkSmtpPort SMTP host port number
   * @param email email object
   * @throws MessagingException Any exception occurred during the operation
   */
  protected override function createHtmlEmailAndSend(wkSmtpHost : String, wkSmtpPort : String, email : Email) {
    var out = createEmail(wkSmtpHost, wkSmtpPort, email)
    out.send()
  }

  /** This will create the actual email documents for this email.  There are many reasons why there maybe different
   * versions of an email from the same information.  However, locale is not one of them, since the email information was
   * localized prior to being written to the message queue.  A good example is if the documents exceed some maximum email
   * size, it might be split into multiple emails.  Or your could generate one email for internal users and another for external
   * users.
   *
   * @param smtpHost the host to connect for send mail
   * @param smtpPort that port used on that host for sending mail
   * @param email the email payload to send
   * @return the email object that can be sent
   * @throws MessagingException if there are problems create the out email
   */
  protected function createEmail(wkSmtpHost : String, wkSmtpPort : String, email : Email) : HtmlEmail {
    var out = new HtmlEmail(wkSmtpHost, wkSmtpPort)
    out.setCharset("UTF-8")

    setSenderReplyTo(email, out, _defaultSenderEmail, _defaultSenderName)
    addRecipients(out, email)

    out.setHtmlMsg(gw.util.GosuEscapeUtil.escapeForHTML(email.Body))
    out.setSubject(email.Subject)

    addDocuments(out, email)
    return out
  }

  /** This will add recipients to the mime multipart document
   *
   * @param out the create multipart mime document
   * @param email the email payload extracting information from
   * @throws MessagingException if there are problems adding recipients
   */
  protected function addRecipients(out : HtmlEmail, email : Email) {
    for (contact in email.ToRecipients) {
      var emailAddress = contact.EmailAddress
      out.addTo(emailAddress, contact.getName())
    }
    for (contact in email.CcRecipients) {
      var emailAddress = contact.getEmailAddress()
      out.addCc(emailAddress, contact.getName())
    }
    for (contact in email.BccRecipients) {
      var emailAddress = contact.getEmailAddress()
      out.addBcc(emailAddress, contact.getName())
    }
  }
  
  /** This will add the attached documents to the email multipart packet, it uses IDocumentContentSource to retrieve
   * a documents internal or external image based on the internalOnly flag.
   *
   * @param out the resulting mime multipart document
   * @param email the email to sent the xml email payload
   * @throws MessagingException if there were errors adding parts to the mime document
   */
  protected function addDocuments(out : HtmlEmail, email : Email) {
    if (!email.Documents.Empty) {
      for (var doc in email.Documents) {
        var fileName = doc.Name + getFileExtensionForDocument(doc)
        out.attach(new gw.api.email.AbstractEmailMessageTransport.DocumentContentsDataSource(doc, false), fileName, doc.Description)
      }
    }
  }

}

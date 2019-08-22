package gw.plugin.email.impl

uses gw.api.email.Email
uses gw.api.system.PLLoggerCategory
uses gw.document.DocumentsUtilBase
uses gw.pl.util.ExceptionUtil
uses gw.plugin.InitializablePlugin
uses gw.plugin.PluginParameter
uses gw.plugin.Plugins
uses gw.plugin.credentials.CredentialsPlugin
uses gw.plugin.document.IDocumentContentSourceBase
uses gw.plugin.email.HtmlEmail
uses gw.plugin.messaging.MessageTransport
uses gw.transaction.Transaction

uses javax.activation.DataSource
uses javax.mail.Authenticator
uses javax.mail.MessagingException
uses javax.mail.PasswordAuthentication
uses javax.mail.SendFailedException
uses javax.mail.Session
uses javax.mail.internet.InternetAddress
uses java.io.InputStream
uses java.io.OutputStream
uses java.net.SocketException
uses java.net.UnknownHostException

/** This is a fully exposed javax mail implementation so that packages like JavaMail-Crypto can
 * be used to sign documents.
 *
 * The maintaining of the key ring is left as an exercise for the user.
 */
@Export
@PluginParameter(:name="smtpHost", :type=String)
@PluginParameter(:name="smtpPort", :type=Integer)
@PluginParameter(:name="defaultSenderName", :type=String)
@PluginParameter(:name="defaultSenderAddress", :type=EmailAddress)
@PluginParameter(:name="Debug", :type=Boolean)
@PluginParameter(:name="Username", :type=String)
@PluginParameter(:name="Password", :type=String)
@PluginParameter(:name="useMessageCreatorAsUser", :type=Boolean)
@PluginParameter(:name="useDefaultAsSender", :type=Boolean)
@PluginParameter(:name="mail[.].*", :helpText = "This will pass any parameter starting with \"mail.\" to javax.mail.Session.getInstance")
@PluginParameter(:name="CredentialPlugin.Key", :type=String, :helpText = "This is a key to get the user/password from the CredentialPlugin")
class JavaxEmailMessageTransport implements MessageTransport, InitializablePlugin {
  public static final var EMAIL_DEST_ID : int = 65

  public static final var SMTP_HOST : String = "smtpHost"
  public static final var SMTP_PORT : String = "smtpPort"
  public static final var DEFAULT_SENDER_NAME : String = "defaultSenderName"
  public static final var DEFAULT_SENDER_ADDRESS : String = "defaultSenderAddress"
  public static final var DEBUG_PARAM : String = "Debug"
  public static final var USERNAME_PARAM : String = "Username"
  public static final var PASSWORD_PARAM : String = "Password"
  public static final var USE_MESSAGE_CREATOR : String = "useMessageCreatorAsUser"
  public static final var USE_DEFAULT_AS_SENDER : String = "useDefaultAsSender"
  public static final var CREDENTIAL_PLUGIN_KEY_PARAM : String = "CredentialPlugin.Key"

  var _useMessageCreator = false
  var _useDefaultAsSender = false
  var _host : String
  var _defaultSenderName : String
  var _defaultSenderEmail : String
  var _debug = false
  var _user : String; // need to input real user id
  var _password : String; // Need to use real password
  private var _defaultProps : Properties
  var _credentialKey : String = "EmailMessageTransport"

  override function shutdown() : void {
  }

  override function suspend() : void {
  }

  override function resume() : void {
  }

  override property set DestinationID(destinationID : int) : void {
    if (destinationID != EMAIL_DEST_ID) {
      throw new RuntimeException("Email message plugin must be configured with id " + EMAIL_DEST_ID + "  - check messaging-config.xml.")
    }
  }

  override property set Parameters(params : Map) {
    _user = params.get(USERNAME_PARAM) as String
    _password = params.get(PASSWORD_PARAM) as String
    _defaultSenderEmail = params.get(DEFAULT_SENDER_ADDRESS) as String
    _defaultSenderName = params.get(DEFAULT_SENDER_NAME) as String
    _debug = Boolean.parseBoolean(params.get(DEBUG_PARAM) as String)
    _useMessageCreator = Boolean.parseBoolean(params.get(USE_MESSAGE_CREATOR) as String)
    _useDefaultAsSender = Boolean.parseBoolean(params.get(USE_DEFAULT_AS_SENDER) as String)
    _credentialKey = params.get(CREDENTIAL_PLUGIN_KEY_PARAM) as String
    if (_credentialKey != null) {
      var plugin = Plugins.isEnabled(CredentialsPlugin) ? Plugins.get(CredentialsPlugin) : null
      if (plugin != null) {
        var cred = plugin.retrieveUsernameAndPassword(_credentialKey)
        if (cred != null) {
          _user = cred.getUsername()
          _password = cred.getPassword()
          _defaultSenderEmail = cred.getUsername()
          _useDefaultAsSender = true;
        }
      }
    }
    var usingExplicitProperties = false
    _defaultProps = new Properties()
    _defaultProps.put("mail.transport.protocol", "smtp");
    for (param in params.entrySet()) {
      if ((param.getKey() as String).startsWith("mail.")) {
        usingExplicitProperties = true
        _defaultProps.put(param.getKey(), param.getValue());
      }
    }
    if (!usingExplicitProperties) {
      var smtpHost = params.get(SMTP_HOST) as String
      var smtpPort = params.get(SMTP_PORT) as String
      if (smtpHost != null) {
        _defaultProps.put("mail.smtp.host", smtpHost)
      }
      if (smtpPort != null) {
        _defaultProps.put("mail.smtp.port", smtpPort)
      }
      if (_password != null) {
        _defaultProps.put("mail.smtp.ssl.enable", "true")
        _defaultProps.put("mail.smtp.auth", "true");
      }
    }

    var protocol = _defaultProps.get("mail.transport.protocol") as String
    _host = _defaultProps.get("mail." + protocol + ".host") as String
    var port = _defaultProps.get("mail." + protocol + ".port") as String
    PLLoggerCategory.MESSAGING_EMAIL.info("Starting JavaXEmailMessageTransport with protocol=${protocol} emailHost=${_host} port=${port} debug=${_debug} ")
  }

  override function send(message : entity.Message, transformedPayload : String) : void {
    try {
      var email = Email.payloadToEmail(transformedPayload);
      if (_useMessageCreator && message.User != null ) {
        Transaction.asUserOnlyExecute(message.User, \ -> sendEmail(message, email));
      }
      else {
        sendEmail(message, email);
      }
    }
    catch (e : Exception) {
      handleErrorLoadingEmail(message, e)
    }
  }

  private function handleGeneralException(message : Message, exception : Throwable) {
    message.ErrorDescription = exception.Message
    message.reportError()
  }

  private function handleMessageException(message : Message, email : Email, exception : MessagingException) : boolean {
    var retry = false
    // If the problem is with an email address, extract them from the exception, log the error, remove them from the message, and send again
    if (exception typeis SendFailedException) {
      var rootCause = getRootCause(exception)
      if (rootCause != null &&
              (rootCause typeis UnknownHostException
              || rootCause typeis SocketException)) {
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
  private function handleErrorConnectingToMailServer(message : Message, exception : MessagingException) {
    message.ErrorDescription = exception.Message
    message.reportError()
  }

  private function getRootCause(me : Exception) : Exception {
    var e = me
    while (e typeis MessagingException) {
      e = e.NextException
    }
    return e
  }

  // exposed for testing only
  function createHtmlEmail(email : Email) : HtmlEmail {
    var props = new Properties(_defaultProps)
    var address : String
    var name : String
    if (_useDefaultAsSender) {
      address = _defaultSenderEmail
      name = _defaultSenderName
    } else if (email.Sender != null && email.Sender.EmailAddress != null) {
      address = email.Sender.EmailAddress
      name = email.Sender.Name
    } else {
      address = _defaultSenderEmail
      name = _defaultSenderName
    }
    props.put("sender.email", address)
    props.put("sender.name", name)
    var sn : Session;
    if (_password == null) {
      sn = Session.getInstance(props)
    }
    else {
      var authenticator: Authenticator = new Authenticator() {
        protected override property get PasswordAuthentication(): PasswordAuthentication {
          return new PasswordAuthentication(_user, _password);
        }
      };
      sn = Session.getInstance(props, authenticator)
    }
    sn.setDebug(_debug)

    var out = new HtmlEmail(sn)
    out.setFrom(address, name)
    out.setCharset("UTF-8")
    if (email.ReplyTo != null && email.ReplyTo.EmailAddress != null) {
      address = email.ReplyTo.EmailAddress
      name = email.ReplyTo.Name
    } else if (_useDefaultAsSender && email.Sender != null && email.Sender.EmailAddress != null) {
      address = email.Sender.EmailAddress
      name = email.Sender.Name
    }
    out.addReplyTo(address, name)
    populateEmail(out, email)
    return out
  }

  /** This will create the actual email documents for this email.  There are many reasons why there maybe different
   * versions of an email from the same information.  However, locale is not one of them, since the email information was
   * localized prior to being written to the message queue.  A good example is if the documents exceed some maximum email
   * size, it might be split into multiple emails.  Or your could generate one email for internal users and another for external
   * users.
   *
   * @param email the email payload to send
   * @return the email object that can be sent
   * @throws MessagingException if there are problems create the out email
   */
  private function populateEmail(out : HtmlEmail, email : Email) {
    addHeaders(out, email)
    addRecipients(out, email)
    out.setSubject(email.Subject)
    addDocuments(out, email)
    addBody(out, email)
  }

  private function addHeaders(out : HtmlEmail, email : Email) {
    for (header in email.Headers) {
      out.addHeader(header.First, header.Second)
    }
  }

  /** This will add recipients to the mime multipart document, and return true if all addresses were internal.
   *
   * @param out the create multipart mime document
   * @param email the email payload extracting information from
   * @return true if all recipients where internal
   * @throws MessagingException if there are problems adding recipients
   */
  private function addRecipients(out : HtmlEmail, email : Email) {
    for (contact in email.ToRecipients) {
      out.addTo(contact.EmailAddress, contact.Name)
    }
    for (contact in email.CcRecipients) {
      out.addCc(contact.EmailAddress, contact.Name)
    }
    for (contact in email.BccRecipients) {
      out.addBcc(contact.EmailAddress, contact.Name)
    }
  }

  /** The only thing here is if the body starts with <html> treat it like html
   * 
   */
  private function addBody(out : HtmlEmail, email : Email) {
    if (email.Html) {
      out.setHtmlMsg(email.Body)
    }
    else {
      out.setMsg(gw.util.GosuEscapeUtil.escapeForHTML(email.Body))
    }
  }


  /** This will add the attached documents to the email multipart packet, it uses IDocumentContentSource to retrieve
   * a documents internal or external image based on the internalOnly flag.
   *
   * @param out the resulting mime multipart document
   * @param email the email to sent the xml email payload
   * @throws MessagingException if there were errors adding parts to the mime document
   */
  private function addDocuments(out : HtmlEmail, email : Email) {
    if (!email.Documents.Empty) {
      for (var doc in email.Documents) {
        var ds = new DocumentContentsDataSource(doc, false)
        out.attach(ds, doc.Name + DocumentsUtilBase.getFileExtensionForDocument(doc), doc.Description)
      }
    }
  }

  private function handleErrorLoadingEmail(message : entity.Message, exception : Exception) : void {
    message.setErrorDescription(exception.getMessage())
    message.reportError()
  }

  private function handleInvalidAddresses(email : Email, invalidAddresses : javax.mail.Address[]) : boolean {
    var error = new StringBuilder("There are one or more invalid addresses:")
    for (invalidAddress in invalidAddresses) {
      email.removeRecipientWithAddress((invalidAddress as InternetAddress).getAddress())
      error.append(invalidAddress)
    }
    var okayToRetry = !(email.getToRecipients().isEmpty() and email.getBccRecipients().isEmpty() and email.getCcRecipients().isEmpty())
    if (okayToRetry) {
      error.append("They have been removed and the message will be sent without them.")
    } else {
      error.append("They have been removed and no addresses left")
    }
    PLLoggerCategory.MESSAGING_EMAIL.error(error.toString())
    return okayToRetry
  }

  private function sendEmail(message : entity.Message, email : Email) : void {
    var retry = true
    while (retry) {
      retry = false
      try {
        var out = createHtmlEmail(email)
        if (_host != "") {
          out.send()
        }
        message.reportAck()
        PLLoggerCategory.MESSAGING_EMAIL.info("Sent email \"" + email.getSubject() + "\" to " + email.getToRecipients())
      }
      catch (me : MessagingException) {
        retry = handleMessageException(message, email, me)
        if (!retry) {
          PLLoggerCategory.MESSAGING_EMAIL.info("Error on sent email \"" + email.getSubject() + "\" to " + email.getToRecipients() + ":" + me.getMessage())
        }
      }
      catch (e : Exception) {
        PLLoggerCategory.MESSAGING_EMAIL.error("error sending email", e)
        handleGeneralException(message, ExceptionUtil.findExceptionCause(e))
      }
    }
  }

  private static class DocumentContentsDataSource implements DataSource {
    private final var _docBase : Document
    private final var _internal : boolean
    public construct(final docBase : Document) {
      this(docBase, true)
    }
    public construct(final docBase : Document, internal : boolean) {
      _docBase = docBase
      _internal = internal
    }

    public property get ContentType() : String {
      return _docBase.getMimeType()
    }

    public property get InputStream() : InputStream {
      var idcs = Plugins.get("IDocumentContentSource") as IDocumentContentSourceBase
      var docContents = _internal ? idcs.getDocumentContentsInfo(_docBase, true) : idcs.getDocumentContentsInfoForExternalUse(_docBase)
      return docContents.getInputStream()
    }

    public property get Name() : String {
      return _docBase.getName()
    }

    public property get OutputStream() : OutputStream {
      throw new UnsupportedOperationException()
    }
  }

}

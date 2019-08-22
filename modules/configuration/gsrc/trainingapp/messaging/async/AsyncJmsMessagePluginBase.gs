package trainingapp.messaging.async

uses gw.pl.logging.LoggerCategory
uses gw.plugin.InitializablePlugin
uses gw.plugin.messaging.InitializationException
uses gw.plugin.messaging.MessagePlugin
uses org.slf4j.Logger

uses javax.jms.Connection
uses javax.jms.ConnectionFactory
uses javax.jms.Destination
uses javax.jms.JMSException
uses javax.jms.MessageConsumer
uses javax.jms.MessageListener
uses javax.jms.MessageProducer
uses javax.jms.Session
uses javax.naming.Context
uses javax.naming.InitialContext

/**
 * Created by jsuja on 11/29/2016.
 */
abstract class AsyncJmsMessagePluginBase implements MessagePlugin, InitializablePlugin {

  final public static var NAMING_FACTORY_INITIAL: String = "java.naming.factory.initial"
  final public static var NAMING_PROVIDER_URL: String = "java.naming.provider.url"
  final public static var NAMING_CONNECTION_FACTORY: String = "connectionFactoryNames"
  final public static var NAMING_QUEUE_SEND: String = "queue.outbound"
  final public static var NAMING_QUEUE_REPLY: String = "queue.inbound"
  final public static var RETRY_DELAY_SECONDS: String = "RetryDelaySeconds"
  final public static var RETRY_MAXIMUM_LIMIT: String = "RetryMaximumLimit"
  final public static var RETRY_BACKOFF_MULTIPLIER: String = "RetryBackoffMultiplier"
  //private variables that will be initialized with connection attributes
  protected var _logger: Logger = LoggerCategory.INTEGRATION_JMS
  private var _context: InitialContext = null
  private var _contextProviderURL: String = "tcp://localhost:61616"
  private var _initialContextFactory: String = "org.apache.activemq.jndi.ActiveMQInitialContextFactory"
  private var _connectionFactory: String = "ConnectionFactory"
  private var _sendQueue: String = "outboundRequest"
  private var _replyQueue: String = "inboundReply"
  //Private variables to handle messages
  private var _connection: Connection
  private var _session: Session
  private var _producer: MessageProducer
  private var _consumer: MessageConsumer
  private var _replyQueueDestination: Destination
  private var _destinationID: int = -1
  private var _retryDelaySeconds: int = 10
  private var _retryMaximumLimit: int = 3
  private var _retryBackoffMultiplier: int = 2

  protected property get RetryDelaySeconds(): int {
    return this._retryDelaySeconds
  }

  protected property get RetryMaximumLimit(): int {
    return this._retryMaximumLimit
  }

  protected property get RetryBackoffMultiplier(): int {
    return this._retryBackoffMultiplier
  }

  protected property get DestinationID(): int {
    return this._destinationID
  }

  @Throws(InitializationException, "setParameters() - if failed, suspends a destination")
  override property set Parameters(aParameters: Map<Object, Object>): void {
    try {
      this._logger.debug("AsyncJmsMessagePluginBase.setParameters() - DestinationID: ${DestinationID}, Parameters:\n" + aParameters)
      // check first if any custom parameters passed in from the plugin config
      if (aParameters != null and !aParameters.Empty) {
        // initialize any custom properties from the plugin configuration parameters (if any)
        _retryDelaySeconds = aParameters.containsKey(RETRY_DELAY_SECONDS) ? aParameters.get(RETRY_DELAY_SECONDS) as int : _retryDelaySeconds
        _retryMaximumLimit = aParameters.containsKey(RETRY_MAXIMUM_LIMIT) ? aParameters.get(RETRY_MAXIMUM_LIMIT) as int : _retryMaximumLimit
        _retryBackoffMultiplier = aParameters.containsKey(RETRY_BACKOFF_MULTIPLIER) ? aParameters.get(RETRY_BACKOFF_MULTIPLIER) as int : _retryBackoffMultiplier
        // make sure the default values are set if not otherwise configured
        _retryDelaySeconds = _retryDelaySeconds < 0 ? 0 : _retryDelaySeconds
        _retryMaximumLimit = _retryMaximumLimit < 0 ? 0 : _retryMaximumLimit
        _retryBackoffMultiplier = _retryBackoffMultiplier < 1 ? 1 : _retryBackoffMultiplier

        //initialize the connection variables from the provided JNDI properties file, check if overridden by a plugin parameter setting
        _initialContextFactory = aParameters.containsKey(NAMING_FACTORY_INITIAL) ? aParameters.get(NAMING_FACTORY_INITIAL) as String : _initialContextFactory
        _contextProviderURL = aParameters.containsKey(NAMING_PROVIDER_URL) ? aParameters.get(NAMING_PROVIDER_URL) as String : _contextProviderURL
        _connectionFactory = aParameters.containsKey(NAMING_CONNECTION_FACTORY) ? aParameters.get(NAMING_CONNECTION_FACTORY) as String : _connectionFactory
        _sendQueue = aParameters.containsKey(NAMING_QUEUE_SEND) ? aParameters.get(NAMING_QUEUE_SEND) as String : _sendQueue
        _replyQueue = aParameters.containsKey(NAMING_QUEUE_REPLY) ? aParameters.get(NAMING_QUEUE_REPLY) as String : _replyQueue
      }
    } catch (exc: Throwable) {
      this._logger.error("AsyncJmsMessagePluginBase.setParameters() - DestinationID: ${DestinationID} - failed:\n" + exc.Message)
      throw new InitializationException(exc.Message, exc)
    }
  }

  override property set DestinationID(i: int) {
    this._destinationID = i
  }

  /**
   * this resume() method needs to be implemented in a relevant plugin subclass,
   * to call one of the provided resumeTransport() or resumeReply() methods
   */
  abstract override function resume()

  /**
   * function that provides suspend() method implementation for subclasses
   */
  @Throws(InitializationException, "suspend() - if failed, suspends a destination")
  override function suspend(): void {
    if (this._logger.DebugEnabled)
      this._logger.debug("AsyncJmsMessagePluginBase.suspend() - DestinationID: ${DestinationID} - called")

    this.shutdown()
  }

  /**
   * function that provides shutdown() method implementation for subclasses
   */
  @Throws(InitializationException, "shutdown() - if failed, suspends a destination")
  override function shutdown(): void {
    try {
      if (this._logger.DebugEnabled)
        this._logger.debug("AsyncJmsMessagePluginBase.shutdown() - DestinationID: ${DestinationID} - called")

      // Clean up
      if (_producer != null) {
        _producer.close()
        _producer = null
      }
      if (_consumer != null) {
        _consumer.close()
        _consumer = null
      }
      this.closeConnection()
      // catch an InitializationException throw in close connection
    } catch (eIE: InitializationException) {
      this._logger.error("AsyncJmsMessagePluginBase.shutdown() - DestinationID: ${DestinationID} - failed:\n" + eIE.Message)
      // rethrow the original InitializationException
      throw eIE
    } catch (exc: Throwable) {
      this._logger.error("AsyncJmsMessagePluginBase.shutdown() - DestinationID: ${DestinationID} - failed:\n" + exc.Message)
      throw exc
    }
  }

  /**
   * function that creates a message producer on the send queue
   */
  @Throws(InitializationException, "resumeTransport() - if failed, suspends a destination")
  protected function resumeTransport(): void {
    try {
      if (this._logger.DebugEnabled)
        this._logger.debug("AsyncJmsMessagePluginBase.resumeTransport() - DestinationID: ${DestinationID} - called")

      this.createConnection()
      // create a session with AUTO ACKNOWLEDGE setting for sending
      _session = _connection.createSession(false, Session.AUTO_ACKNOWLEDGE)
      // Create a message producer from the session
      _producer = _session.createProducer(_context.lookup(_sendQueue) as Destination)
      // Create/lookup the reply destination
      _replyQueueDestination = _context.lookup(_replyQueue) as Destination
      // catch an InitializationException throw in create connection
    } catch (eIE: InitializationException) {
      this._logger.error("AsyncJmsMessagePluginBase.resumeTransport() - DestinationID: ${DestinationID} - failed:\n" + eIE.Message)
      //resume failed, clean up before throwing an exception
      this.shutdown()
      // rethrow the original InitializationException
      throw eIE
    } catch (exc: Throwable) {
      this._logger.error("AsyncJmsMessagePluginBase.resumeTransport() - DestinationID: ${DestinationID} - failed:\n" + exc.Message)
      //resume failed, clean up before throwing an exception
      this.shutdown()
      throw exc
    }
  }

  /**
   * function that creates a message consumer on the reply queue
   */
  @Throws(InitializationException, "resumeReply() - if failed, suspends a destination")
  protected function resumeReply(aMessageListener: MessageListener): void {
    try {
      if (this._logger.DebugEnabled)
        this._logger.debug("AsyncJmsMessagePluginBase.resumeReply() - DestinationID: ${DestinationID}, MessageListener: " + aMessageListener)

      this.createConnection()
      // create a session with CLIENT ACKNOWLEDGE setting for receiving,
      // i.e. the MessageReply plugin must ACK the received JMS message
      _session = _connection.createSession(false, Session.CLIENT_ACKNOWLEDGE)
      // Create a MessageConsumer from the Session to the Topic or Queue
      _consumer = _session.createConsumer(_context.lookup(_replyQueue) as Destination)
      // register the message listener
      _consumer.setMessageListener(aMessageListener)
      // start the connection after registering the listener
      _connection.start()
      // catch an InitializationException throw in create connection
    } catch (eIE: InitializationException) {
      this._logger.error("AsyncJmsMessagePluginBase.resumeReply() - DestinationID: ${DestinationID} - failed:\n" + eIE.Message)
      //resume failed, clean up before throwing an exception
      this.shutdown()
      // rethrow the original InitializationException
      throw eIE
    } catch (exc: Throwable) {
      this._logger.error("AsyncJmsMessagePluginBase.resumeReply() - DestinationID: ${DestinationID} - failed:\n" + exc.Message)
      //resume failed, clean up before throwing an exception
      this.shutdown()
      throw exc
    }
  }

  /**
   * function that creates a new JMS Text message and sends it out via producer
   */
  @Throws(javax.jms.JMSException, "sendMessage() - failed, rolls back the send transaction")
  @Throws(javax.jms.IllegalStateException, "sendMessage() - failed, rolls back the send transaction")
  protected function sendMessage(payload: String, senderRefID : String): void {
    this.sendMessage(payload, senderRefID, false)
  }

  private function sendMessage(payload: String, senderRefID : String, exitFlag: boolean): void {

    try {
      if (this._logger.DebugEnabled)
        this._logger.debug("AsyncJmsMessagePluginBase.sendMessage() - DestinationID: ${DestinationID} - called with '${exitFlag}'")

      var jmsMessage = _session.createTextMessage()
      jmsMessage.JMSCorrelationID = senderRefID
      jmsMessage.Text = payload
      jmsMessage.JMSReplyTo = _replyQueueDestination
      _producer.send(jmsMessage)

      if (this._logger.TraceEnabled)
        this._logger.trace("AsyncJmsMessagePluginBase.sendMessage() - DestinationID: ${DestinationID}, Payload:\n" + payload)
    } catch (eISE: javax.jms.IllegalStateException) {
      if (!exitFlag) {
        // reset the plugin connection and try one more time, e.g. a JMS connection timeout
        this.shutdown()
        this.resumeTransport()
        this.sendMessage(payload, senderRefID, true)
      } else {
        this._logger.error("AsyncJmsMessagePluginBase.sendMessage() - DestinationID: ${DestinationID} - failed:\n" + eISE.Message)
        throw eISE
      }
    } catch (eJMS: JMSException) {
      this._logger.error("AsyncJmsMessagePluginBase.sendMessage() - DestinationID: ${DestinationID} - failed:\n" + eJMS.Message)
      throw eJMS
    } catch (exc: Throwable) {
      this._logger.error("AsyncJmsMessagePluginBase.sendMessage() - DestinationID: ${DestinationID} - failed:\n" + exc.Message)
      throw exc
    }
  }

  /**
   * function that creates a new JMS connection
   */
  private function createConnection(): void {
    try {
      if (this._logger.DebugEnabled)
        this._logger.debug("AsyncJmsMessagePluginBase.createConnection() - DestinationID: ${DestinationID}, Parameters:\n"
          + NAMING_FACTORY_INITIAL + ": ${_initialContextFactory}\n "
          + NAMING_PROVIDER_URL + ": ${_contextProviderURL}\n "
          + NAMING_CONNECTION_FACTORY + ": ${_connectionFactory}\n "
          + NAMING_QUEUE_SEND + ": ${_sendQueue}\n "
          + NAMING_QUEUE_REPLY + ": ${_replyQueue}\n "
          + RETRY_DELAY_SECONDS + ": ${_retryDelaySeconds}\n "
          + RETRY_MAXIMUM_LIMIT + ": ${_retryMaximumLimit}\n "
          + RETRY_BACKOFF_MULTIPLIER + ": ${_retryBackoffMultiplier}")

      if (_connection != null) {
        this.closeConnection()
      }
      // set the thread local classloader for the initial context create
      Thread.currentThread().ContextClassLoader = (AsyncJmsMessagePluginBase.Type as Class).ClassLoader
      // get the initial context
      var env = new Properties()
      env.put(Context.INITIAL_CONTEXT_FACTORY, _initialContextFactory)
      env.put(Context.PROVIDER_URL, _contextProviderURL)
      env.put("queue." + _sendQueue, _sendQueue)
      env.put("queue." + _replyQueue, _replyQueue)
      _context = new InitialContext(env)
      // create a connection factory for the request queue
      var connFactory = _context.lookup(_connectionFactory) as ConnectionFactory
      // create a new connection
      _connection = connFactory.createConnection()
      // catch an InitializationException throw in close connection
    } catch (eIE: InitializationException) {
      this._logger.error("AsyncJmsMessagePluginBase.createConnection() - DestinationID: ${DestinationID} - failed:\n" + eIE.Message)
      // rethrow the original InitializationException
      throw eIE
    } catch (exc: Throwable) {
      this._logger.error("AsyncJmsMessagePluginBase.createConnection() - DestinationID: ${DestinationID} - failed:\n" + exc.Message)
      throw exc
    }
  }

  /**
   * function that closes the JMS connection
   */
  private function closeConnection(): void {
    try {
      if (this._logger.DebugEnabled)
        this._logger.debug("AsyncJmsMessagePluginBase.closeConnection() - DestinationID: ${DestinationID} - called")

      if (_session != null) {
        _session.close()
        _session = null
      }
      if (_connection != null) {
        _connection.close()
        _connection = null
      }
    } catch (exc: Throwable) {
      this._logger.error("AsyncJmsMessagePluginBase.closeConnection() - DestinationID: ${DestinationID} - failed:\n" + exc.Message)
      throw exc
    }
  }
  
/*
  //
  //
  // methods to be used in (copied to) the MessageRequest plugin class
  //
  //

  override function afterSend(message: Message) { }

  override function beforeSend(message: Message): String {
    var payload = message.Payload

    var xml = trainingapp.messaging.async.xsd.asyncjmsmessage.ABPerson.parse(payload)
    // populate the SenderRefID only for DoB null or before 9999-01-01, for testing
    if (xml.DateOfBirth == null or xml.DateOfBirth.before(gw.api.util.DateUtil.createDateInstance(01, 01, 9999))) {
      // check if SenderRefID exists, if not assign one
      if (message.SenderRefID == null) {
        message.SenderRefID = message.PublicID + ":" + this.DestinationID
      }
    }
    _logger.info("AsyncJmsMessageRequestPlugin.beforeSend() - Message for DestinationID: " + DestinationID +
        ", SenderRefID: ${message.SenderRefID}, Status: ${message.Status}, RetryCount: " + message.RetryCount)
    return payload
  }
  // this MessageRequest plugin has no connectivity needs
  override function resume() { }
  override function suspend() { }
  override function shutdown() { }

	//
  //
  // methods to be used in (copied to) the MessageTransport plugin class
  //
  //

  override function resume() {
    // call connectivity logic specific to a JMS message producer
    super.resumeTransport()
  }

  override function send(message: Message, s: String) {
    // check if a payload is passed in from the MessageRequest Plugin
    var payload = (s == null ? message.Payload : s)

    _logger.info("AsyncJmsMessageTransportPlugin.send() - Message for DestinationID: " +
        DestinationID + ", SenderRefID: ${message.SenderRefID}, Status: " + message.Status +
        ", RetryCount: " + message.RetryCount + " - request sent, payload:\n${payload}")

    // calls a provided base method
    super.sendMessage(payload, message.SenderRefID)
  }

  //
  //
  // methods to be used in (copied to) the MessageReply plugin class
  //
  //

uses gw.api.util.DateUtil
uses gw.plugin.PluginCallbackHandler
uses gw.plugin.messaging.MessageFinder
uses gw.plugin.messaging.MessageReply
uses trainingapp.messaging.async.xsd.asyncjmsmessage.*

uses javax.jms.MessageListener
uses javax.jms.TextMessage

class AsyncJmsMessageReplyPlugin extends AsyncJmsMessagePluginBase implements MessageReply, MessageListener {

  private var _callbackHandler: PluginCallbackHandler
  private var _messageFinder: MessageFinder

  override function resume() {
    // call connectivity logic specific to a JMS message consumer
    super.resumeReply(this)
  }

  override function initTools(pluginCallbackHandler: PluginCallbackHandler, messageFinder: MessageFinder) {
    // save these utils for a later use
    this._callbackHandler = pluginCallbackHandler
    this._messageFinder = messageFinder
  }

  override function onMessage(jmsMessage: javax.jms.Message) {
    if (jmsMessage typeis TextMessage) {
      var senderRefID: String = jmsMessage.JMSCorrelationID
      var response: int = -99999
      try {
        _logger.info("AsyncJmsMessageReplyPlugin.onMessage() - JMS Text Message received for DestinationID: ${DestinationID}, SenderRefID: ${senderRefID}, Text: \n" + jmsMessage.Text)
        var xml = trainingapp.messaging.async.xsd.asyncjmsmessage.ABPerson.parse(jmsMessage.Text)
        response = (xml.Age == null ? response : xml.Age)
        if (senderRefID != null) {
          _callbackHandler.execute(\-> {
            var gwRequestMessage = _messageFinder.findBySenderRefID(senderRefID, DestinationID)
            // if pending request message found
            if (gwRequestMessage != null) {
              if (response <= -99999) {
                //invalid response received, report error
                this.reportNonRetryableError(gwRequestMessage, response, ErrorCategory.TC_PERMANENT_ERROR)
              } else if (response <= -10001) {
                // no SenderRefID found in the request sent out, report error
                this.reportNonRetryableError(gwRequestMessage, response, ErrorCategory.TC_UNEXPECTED_ERROR)
              } else if (response <= -10000) {
                // no Date Of Birth found in the request sent out, report error
                this.reportNonRetryableError(gwRequestMessage, response, ErrorCategory.TC_PAYLOAD_FORMAT)
              } else if (response <= -1) {
                // Date of Birth is in the future, schedule for a retry
                this.reportRetryableError(gwRequestMessage, response, ErrorCategory.TC_PAYLOAD_FORMAT)
              } else {
                // from 0 up, report positive ACK
                gwRequestMessage.reportAck()
                _logger.info("AsyncJmsMessageReplyPlugin.reportAck - Pending message for DestinationID: ${DestinationID}, SenderRefID: ${senderRefID}, Response: ${response}, Status: ${gwRequestMessage.Status} - acknowledged")
              }
            } else {
              this.reportHistoryDuplicate(senderRefID, response)
            }
          })
        } else {
          _logger.warn("AsyncJmsMessageReplyPlugin.onMessage() - null SenderRefID in JMS message for DestinationID: ${DestinationID}, JMSMessageID: ${jmsMessage.JMSMessageID}, Response: ${response} - JMS acknowledged:\n" + jmsMessage.toString())
        }
        jmsMessage.acknowledge()
      } catch (exc: Throwable) {
        _logger.error("AsyncJmsMessageReplyPlugin.onMessage() - ${exc.Class.Name} thrown for DestinationID: ${DestinationID}, SenderRefID: ${senderRefID}, Response: ${response}")
        throw exc
      }
    } else {
      _logger.warn("AsyncJmsMessageReplyPlugin.onMessage() - unsupported JMS Message received for DestinationID: ${DestinationID}, JMSMessageID: ${jmsMessage.JMSMessageID}, JMSType: ${jmsMessage.JMSType}\n" + jmsMessage.toString())
    }
  }

  private function reportNonRetryableError(message: Message, response: int, category: ErrorCategory): void {
    // set the message error desc, for the admin user to see in the destination (Event Messages)
    message.Description = "Response : " + response
    message.ErrorDescription = category.Description
    message.reportError(category)
    _logger.info("AsyncJmsMessageReplyPlugin.reportNonRetryableError - Pending message for DestinationID: ${DestinationID}, SenderRefID: ${message.SenderRefID}, Response: ${response}, Status: ${message.Status} - retryable error reported: " + category.DisplayName)
  }

  private function reportRetryableError(message: Message, response: int, category: ErrorCategory): void {
    if (message.RetryCount < RetryMaximumLimit) {
      var retryDelay = (Math.pow(RetryBackoffMultiplier, message.RetryCount.intValue()) as int) * RetryDelaySeconds
      if (retryDelay > 0) {
        var retryTime = DateUtil.addSeconds(DateUtil.currentDate(), retryDelay)
        // set the message error desc, for the admin user to see in the destination (Event Messages)
        message.Description = "Response : " + response
        message.ErrorDescription = "Retry#: ${message.RetryCount + 1}, Retry Delay: ${retryDelay}"
        message.reportError(retryTime)
        _logger.info("AsyncJmsMessageReplyPlugin.reportRetryableError() - Pending message for DestinationID: ${DestinationID}, SenderRefID: ${message.SenderRefID}, Response: ${response}, Status: ${message.Status} - scheduled retry#: ${message.RetryCount + 1}, delay: ${retryDelay}")
      } else {
        // if the retry delay is 0 then retry immediately
        message.Description = "Response : " + response
        message.ErrorDescription = "Retry#: ${message.RetryCount + 1}, Retry Delay: ${retryDelay}"
        message.retry()
        _logger.info("AsyncJmsMessageReplyPlugin.reportRetryableError() - Pending message for DestinationID: ${DestinationID}, SenderRefID: ${message.SenderRefID}, Response: ${response}, Status: ${message.Status} - immediate retry#: ${message.RetryCount + 1}, delay: ${retryDelay}")
      }
    } else {
      // set the message error desc, for the admin user to see in the destination (Event Messages)
      message.Description = "Response : " + response
      message.ErrorDescription = category.Description
      // max retries exceed
      message.reportError(category)
      _logger.info("AsyncJmsMessageReplyPlugin.reportRetryableError - Pending message for DestinationID: ${DestinationID}, SenderRefID: ${message.SenderRefID}, Response: ${response}, Status: ${message.Status} - retryable error reported: " + category.DisplayName)
    }
  }

  private function reportHistoryDuplicate(senderRefID: String, response: int): void {
    var gwHistoryMessage = _messageFinder.findHistoryBySenderRefID(senderRefID, DestinationID)
    if (gwHistoryMessage != null) {
      gwHistoryMessage.reportDuplicate()
      _logger.info("AsyncJmsMessageReplyPlugin.reportHistoryDuplicate() - History message for DestinationID: ${DestinationID}, SenderRefID: ${senderRefID}, Response: ${response} - duplicate increased: " + gwHistoryMessage.DuplicateCount)
    } else {
      _logger.info("AsyncJmsMessageReplyPlugin.reportHistoryDuplicate() - No history message found for DestinationID: ${DestinationID}, SenderRefID: ${senderRefID}, Response: ${response} - response ignored")
    }
  }
}
*/
}
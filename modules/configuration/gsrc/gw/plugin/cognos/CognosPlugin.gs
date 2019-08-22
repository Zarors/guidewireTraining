package gw.plugin.cognos

uses com.guidewire.commons.system.ldapserver.LdapServer
uses gw.api.server.Availability
uses gw.api.server.AvailabilityLevel
uses gw.api.startable.IStartablePlugin
uses gw.api.startable.StartablePluginCallbackHandler
uses gw.api.startable.StartablePluginState
uses gw.api.system.server.ServerUtil
uses gw.plugin.InitializablePlugin
uses gw.plugin.PluginParameter

uses java.net.InetAddress
uses java.net.MalformedURLException
uses java.net.URL
uses java.net.UnknownHostException

@Export
@Distributed
@Availability(AvailabilityLevel.MULTIUSER)
@PluginParameter(:name="namespace", :type=String)
@PluginParameter(:name="port", :type=Integer)
@PluginParameter(:name="ldapCacheRefreshPeriodInSeconds", :type=Integer)
@PluginParameter(:name="timeOutPeriodInSeconds", :type=Integer)
@PluginParameter(:name="devmode", :type=Boolean)
@PluginParameter(:name="setCognosCookiesUrl", :type=URL)
@PluginParameter(:name="gatewayEndPointUrl", :type=URL)
@PluginParameter(:name="dispatcherEndPointUrl", :type=URL)
@PluginParameter(:name="gwAppLinkBackUrl", :type=URL)
@PluginParameter(:name="isSSLEnabled", :type=URL)
@PluginParameter(:name="KeyStoreUrl", :type=URL)
@PluginParameter(:name="KeyStorePassword", :type=String)
class CognosPlugin implements IStartablePlugin, InitializablePlugin {

  /**
   * The target server(s) that are intended to run the Ldap server
   * needs to be specified below.  Only these configured server(s)
   * will start the Ldap service, but all other nodes will be
   * used to configure the Reporting tab.
   * Any parameters in the CognosPlugin that start with
   * "ldapServerId" will configure the Ldap server to start
   * on that node
   */
  private static var _ldapServerId : List<String> = new ArrayList();

  private static var _pluginName : String = "CognosPlugin"
  private var _pluginCallbackHandler : StartablePluginCallbackHandler
  private var _state : StartablePluginState = StartablePluginState.Stopped
  private var _ldapServer : LdapServer
  private var _params : Map<Object, Object>
  private static var _setCognosCookiesUrl : String

  private static var _gatewayEndPointUrl : String
  private static var _dispatcherEndPointUrl : String
  private static var _gwAppLinkBackUrl : String
  private static var validLdapNamespaces = {"ExampleCenter", "ClaimCenter", "PolicyCenter", "BillingCenter", "ContactCenter"}
  private static final var minLdapCacheRefreshPeriodInSeconds = 60;
  private static final var defaultConnectionTimeOutPeriodInSeconds = 15;
  private static final var devModeMessage = "REPORTING INTEGRATION FOR EVALUATION PURPOSES ONLY. DO NOT RUN IN PRODUCTION MODE WITHOUT REPORTING LICENSE";
  private static final var prodModeMessage = "REPORTING INTEGRATION PRODUCTION MODE. PLEASE ONLY RUN THIS WITH A REPORTING LICENSE LICENSE OBTAINED FROM GUIDEWIRE SOFTWARE";
  private static final var getTheirAttention =  "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!";


  private static function validateURL(param : String, s : String) : String {
    try {
      var url = new URL(s)
      var host1 = url.getHost()
      var urlPort = url.getPort()
      if (host1 == null || host1.trim().equals("")) {
        throw new Exception("The hostname in value of \"${param}\" param in CognosPlugin.xml may not be empty")
      }
      if (host1.equalsIgnoreCase("localhost") || host1.equals("127.0.0.1")) {
        throw new Exception("The hostname in value of \"${param}\" param in CognosPlugin.xml may not be \"localhost\" or \"127.0.0.1\"")
      }
      if (host1.equals(InetAddress.getByName(host1).getHostAddress())) {
        var host2 = InetAddress.getByName(host1).getHostName();
        if (host1.equals(host2)) {
          throw new Exception("The value of \"${param}\" param in CognosPlugin.xml (${s}) contains an IP address for which a hostname cannot be determined");
        }
      }
      return s
    } catch (e : MalformedURLException) {
      throw new Exception("Value of \"${param}\" param in CognosPlugin.xml (${s}) must be a valid URL", e);
    } catch (e : UnknownHostException) {
      throw new Exception("The host in value of \"${param}\" param in CognosPlugin.xml (${s}) is an unknown host", e);
    }
  }

  public static function getSetCognosCookiesUrl() : String {
    return _setCognosCookiesUrl;
  }

  public static function getGatewayEndPointUrl() : String {
    return _gatewayEndPointUrl
  }

  public static function getDispatcherEndPointUrl() : String {
    return _dispatcherEndPointUrl
  }

  private static function getPortAsString(port:int) : String {
    return port == -1 ? "80" : port as String
  }

  override property set Parameters(params : Map<Object, Object>) : void {
    _params = params
  }

  override function start(pluginCallbackHandler : StartablePluginCallbackHandler, serverStarting : boolean) : void {
    if (_pluginCallbackHandler == null && pluginCallbackHandler == null) {
      throw new IllegalArgumentException("pluginCallbackHandler must not be null.");
    }
    _pluginCallbackHandler = pluginCallbackHandler
    if (_state != StartablePluginState.Started) {

      var s : String
      var ldapNamespace : String
      var ldapPort : int
      var ldapCacheRefreshPeriodInSeconds : int
      var timeOutPeriodInSeconds : int
      var isDevMode : boolean
      var isSSLEnabled : boolean
      var KeyStoreUrl = ""
      var KeyStorePassword = ""

      s = _params.get("namespace") as String
      if (!validLdapNamespaces.contains(s)) {
        throw new Exception("Value of \"namespace\" param in CognosPlugin.xml must be one of " + validLdapNamespaces)
      }
      ldapNamespace = s

      s = _params.get("port") as String
      var port = -1
      try {
        port = Integer.parseInt(s)
      } finally {
        if (port < 1 or port > 65535) {
          throw new Exception("Value of \"port\" param in CognosPlugin.xml must be an integer between 1 and 65535 inclusive")
        }
      }
      ldapPort = port

      s = _params.get("ldapCacheRefreshPeriodInSeconds") as String
      var refresh = -1
      try {
        refresh = Integer.parseInt(s)
      } finally {
        if (refresh < minLdapCacheRefreshPeriodInSeconds) {
          throw new Exception("Value of \"ldapCacheRefreshPeriodInSeconds\" param in CognosPlugin.xml must be an integer >= ${minLdapCacheRefreshPeriodInSeconds}")
        }
      }
      ldapCacheRefreshPeriodInSeconds = refresh
      
      s = _params.get("timeOutPeriodInSeconds") as String
      var timeout = defaultConnectionTimeOutPeriodInSeconds
      try {
        timeout = Integer.parseInt(s)
      } finally {
        if (timeout < 1) {
          throw new Exception("Value of \"timeOutPeriodInSeconds\" param in CognosPlugin.xml must be an integer > 0")
        }
      }
      timeOutPeriodInSeconds = timeout      

      s = _params.get("devmode") as String;
      if (s != null and (s.equalsIgnoreCase("true") or s.equalsIgnoreCase("false"))) {
        isDevMode = Boolean.parseBoolean(s)
      } else {
        throw new Exception("Value of \"devmode\" param in CognosPlugin.xml must be \"true\" or \"false\"")
      }
      var msg = isDevMode ? devModeMessage : prodModeMessage;
      _pluginCallbackHandler.log("\n" + getTheirAttention + "\n" + msg + "\n" + getTheirAttention);

      // All of the following logic is to make sure the Cognos cookies are forwarded on redirect.
      s = _params.get("setCognosCookiesUrl") as String
      _setCognosCookiesUrl = validateURL("setCognosCookiesUrl", s)

      s = _params.get("gatewayEndPointUrl") as String
      _gatewayEndPointUrl = validateURL("gatewayEndPointUrl", s)

      s = _params.get("dispatcherEndPointUrl") as String
      _dispatcherEndPointUrl = validateURL("dispatcherEndPointUrl", s)

      s = _params.get("gwAppLinkBackUrl") as String
      _gwAppLinkBackUrl = validateURL("gwAppLinkBackUrl", s)

      for(key in _params.keySet()) {
        if((key as String).startsWith("ldapServerId")) {
          var k = _params.get(key) as String
          if(k != null && !"".equals(k)) {
            _ldapServerId.add(k)
          }
        }
      }

      s = _params.get("isSSLEnabled") as String;
      if (s != null and (s.equalsIgnoreCase("true") or s.equalsIgnoreCase("false"))) {
        isSSLEnabled = Boolean.parseBoolean(s)
      } else {
        throw new Exception("Value of \"isSSLEnabled\" param in CognosPlugin.xml must be \"true\" or \"false\"")
      }
      if(isSSLEnabled) {
          s = _params.get("KeyStoreUrl") as String
          if (s != null ) {
            try {
              var kUrl = new URL(s).openStream()
              kUrl.close()
              KeyStoreUrl = s
            }
            catch (e) {
              throw new Exception("Value of \"KeyStoreUrl\" param in CognosPlugin.xml must be a valid URL")
            }
          } else {
            throw new Exception("Value of \"KeyStoreUrl\" param in CognosPlugin.xml is missing")
          }

          s = _params.get("KeyStorePassword") as String
          if (s != null ) {
            KeyStorePassword = s
          } else {
            throw new Exception("Value of \"KeyStorePassword\" param in CognosPlugin.xml is missing")
          }
      }
      if (_ldapServerId.contains(ServerUtil.getServerId())) {
        _pluginCallbackHandler.log("${_pluginName} starting with namespace = ${ldapNamespace}, port = ${ldapPort}, ldapCacheRefreshPeriodInSeconds = ${ldapCacheRefreshPeriodInSeconds}, timeOutPeriodInSeconds = ${timeOutPeriodInSeconds}, setCognosCookiesUrl = ${_setCognosCookiesUrl}, gwAppLinkBackUrl = ${_gwAppLinkBackUrl}, gatewayEndPointUrl = ${_gatewayEndPointUrl}, dispatcherEndPointUrl = ${_dispatcherEndPointUrl}, isSSLEnabled = ${isSSLEnabled}")
        _ldapServer = new LdapServer(ldapNamespace, ldapPort, ldapCacheRefreshPeriodInSeconds, _gwAppLinkBackUrl, isSSLEnabled, KeyStoreUrl, KeyStorePassword)
        _ldapServer.start()
      } else {
        _pluginCallbackHandler.log("${_pluginName} Ldap Server not configured to run on this server. Cognos configuration: setCognosCookiesUrl = ${_setCognosCookiesUrl}, gwAppLinkBackUrl = ${_gwAppLinkBackUrl}, gatewayEndPointUrl = ${_gatewayEndPointUrl}, dispatcherEndPointUrl = ${_dispatcherEndPointUrl}, isSSLEnabled = ${isSSLEnabled}")
      }
      _state = StartablePluginState.Started
    }
  }

  override function stop(serverShuttingDown : boolean) : void {
    if (_state != StartablePluginState.Stopped) {
      // _pluginCallbackHandler.logStop(_pluginName)
      _pluginCallbackHandler.log("***** " + _pluginName + " plugin stopping *****")
      if(_ldapServer != null) {
        _ldapServer.terminate()
        _ldapServer = null;
      }
      _state = StartablePluginState.Stopped
    }
  }

  override property get State() : StartablePluginState {
    return _state;
  }

}

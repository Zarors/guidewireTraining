package gw.wsi.pl

uses gw.api.webservice.exception.ServerStateException
uses gw.api.webservice.systemTools.ServerStateInfo
uses gw.api.webservice.systemTools.ServerStateInfoImpl
uses gw.xml.ws.WsiAuthenticationException
uses gw.xml.ws.annotation.WsiAvailability
uses gw.xml.ws.annotation.WsiGenInToolkit
uses gw.xml.ws.annotation.WsiWebService

/**
 * ServerStateAPI provides server state details
 */
@WsiWebService("http://guidewire.com/pl/ws/gw/wsi/pl/ServerStateAPI")
@WsiAvailability(STARTING)
@WsiGenInToolkit
@Export
class ServerStateAPI {

  /**
   * Gets the server state details
   * @see  ServerStateInfo
   */
  @Throws(WsiAuthenticationException, "On permission or authentication errors")
  @Throws(ServerStateException,"for errors production the report")
  public function getServerState(): ServerStateInfo {
    return new ServerStateInfoImpl().getServerState()
  }
}
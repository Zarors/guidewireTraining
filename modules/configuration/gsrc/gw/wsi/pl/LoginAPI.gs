package gw.wsi.pl

uses gw.api.webservice.exception.LoginException
uses gw.api.webservice.login.LoginAPIHelper
uses gw.xml.ws.annotation.WsiAvailability
uses gw.xml.ws.annotation.WsiPermissions
uses gw.xml.ws.annotation.WsiWebService

/**
* <p>
* A remote interface that allows a user to log in and out of a system. The system uses conversations to implement SOAP
* authentication in a Guidewire application  (e.g. BillingCenter, ClaimCenter, PolicyCenter). When connecting to Guidewire
* applications the caller must first authenticate using the <code>ILoginAPI.login()</code> method.  This method returns the
* the session ID of the server session.
* </p>
* <p>
* On each successive call in the conversation, pass the session ID in the SOAP header
* {@link gw.pl.util.webservices.Globals#GW_AUTHENTICATION_SECURITY_TOKEN_CONTEXT_PROPERTY}. You must call
* <code>logout()</code> when you are done with the conversation.
*</p>
*<p><b>NOTE:</b> This API is intended for users who are using Guidewire's web services from languages other
* than Java.   If you are using Java, you should use the <code>APILocator</code> instead.
* </p>
*/
@WsiWebService("http://guidewire.com/pl/ws/gw/wsi/pl/LoginAPI")
@WsiAvailability(MAINTENANCE)
@WsiPermissions({})
@Export
class LoginAPI {
  
  /**
   * Logs the user into a Guidewire application (e.g. ClaimCenter, PolicyCenter, BillingCenter). Returns the session ID
   * of the server session.
   *
   * @param userName The user name to authenticate.
   * @param password The password to authenticate with.
   * @return A valid session ID.
   */
  @Throws(LoginException, "if the user cannot be authenticated.")
  public function login(userName : String, password : String) : String{
    return LoginAPIHelper.login( userName, password)
  }

  /**
   * Logs the user out of the session.  The session will timeout if this method is not called.
   *
   * @param sessionID the session ID of the server session.
   */
  public function logout(sessionID : String){
    LoginAPIHelper.logout( sessionID )
  }

}

package trn.ta.plugin.userauthentication

uses gw.plugin.security.*
uses javax.security.auth.login.FailedLoginException

class CustomAuthenticationServicePlugin implements AuthenticationServicePlugin {

  private var _handler : AuthenticationServicePluginCallbackHandler = null

  override function authenticate(source : AuthenticationSource) : String {
    // Retrieve credentials from Authentication Source
    if (!(source typeis UserNamePasswordAuthenticationSource)) {
      throw new IllegalArgumentException("Invalid Authentication Source type")
    }

    var castSource = source as UserNamePasswordAuthenticationSource
    var username = castSource.Username
    var password = castSource.Password

    // Authenticate against external authentication service.
    // Authenticate against application database
    if (this._handler == null) {
      throw new AuthenticationException("Callback handler not set")
    }
    var userPublicID = this._handler.findUser(username)
    if (userPublicID == null) {
      throw new FailedLoginException("Bad user name: " + username)
    }
    var returnCode = this._handler.verifyInternalCredential(userPublicID, password)
    if (returnCode == CredentialVerificationResult.BAD_USER_ID) {
      throw new FailedLoginException("Bad user name: " + username)
    } else if (returnCode == CredentialVerificationResult.WAIT_TO_RETRY){
      throw new MustWaitToRetryException("Still within the login retry delay period")
    } else if (returnCode == CredentialVerificationResult.CREDENTIAL_LOCKED) {
      throw new LockedCredentialException("The specified user has been locked")
    } else if (returnCode == CredentialVerificationResult.PASSWORD_MISMATCH) {
      throw new FailedLoginException("Bad password for user: " + username)
    } else {
      return userPublicID
    }
  }

  override property set Callback(callbackHandler : AuthenticationServicePluginCallbackHandler) {
    _handler = callbackHandler
  }
}
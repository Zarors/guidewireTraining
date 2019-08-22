package trn.ta.plugin.userauthentication

uses gw.plugin.security.*
uses gw.util.Pair
uses gw.xsd.guidewire.soapheaders.Authentication

class CustomWebservicesAuthenticationPlugin implements WebservicesAuthenticationPlugin {

  override function authenticate(context : WebservicesAuthenticationContext) : User {
    var user : User = null
    var authMethods = new ArrayList<AuthenticationMethod>()
    // Retrieve credentials from HTTPHeaders
    // Retrieve credentials from RequestSoapHeaders
    var headersFromEnvelope = context.RequestSoapHeaders
    if (headersFromEnvelope != null) {
      final var auth = headersFromEnvelope.get$Child(Authentication)
      if (auth != null && !auth.is$Nil()) {
        authMethods.add(new UsernamePasswordAuthenticationMethod() {
          protected override property get UsernamePassword() : Pair<String, String> {
            return new Pair<String, String>(auth.Username, auth.Password)
          }
        })
      }
    }
    // Authenticate the user against Guidewire database and call AuthenticationServicePlugin.
    if (!authMethods.isEmpty()) {
      user = authMethods.get(0).getUser()
    }
    return user
  }
}
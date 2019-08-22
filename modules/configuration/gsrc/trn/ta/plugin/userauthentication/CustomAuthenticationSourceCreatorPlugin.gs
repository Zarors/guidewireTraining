package trn.ta.plugin.userauthentication

uses gw.plugin.security.AuthenticationSource
uses gw.plugin.security.AuthenticationSourceCreatorPlugin
uses gw.plugin.security.UserNamePasswordAuthenticationSource
uses javax.servlet.http.HttpServletRequest

class CustomAuthenticationSourceCreatorPlugin implements AuthenticationSourceCreatorPlugin {

  override function createSourceFromHTTPRequest(request : HttpServletRequest) : AuthenticationSource {
    var username = request.getAttribute("username") as String
    var password = request.getAttribute("password") as String
    return new UserNamePasswordAuthenticationSource(username, password)
  }
}
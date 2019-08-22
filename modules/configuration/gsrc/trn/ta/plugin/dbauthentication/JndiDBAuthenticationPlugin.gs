package trn.ta.plugin.dbauthentication

uses gw.plugin.dbauth.DBAuthenticationPlugin
uses gw.plugin.dbauth.UsernamePasswordPair
uses javax.naming.Context
uses javax.naming.InitialContext

class JndiDBAuthenticationPlugin implements DBAuthenticationPlugin {

  override function retrieveUsernameAndPassword(dbName : String) : UsernamePasswordPair {
    var initCtx = new InitialContext()
    var envCtx = initCtx.lookup("java:comp/env") as Context
    var username = envCtx.lookup("jdbc/" + dbName + "/username") as String
    var password = envCtx.lookup("jdbc/" + dbName + "/password") as String
    return new UsernamePasswordPair(username, password)
  }
}
package gw.wsi.pl

uses gw.plugin.Plugins
uses gw.plugin.credentials.CredentialsPlugin
uses gw.plugin.credentials.UsernamePasswordPairBase
uses gw.xml.ws.IWsiWebserviceConfigurationProvider
uses gw.xml.ws.WsdlConfig

uses javax.xml.namespace.QName

@Export
abstract class GWCredentialsConfigProviderBase implements IWsiWebserviceConfigurationProvider {

  protected function getCredential(serviceName: String) : UsernamePasswordPairBase {
    var plugin = Plugins.get(CredentialsPlugin)
    if (plugin == null) {
      throw new IllegalStateException("On " + serviceName + " CredentialsPlugin not configured")
    }
    var cred : UsernamePasswordPairBase
    var env = gw.api.system.server.ServerUtil.getEnv();
    if (env != null) {
      var key = env + " " + serviceName;
      cred = plugin.retrieveUsernameAndPassword(key)
    }
    if (cred != null) {
      return cred
    }
    cred = plugin.retrieveUsernameAndPassword(serviceName)
    if (cred != null) {
      return cred
    }
    throw new IllegalStateException(serviceName + " not found in CredentialsPlugin")
  }
}
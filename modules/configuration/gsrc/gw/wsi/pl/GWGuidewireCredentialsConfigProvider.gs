package gw.wsi.pl

uses gw.xml.ws.WsdlConfig
uses javax.xml.namespace.QName

@Export
class GWGuidewireCredentialsConfigProvider extends GWCredentialsConfigProviderBase {

  override function configure( serviceName : QName, portName : QName, config : WsdlConfig )  {
    if (config.Guidewire.Authentication.Username == null) {
      var cred = getCredential(serviceName.NamespaceURI)
      config.Guidewire.Authentication.Username = cred.Username
      config.Guidewire.Authentication.Password = cred.Password
    }
  }

}
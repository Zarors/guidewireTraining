package gw.wsi.pl

uses gw.xml.ws.WsdlConfig
uses javax.xml.namespace.QName

@Export
class GWDigestCredentialsConfigProvider extends GWCredentialsConfigProviderBase {

  override function configure( serviceName : QName, portName : QName, config : WsdlConfig )  {
    if (config.Http.Authentication.Digest.Username == null) {
      var cred = getCredential(serviceName.NamespaceURI);
      config.Http.Authentication.Digest.Username = cred.Username
      config.Http.Authentication.Digest.Password = cred.Password
    }
  }
}
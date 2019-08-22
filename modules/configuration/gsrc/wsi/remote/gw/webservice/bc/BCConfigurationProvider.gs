package wsi.remote.gw.webservice.bc

uses javax.xml.namespace.QName
uses gw.xml.ws.WsdlConfig
uses gw.xml.ws.IWsiWebserviceConfigurationProvider

@Export
class BCConfigurationProvider implements IWsiWebserviceConfigurationProvider {

  override function configure( serviceName : QName, portName : QName, config : WsdlConfig )  {
    config.Guidewire.Authentication.Username = "su"
    config.Guidewire.Authentication.Password = "gw"
  }

}

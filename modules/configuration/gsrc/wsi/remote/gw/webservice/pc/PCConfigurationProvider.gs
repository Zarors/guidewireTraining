package wsi.remote.gw.webservice.pc

uses javax.xml.namespace.QName
uses gw.xml.ws.WsdlConfig
uses gw.xml.ws.IWsiWebserviceConfigurationProvider

@Export
class PCConfigurationProvider implements IWsiWebserviceConfigurationProvider {

  override function configure( serviceName : QName, portName : QName, config : WsdlConfig )  {
    config.Guidewire.Authentication.Username = "su"
    config.Guidewire.Authentication.Password = "gw"
  }

}

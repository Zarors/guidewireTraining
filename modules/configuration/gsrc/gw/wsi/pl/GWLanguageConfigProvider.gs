package gw.wsi.pl

uses gw.xml.ws.IWsiWebserviceConfigurationProvider
uses gw.xml.ws.WsdlConfig
uses gw.api.util.LocaleUtil
uses javax.xml.namespace.QName

@Export
class GWLanguageConfigProvider implements IWsiWebserviceConfigurationProvider {

  override function configure( serviceName : QName, portName : QName, config : WsdlConfig )  {
    if (config.Guidewire.Locale == null) {
      config.Guidewire.Locale = LocaleUtil.getCurrentLanguage().Code
    }
    if (config.Guidewire.GwLanguage == null) {
      config.Guidewire.GwLanguage = LocaleUtil.getCurrentLanguage().Code
    }
    if (config.Guidewire.GwLocale == null) {
      config.Guidewire.GwLocale = LocaleUtil.getCurrentLocale().Code
    }
  }

}

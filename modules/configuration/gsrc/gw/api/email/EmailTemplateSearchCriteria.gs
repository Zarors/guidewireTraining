package gw.api.email

uses gw.plugin.email.IEmailTemplateDescriptor

uses gw.api.util.DisplayableException
uses gw.api.util.LocaleUtil
uses gw.plugin.email.IEmailTemplateSource

uses java.util.HashMap
uses java.lang.Throwable

@Export
class EmailTemplateSearchCriteria implements java.io.Serializable {  
  var _topic : String as Topic
  var _keywords : String as Keywords
  var _language : LanguageType as Language
  var _availableSymbolsBlock = \ -> { return _availableSymbols }
  var _availableSymbols : String[] as AvailableSymbols 
  // see manually created copy() method add any new variable to that as well 
  
  construct() {
    Language = LocaleUtil.toLanguageType(User.util.CurrentLanguage)
  }
  
  construct(availSymbols : String[]) {
    this()
    _availableSymbols = availSymbols
  }

  construct(availSymbolsBlock() : String[]) {
    this()
    _availableSymbolsBlock = availSymbolsBlock
  }

  function performSearch() : IEmailTemplateDescriptor[] {
    var ets : IEmailTemplateSource
    try {
      ets = gw.plugin.Plugins.get(IEmailTemplateSource)
    } catch (e : Throwable) {
      throw new DisplayableException("Could not find a plugin configured for IEmailTemplateSource", e)
    }

    var valuesToMatch = new HashMap<String,String>()
    valuesToMatch.put("topic", _topic)
    valuesToMatch.put("keywords", _keywords)
    if (_availableSymbolsBlock != null) {
      var symbols = _availableSymbolsBlock()
      if (symbols != null) {
        valuesToMatch.put("availablesymbols", symbols.join( "," ))
      }
    }
    var templates = ets.getEmailTemplates(LocaleUtil.toLanguage( _language ), valuesToMatch)
    return templates
  }
    
  function copy() : EmailTemplateSearchCriteria {
    var rtn = new EmailTemplateSearchCriteria()
    rtn._topic = Topic
    rtn._keywords = Keywords
    rtn._language = Language
    rtn._availableSymbols = AvailableSymbols
    return rtn
  }
}

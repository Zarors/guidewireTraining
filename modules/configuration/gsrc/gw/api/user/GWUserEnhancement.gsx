package gw.api.user

uses gw.api.util.PhoneUtil
uses gw.api.util.LocaleUtil

@Export
enhancement GWUserEnhancement : entity.User {

  property get UserLanguage() : LanguageType{
    if (this.Language == null) {
      return LocaleUtil.DefaultLanguageType
    }
    return this.Language
  }

  property set UserLanguage(language : LanguageType){
    this.Language = language
  }

  property get UserLocale() : LocaleType{
    if (this.Locale == null) {
      return LocaleUtil.DefaultLocaleType
    }
    return this.Locale
  }

  property set UserLocale(locale : LocaleType){
    this.Locale = locale
  }

  property get UserDefaultCountry() : Country{
    if (this.DefaultCountry == null) {
      return LocaleUtil.UserDefaultCountry
    }
    return this.DefaultCountry
  }

  property set UserDefaultCountry(country : Country){
    this.DefaultCountry = country
  }

  property get UserDefaultPhoneCountry() : PhoneCountryCode{
    if (this.DefaultPhoneCountry == null) {
      return PhoneUtil.UserDefaultPhoneCountry
    }
    return this.DefaultPhoneCountry
  }

  property set UserDefaultPhoneCountry(phoneCountry : PhoneCountryCode){
    this.DefaultPhoneCountry = phoneCountry
  }

  function initPreferences() {
    this.Locale = LocaleUtil.DefaultLocaleType
    this.Language = LocaleUtil.DefaultLanguageType
    this.DefaultCountry = LocaleUtil.DefaultCountry
    this.DefaultPhoneCountry = PhoneUtil.DefaultPhoneCountryCode
  }

}

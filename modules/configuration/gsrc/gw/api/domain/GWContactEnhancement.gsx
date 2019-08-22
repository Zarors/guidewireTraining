package gw.api.domain

uses gw.api.util.phone.GWPhoneNumber
uses gw.api.util.PhoneUtil
uses gw.api.util.phone.GWPhoneNumberBuilder

enhancement GWContactEnhancement : entity.Contact {

  property get HomePhoneValue() : String {
    return PhoneUtil.format(this.HomePhoneCountry, this.HomePhone, this.HomePhoneExtension)
  }

  property get WorkPhoneValue() : String {
    return PhoneUtil.format(this.WorkPhoneCountry, this.WorkPhone, this.WorkPhoneExtension)
  }

  property get FaxPhoneValue() : String {
    return PhoneUtil.format(this.FaxPhoneCountry, this.FaxPhone, this.FaxPhoneExtension)
  }

  property get HomePhoneValueIntl() : String {
    return PhoneUtil.formatIntl(this.HomePhoneCountry, this.HomePhone, this.HomePhoneExtension)
  }

  property get WorkPhoneValueIntl() : String {
    return PhoneUtil.formatIntl(this.WorkPhoneCountry, this.WorkPhone, this.WorkPhoneExtension)
  }

  property get FaxPhoneValueIntl() : String {
    return PhoneUtil.formatIntl(this.FaxPhoneCountry, this.FaxPhone, this.FaxPhoneExtension)
  }

  property get GWHomePhone() : GWPhoneNumber {
    return PhoneUtil.buildPhoneNumbers(this.HomePhoneCountry, this.HomePhone, this.HomePhoneExtension)
  }

  property set GWHomePhone(phone : GWPhoneNumber){
    this.HomePhoneCountry = phone.CountryCode
    this.HomePhone = phone.NationalNumber
    this.HomePhoneExtension = phone.Extension
  }

  property get GWWorkPhone() : GWPhoneNumber {
    return PhoneUtil.buildPhoneNumbers(this.WorkPhoneCountry, this.WorkPhone, this.WorkPhoneExtension)
  }

  property set GWWorkPhone(phone : GWPhoneNumber){
    this.WorkPhoneCountry = phone.CountryCode
    this.WorkPhone = phone.NationalNumber
    this.WorkPhoneExtension = phone.Extension
  }

  property get GWFaxPhone() : GWPhoneNumber {
    return PhoneUtil.buildPhoneNumbers(this.FaxPhoneCountry, this.FaxPhone, this.FaxPhoneExtension)
  }

  property set GWFaxPhone(phone : GWPhoneNumber){
    this.FaxPhoneCountry = phone.CountryCode
    this.FaxPhone = phone.NationalNumber
    this.FaxPhoneExtension = phone.Extension
  }

  property get PrimaryPhoneValueIntl() : String {
    var primaryPhone = this.PrimaryPhone
    var value : String = null

    if (primaryPhone != null) {
        var gwPhone = PhoneUtil.getPrimaryPhoneNumberHelper(this, primaryPhone)
        //will be null if national number is null
        if(gwPhone!=null) {
           value = gwPhone.formatIntlWithLocalizedExtension()
        }
    }
    return value
  }

}
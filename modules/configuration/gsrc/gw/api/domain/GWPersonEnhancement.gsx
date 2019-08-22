package gw.api.domain

uses gw.api.util.phone.GWPhoneNumberBuilder
uses gw.api.util.PhoneUtil
uses gw.api.util.phone.GWPhoneNumber

enhancement GWPersonEnhancement : entity.Person {

  property get CellPhoneValue() : String {
    return PhoneUtil.format(this.CellPhoneCountry, this.CellPhone, this.CellPhoneExtension)
  }

  property get CellPhoneValueIntl() : String {
    return PhoneUtil.formatIntl(this.CellPhoneCountry, this.CellPhone, this.CellPhoneExtension)
  }

  property get GWCellPhone() : GWPhoneNumber {
    return PhoneUtil.buildPhoneNumbers(this.CellPhoneCountry, this.CellPhone, this.CellPhoneExtension)
  }

  property set GWCellPhone(phone : GWPhoneNumber){
    this.CellPhoneCountry = phone.CountryCode
    this.CellPhone = phone.NationalNumber
    this.CellPhoneExtension = phone.Extension
  }



}

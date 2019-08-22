package gw.webservice.ab.ab900.abcontactapi

uses java.util.Date
uses java.lang.Double

// Make @Export because it corresponds to the ABContact entity which the customer may extend.
@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/ab/ws/gw/webservice/ab/ab900/abcontactapi/ABContactAPIFindDuplicatesResult" )
final class ABContactAPIFindDuplicatesResult implements IABContactAPIFindDuplicatesResult {

  public var Exact              : Boolean
  public var LinkID             : String
  public var ContactType        : typekey.ABContact
  public var Name               : String
  public var NameKanji          : String
  public var FirstName          : String
  public var FirstNameKanji     : String
  public var LastName           : String
  public var LastNameKanji      : String
  public var MiddleName         : String
  public var Prefix             : typekey.NamePrefix
  public var Suffix             : typekey.NameSuffix
  public var Particle           : String
  public var CellPhone          : String
  public var CellPhoneCountry   : String
  public var CellPhoneExtension : String
  public var DateOfBirth        : Date
  public var EmailAddress1      : String
  public var EmailAddress2      : String
  public var PrimaryPhone       : typekey.PrimaryPhoneType
  public var FaxPhone           : String
  public var FaxPhoneCountry    : String
  public var FaxPhoneExtension  : String
  public var HomePhone          : String
  public var HomePhoneCountry   : String
  public var HomePhoneExtension : String
  public var WorkPhone          : String
  public var WorkPhoneCountry   : String
  public var WorkPhoneExtension : String
  public var Preferred          : Boolean
  public var VendorType         : typekey.VendorType
  public var VendorAvailability : typekey.VendorAvailabilityType
  public var Score              : Double
  public var TaxID              : String
  public var PrimaryAddress     : AddressInfo
  
  construct() {}
  
  construct(contact : ABContact, exactMatch : boolean) {
    this.Exact       = exactMatch
    this.LinkID      = contact.LinkID
    this.ContactType = contact.Subtype
    this.Name = contact.Name
    this.NameKanji = contact.NameKanji
    if (contact typeis ABPerson) {
      this.FirstName = contact.FirstName
      this.FirstNameKanji = contact.FirstNameKanji
      this.LastName = contact.LastName
      this.LastNameKanji = contact.LastNameKanji
      this.MiddleName = contact.MiddleName
      this.Prefix = contact.Prefix
      this.Suffix = contact.Suffix
      this.Particle = contact.Particle
      this.CellPhone = contact.CellPhone
      this.CellPhoneCountry = contact.CellPhoneCountry.Code
      this.CellPhoneExtension = contact.CellPhoneExtension
      this.DateOfBirth = contact.DateOfBirth
    }
    
    this.EmailAddress1 = contact.EmailAddress1
    this.EmailAddress2 = contact.EmailAddress2
    this.PrimaryPhone = contact.PrimaryPhone
    this.FaxPhone = contact.FaxPhone
    this.FaxPhoneCountry = contact.FaxPhoneCountry.Code
    this.FaxPhoneExtension = contact.FaxPhoneExtension
    this.HomePhone = contact.HomePhone
    this.HomePhoneCountry = contact.HomePhoneCountry.Code
    this.HomePhoneExtension = contact.HomePhoneExtension
    this.WorkPhone = contact.WorkPhone
    this.WorkPhoneCountry = contact.WorkPhoneCountry.Code
    this.WorkPhoneExtension = contact.WorkPhoneExtension
    this.Preferred = contact.Preferred
    this.VendorType = contact.VendorType
    this.VendorAvailability = contact.VendorAvailability
    this.Score = contact.Score
    this.TaxID = contact.TaxID
    this.PrimaryAddress = new AddressInfo(contact.PrimaryAddress)
  }
}

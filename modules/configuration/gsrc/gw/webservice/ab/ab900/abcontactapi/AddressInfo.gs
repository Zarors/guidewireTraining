package gw.webservice.ab.ab900.abcontactapi

uses java.util.Date
uses gw.api.database.spatial.SpatialPoint

// Make @Export because it corresponds to the Address entity which the customer may extend.
@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/ab/ws/gw/webservice/ab/ab900/abcontactapi/AddressInfo" )
final class AddressInfo {

  public var LinkID        : String
  public var AddressLine1  : String
  public var AddressLine1Kanji  : String
  public var AddressLine2  : String
  public var AddressLine2Kanji  : String
  public var AddressLine3  : String
  public var City          : String
  public var CityKanji     : String
  public var State         : typekey.State
  public var PostalCode    : String
  public var CEDEX         : Boolean
  public var CEDEXBureau   : String
  public var Country       : typekey.Country
  public var County        : String
  public var Description   : String
  public var AddressType   : typekey.AddressType
  public var ValidUntil    : Date
  public var SpatialPoint  : SpatialPoint
  public var GeocodeStatus : typekey.GeocodeStatus

  construct() {}

  construct(address : Address) {
    this.LinkID = address.LinkID
    this.AddressLine1 = address.AddressLine1
    this.AddressLine1Kanji = address.AddressLine1Kanji
    this.AddressLine2 = address.AddressLine2
    this.AddressLine2Kanji = address.AddressLine2Kanji
    this.AddressLine3 = address.AddressLine3
    this.City = address.City
    this.CityKanji = address.CityKanji
    this.State = address.State
    this.PostalCode = address.PostalCode
    this.CEDEX = address.CEDEX
    this.CEDEXBureau = address.CEDEXBureau
    this.Country = address.Country
    this.County = address.County
    this.Description = address.Description
    this.AddressType = address.AddressType
    this.ValidUntil = address.ValidUntil
    this.SpatialPoint = address.SpatialPoint
    this.GeocodeStatus = address.GeocodeStatus
  }
}

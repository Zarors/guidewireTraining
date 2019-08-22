package gw.webservice.ab.ab900.abcontactapi

// Make @Export because it corresponds to the Address entity which the customer may extend.
@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/ab/ws/gw/webservice/ab/ab900/abcontactapi/ABContactAPIAddressSearch" )
final class ABContactAPIAddressSearch {
  
  public var City       : String
  public var CityKanji  : String
  public var State      : typekey.State
  public var PostalCode : String
  public var Country    : typekey.Country

  construct() {}
}

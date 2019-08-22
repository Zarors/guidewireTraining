package gw.webservice.ab.ab1000.abcontactapi

uses gw.api.database.spatial.SpatialPoint

// Make it @Export because it corresponds to the ProximitySearchParameters entity
// which the customer may extend.
@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/ab/ws/gw/webservice/ab/ab1000/abcontactapi/ABContactAPIProximitySearchParameters" )
final class ABContactAPIProximitySearchParameters {

  public var DistanceBasedSearch   : Boolean
  public var Number                : Integer
  public var UnitOfDistance        : typekey.UnitOfDistance
  public var GeocodeStatus         : typekey.GeocodeStatus
  public var SpatialPoint          : SpatialPoint  
  public var SavedSearchCenter     : String
  public var CorrectedSearchCenter : String
}

package gw.webservice.ab.ab900.abcontactapi

uses java.lang.Integer

@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/ab/ws/gw/webservice/ab/ab900/abcontactapi/ABContactAPIFindDuplicatesResultContainer" )
final class ABContactAPIFindDuplicatesResultContainer implements IABContactAPIFindDuplicatesResultContainer {

  construct() {}

  var _totalResults : Integer as TotalResults
  public var Results : ABContactAPIFindDuplicatesResult[]

  override function updateResults(value: List<IABContactAPIFindDuplicatesResult>) {
    Results = value.toArray(new ABContactAPIFindDuplicatesResult[value.size()])
  }
}

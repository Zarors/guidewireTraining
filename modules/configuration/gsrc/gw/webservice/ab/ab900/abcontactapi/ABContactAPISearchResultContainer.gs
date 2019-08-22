package gw.webservice.ab.ab900.abcontactapi

uses java.lang.Integer

@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/ab/ws/gw/webservice/ab/ab900/abcontactapi/ABContactAPISearchResultContainer" )
final class ABContactAPISearchResultContainer implements IABContactAPISearchResultContainer {

  var _totalResults : Integer as TotalResults
  public var Results      : ABContactAPISearchResult[]

  override function updateResults(value: List<IABContactAPISearchResult>) {
    Results = value.toArray(new ABContactAPISearchResult[value.size()])
  }
}

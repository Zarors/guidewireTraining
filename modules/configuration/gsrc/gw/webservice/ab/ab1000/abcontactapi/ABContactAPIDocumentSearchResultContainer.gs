package gw.webservice.ab.ab1000.abcontactapi


/**
 * API for Document Management. Retrieval of documents linked to ABContacts.
 */
@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/ab/ws/gw/webservice/ab/ab1000/abcontactapi/ABContactAPIDocumentSearchResultContainer" )
final class ABContactAPIDocumentSearchResultContainer implements IABContactAPIDocumentSearchResultContainer {

  construct() {}

  var _totalResults : Integer as TotalResults
  public var Results : ABContactAPIDocumentInfo[]


  override function updateResults(results: List<IABContactAPIDocumentInfo>) {
    Results = results.toArray(new ABContactAPIDocumentInfo[results.size()])
  }
}
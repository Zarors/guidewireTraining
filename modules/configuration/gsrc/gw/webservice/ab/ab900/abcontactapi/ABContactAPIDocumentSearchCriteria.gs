package gw.webservice.ab.ab900.abcontactapi

uses gw.pl.persistence.core.Bundle

/**
 * Search criteria used by ABContactAPI.retrieveDocumentsForContact.
 */
// Make @Export because it corresponds to the Document entity which the customer may extend.

@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/ab/ws/gw/webservice/ab/ab900/abcontactapi/ABContactAPIDocumentSearchCriteria" )
final class ABContactAPIDocumentSearchCriteria implements IABContactAPIDocumentSearchCriteria {

  public var IncludeObsoletes: Boolean
  public var IncludeDocumentSecurityTypes: typekey.DocumentSecurityType []

  construct() { }

  override function toSearchCriteria(b : Bundle, abContact : ABContact) : DocumentSearchCriteria {
    var criteria = new DocumentSearchCriteria(b) {
        :IncludeObsoletes       = this.IncludeObsoletes == null ? false : this.IncludeObsoletes, // Do not send 'Hidden' documents by default
        :ABContact              = abContact,
        :Pending                = false // Do not send the 'in flight' documents by default
    }

    var includeDocumentSecurityTypes = this.IncludeDocumentSecurityTypes
    if (includeDocumentSecurityTypes != null) {
      for (documentSecurityType in includeDocumentSecurityTypes) {
        if (documentSecurityType != null) {
          criteria.addToDocumentSecurityTypes(new DocumentSecurityTypeSearchWrapper(b){
              :DocumentSecurityType = documentSecurityType,
              :DocumentSearchCriteria = criteria
              })
        }
      }
    } else {
      // In this case we want to retrive all the documents which DocumentSecurityType is not specified, i.e. null
      criteria.addToDocumentSecurityTypes(new DocumentSecurityTypeSearchWrapper(b){
          :DocumentSecurityType = null,
          :DocumentSearchCriteria = criteria
          })
    }

    return criteria
  }
}
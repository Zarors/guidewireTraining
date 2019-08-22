package gw.plugin.document.impl

uses java.io.ByteArrayInputStream
uses java.lang.RuntimeException
uses java.lang.UnsupportedOperationException
uses java.net.URLEncoder
uses java.text.SimpleDateFormat
uses gw.api.system.ABLoggerCategory

uses gw.document.DocumentsUtilBase
uses gw.document.documentdto.Documents
uses gw.entity.IEntityType
uses gw.plugin.document.IDocumentMetadataSource
uses gw.plugin.util.RemotableSearchResultSpec
uses gw.transaction.Transaction
uses gw.util.StreamUtil

uses java.util.Map

/**
 *
 * IMPORTANT: This implementation is for Demo purpose only. Please do not modify it. Use it as an example for your
 * IDocumentMetadataSource implementation and define it in the plugin-gosu for your
 * IDocumentMetadataSource.gwp.
 *
 * IDocumentMetadataSource implementation for document management using DMSServlet.
 *
 * This plugin assumes that the validations for the original fields of the Document entity
 * are done at the UI level outside of the plugin.
 */
@Export
class ServletBackedDocumentMetadataSource  extends ServletBackedDocumentBaseSource implements IDocumentMetadataSource {

  var _dateFormat = new SimpleDateFormat("yyyy-MM-dd")

  override property set Parameters(parameters: Map<Object, Object>) {
    parameters.put("gw.document.DMSServlet.props", "PublicID,ABContactDocumentLink.ABContact")
    super.Parameters = parameters
  }

  override function removeDocument( doc : Document ) : void  {
    /**
     * Removing the document from the DMS is not implemented in this demo plugin. There could be other resources
     * referencing to the document. It is up to each IDocumentContentSource plugin implementation (Asynchronous and
     * Synchronous) to decide how to handle the removal of the documents from the DMS.
     */
    throw new UnsupportedOperationException("Removing the document from the DMS is not implemented in this demo plugin.");
  }

  override function retrieveDocument( uniqueId : String ) : Document  {
    var urlStr = UrlRoot + "metadata?PublicID=" + uniqueId
    ABLoggerCategory.DOCUMENT.debug("SBDMS-retrieveDocument url=" + urlStr)
    var docs : Documents
    readFromServlet(urlStr, \ is -> {docs = Documents.parse(is)})
    if (docs.Document.size() > 0) {
      var doc = DocumentsUtilBase.fetchAndUpdate(Transaction.Current, docs.Document[0].$TypeInstance, false, true)
      if (doc != null) {
        ABLoggerCategory.DOCUMENT.debug("SBDMS-retrieveDocument doc.PublicID=" + doc.PublicID + " doc.DocUID=" + doc.DocUID)
      }
      return doc
    }
    return null
  }

  private function refreshDocUID(document : Document ) : String {
    var encodedPublicID = URLEncoder.encode(document.PublicID, "utf-8")
    return "content/" + encodedPublicID + "/" + URLEncoder.encode(document.Name, "utf-8")
  }

  override function saveDocument( doc : Document ) : void  {

    var xml = doc.asXml(false)
    ABLoggerCategory.DOCUMENT.debug("SBDMS-saveDocument doc.DocUID=" + doc.DocUID + " xml:\n" + xml.asUTFString())
    if (doc.PublicID == null) {
      var publicId = writeToServlet(UrlRoot + "metadata", new ByteArrayInputStream(xml.asUTFString().getBytes("utf-8")))
      doc.PublicID = publicId
    }
    else {
      var encodedPublicId = URLEncoder.encode(doc.PublicID, "utf-8")
      writeToServlet(UrlRoot + "metadata/" + encodedPublicId + "?update", new ByteArrayInputStream(xml.asUTFString().getBytes("utf-8")) )
    }
    if (doc.DocUID != DocumentsUtilBase.NO_FILE_CONTENT_UID) {
      var newDocUID = refreshDocUID(doc)
      if (doc.DocUID != newDocUID) {
        ABLoggerCategory.DOCUMENT.debug("SBDMS-saveDocument having to change DocUID was=" + doc.DocUID + " new=" + newDocUID)
        doc.DocUID = newDocUID
      }
    }
  }

  override function searchDTODocuments( criteria : DocumentSearchCriteria, resultSpec : RemotableSearchResultSpec ) : Documents {
    var urlStr = UrlRoot + "metadata?"
        + "_GetNumResultsOnly=" + resultSpec.GetNumResultsOnly
        + "&_IncludeTotal=" + resultSpec.IncludeTotal
        + "&_MaxResults=" + resultSpec.MaxResults
        + "&_StartRow=" + resultSpec.StartRow
        + "&_SortColumns=" + URLEncoder.encode(resultSpec.SortColumns.map(\elt -> (elt.Ascending ? "A:" : "D:") + elt.SortPath).join(","), "UTF-8")

    if (criteria.getDocumentPublicID() != null) {
      urlStr += "&PublicID=" + URLEncoder.encode(criteria.DocumentPublicID, "UTF-8")
    }
    if (criteria.ABContact != null) {
      urlStr += "&ABContactDocumentLink.ABContact=" + URLEncoder.encode(criteria.ABContact.PublicID, "UTF-8")
    }
    if (criteria.NotABContact != null) {
      urlStr += "&ABContactDocumentLink.ABContact=!" + URLEncoder.encode(criteria.NotABContact.PublicID, "UTF-8")
    }

    if (criteria.Author != null) {
      urlStr += "&_Author=" + URLEncoder.encode(criteria.Author.toLowerCase(), "UTF-8")
    }
    if (criteria.Language != null) {
      urlStr += "&Language=" + URLEncoder.encode(criteria.Language.Code, "UTF-8")
    }
    if (criteria.Section != null) {
      urlStr += "&Section=" + URLEncoder.encode(criteria.Section.Code, "UTF-8")
    }
    if (criteria.Status != null) {
      urlStr += "&Status=" + URLEncoder.encode(criteria.Status.Code, "UTF-8")
    }
    if (criteria.Type != null) {
      urlStr += "&Type=" + URLEncoder.encode(criteria.Type.Code, "UTF-8")
    }
    if (criteria.Description != null) {
      urlStr += "&Description=" + URLEncoder.encode(criteria.Description, "UTF-8")
    }
    if (criteria.NameOrID != null) {
      urlStr += "&_NameOrID=" + URLEncoder.encode(criteria.NameOrID.toLowerCase(), "UTF-8")
    }
    if (criteria.IncludeObsoletes != null) {
      if (!(criteria.IncludeObsoletes)) {
        urlStr += "&Obsolete=false"
      }
    }
    if (criteria.DocumentSecurityTypes != null) {
      var newNull = true
      for (securityTypeSearchWrapper in criteria.DocumentSecurityTypes) {

        if (securityTypeSearchWrapper != null) {
          var codeIn = securityTypeSearchWrapper.DocumentSecurityType.Code
          if (codeIn != null) {
            urlStr += "&SecurityType=" + URLEncoder.encode(codeIn, "UTF-8")
          } else if (codeIn == null and newNull) {
            // If there is at least one null, we want to return all the ones that does not have DocumentSecurityType
            urlStr += "&SecurityType=" + URLEncoder.encode("nocode", "UTF-8")
            newNull = false
          }
        }
      }
    }
    ABLoggerCategory.DOCUMENT.debug("SBDMS-searchDocument url=" + urlStr)

    var docs: Documents
    readFromServlet(urlStr, \is -> {
      docs = Documents.parse(is)
    })
    ABLoggerCategory.DOCUMENT.debug("SBDMS-searchDocument docs\n" + docs.asUTFString())
    return docs;
  }

  override function searchDocuments( criteria : DocumentSearchCriteria, resultSpec : RemotableSearchResultSpec ) : DocumentSearchResult  {
    var rtn = new DocumentSearchResult(criteria.Bundle)
    var docs = searchDTODocuments(criteria, resultSpec)
    rtn.TotalResults = docs.Total
    for (xmlDoc in docs.Document) {
      var doc = DocumentsUtilBase.fetchAndUpdate(criteria.Bundle, xmlDoc.$TypeInstance, false, true)
      if (doc != null) {
        rtn.addToSummaries(doc)
        ABLoggerCategory.DOCUMENT.debug("SBDMS-searchDocument doc.PublicID=" + doc.PublicID + " doc.DocUID=" + doc.DocUID)
      }
    }
    return rtn
  }

  /**
   * Link the document to the entity.
   */
  override function linkDocumentToEntity(entity : KeyableBean, document : Document) {
    if (entity == null || entity.PublicID == null) {
      throw new RuntimeException("existing entity is required")
    }
    if (document == null || document.PublicID == null) {
      throw new RuntimeException("existing document is required")
    }
    ABLoggerCategory.DOCUMENT.debug("SBDMS-linkDocumentToEntity doc=" + document.ID + " [" + document.PublicID + "] entity: " + entity.IntrinsicType.RelativeName + "=" + entity.ID + " [" + entity.PublicID + "]")

    var joinTable : String
    var joinTableProperty : String
    var joinedPublicId : String
    if (entity typeis ABContact) {
      joinTable = ABContactDocumentLink.TYPE.get().getRelativeName()
      joinTableProperty = ABContactDocumentLink#ABContact.getPropertyInfo().getName()
      joinedPublicId = entity.PublicID
    }
    else if (entity typeis ABContactDocumentLink) {
      joinTable = ABContactDocumentLink.TYPE.get().getRelativeName()
      joinTableProperty = ABContactDocumentLink#ABContact.getPropertyInfo().getName()
      var joinedBean = ABContactDocumentLink#ABContact.getPropertyInfo().getAccessor().getValue(entity)
      joinedPublicId = (joinedBean as KeyableBean).PublicID
    }
    else {
      throw new RuntimeException("Only ABContact can be joined to Documents in this IDocumentMetadataSource plugin implementation, not " + entity.IntrinsicType.RelativeName)
    }
    var urlStr = UrlRoot + "addLinkProperty?" +
        "Document.PublicID=" + URLEncoder.encode(document.PublicID, "utf-8") + "&" +
        "JoinTable.Type=" + joinTable + "&" +
        "JoinTable.JoinedProperty=" + joinTableProperty + "&" +
        "Joined.PublicID=" + URLEncoder.encode(joinedPublicId, "utf-8")
    ABLoggerCategory.DOCUMENT.debug("SBDMS-linkDocumentToEntity url=" + urlStr)
    var content : byte[]
    readFromServlet(urlStr, \ is -> {content = StreamUtil.getContent(is)})
  }

  /**
   * Get documents linked to the given entity.
   * @param entity
   */
  override function getDocumentsLinkedToEntity(entity : KeyableBean) : DocumentSearchResult {
    var dsc = new DocumentSearchCriteria()
    var rsrs = new RemotableSearchResultSpec()
    if (entity == null || entity.PublicID == null) {
      throw new RuntimeException("Existing entity is required")
    }
    ABLoggerCategory.DOCUMENT.debug("SBDMS-getDocumentsLinkedToEntity entity: " + entity.IntrinsicType.RelativeName + "=" + entity.ID + " [" + entity.PublicID + "]")
    if (entity typeis ABContact) {
      dsc.ABContact = entity;
    }
    else if (entity typeis ABContactDocumentLink) {
      dsc.ABContact = ABContactDocumentLink#ABContact.getPropertyInfo().getAccessor().getValue(entity) as ABContact
    }
    else {
      throw new RuntimeException("Only ABContact can be joined to Documents in this IDocumentMetadataSource plugin implementation, not " + entity.IntrinsicType.RelativeName)
    }
    return searchDocuments(dsc, rsrs)
  }

  /**
   * Get documents linked to the given entity.
   * @param entity
   */
  override function getLinkedEntities(document : Document, type : IEntityType) : String[] {
    if (document == null) {
      throw new RuntimeException("document is required")
    }
    if (type == null) {
      throw new RuntimeException("type is required")
    }
    ABLoggerCategory.DOCUMENT.debug("SBDMS-getLinkedEntities doc=" + document.ID + " [" + document.PublicID + "] entity: " + type.RelativeName)
    if (document.PublicID == null) {
      return new String[0];
    }
    var joinTable : String
    var joinTableProperty : String
    if (type.equals(ABContact)) {
      joinTable = ABContactDocumentLink.TYPE.get().getRelativeName()
      joinTableProperty = ABContactDocumentLink#ABContact.getPropertyInfo().getName()
    }
    else if (type.equals(ABContactDocumentLink)) {
      joinTable = ABContactDocumentLink.TYPE.get().getRelativeName()
      joinTableProperty = ABContactDocumentLink#ABContact.getPropertyInfo().getName()
    }
    else {
      throw new RuntimeException("Only ABContact can be joined to Documents in this IDocumentMetadataSource plugin implementation, not " + type.RelativeName)
    }
    var urlStr = UrlRoot + "findLinkProperty?" +
        "Document.PublicID=" + URLEncoder.encode(document.PublicID, "utf-8") + "&" +
        "JoinTable.Type=" + joinTable + "&" +
        "JoinTable.JoinedProperty=" + joinTableProperty
    ABLoggerCategory.DOCUMENT.debug("SBDMS-findLinkedEntity url=" + urlStr)
    var content : byte[]
    readFromServlet(urlStr, \ is -> {content = StreamUtil.getContent(is)})
    var rtn = StreamUtil.toString(content).split("\n")
    return rtn
  }

  /**
   * @return true if the document is linked to the entity, false otherwise.
   */
  override function isDocumentLinkedToEntity(entity : KeyableBean, document : Document) : boolean {
    if (entity == null || entity.PublicID == null) {
      throw new RuntimeException("Existing entity is required")
    }
    if (document == null) {
      throw new RuntimeException("Existing document is required")
    }
    ABLoggerCategory.DOCUMENT.debug("SBDMS-isDocumentLinkedToEntity doc=" + document.ID + " [" + document.PublicID + "] entity: " + entity.IntrinsicType.RelativeName + "=" + entity.ID + " [" + entity.PublicID + "]")
    if (document.PublicID == null) {
      return false
    }
    var joinTable : String
    var joinTableProperty : String
    var joinedPublicId : String
    if (entity typeis ABContact) {
      joinTable = ABContactDocumentLink.TYPE.get().getRelativeName()
      joinTableProperty = ABContactDocumentLink#ABContact.getPropertyInfo().getName()
      joinedPublicId = entity.PublicID
    }
    else if (entity typeis ABContactDocumentLink) {
      joinTable = ABContactDocumentLink.TYPE.get().getRelativeName()
      joinTableProperty = ABContactDocumentLink#ABContact.getPropertyInfo().getName()
      var joinedBean = ABContactDocumentLink#ABContact.getPropertyInfo().getAccessor().getValue(entity)
      joinedPublicId = (joinedBean as KeyableBean).PublicID
    }
    else {
      throw new RuntimeException("Only ABContact can be joined to Documents in this IDocumentMetadataSource plugin implementation, not " + entity.IntrinsicType.RelativeName)
    }
    var urlStr = UrlRoot + "isLinkProperty?" +
        "Document.PublicID=" + URLEncoder.encode(document.PublicID, "utf-8") + "&" +
        "JoinTable.Type=" + joinTable + "&" +
        "JoinTable.JoinedProperty=" + joinTableProperty + "&" +
        "Joined.PublicID=" + URLEncoder.encode(joinedPublicId, "utf-8")
    ABLoggerCategory.DOCUMENT.debug("SBDMS-isDocumentLinkedToEntity url=" + urlStr)
    var content : byte[]
    readFromServlet(urlStr, \ is -> {content = StreamUtil.getContent(is)})
    return "true" == new String(StreamUtil.toString(content))
  }

  /**
   * Unlink the document from the entity
   */
  override function unlinkDocumentFromEntity(entity : KeyableBean, document : Document) {
    if (entity == null || entity.PublicID == null) {
      throw new RuntimeException("Existing entity is required")
    }
    if (document == null) {
      throw new RuntimeException("Existing document is required")
    }
    ABLoggerCategory.DOCUMENT.debug("SBDMS-unlinkDocumentFromEntity doc=" + document.ID + " [" + document.PublicID + "] entity: " + entity.IntrinsicType.RelativeName + "=" + entity.ID + " [" + entity.PublicID + "]")
    var joinTable : String
    var joinTableProperty : String
    var joinedPublicId : String
    if (entity typeis ABContact) {
      joinTable = ABContactDocumentLink.TYPE.get().getRelativeName()
      joinTableProperty = ABContactDocumentLink#ABContact.getPropertyInfo().getName()
      joinedPublicId = entity.PublicID
    }
    else if (entity typeis ABContactDocumentLink) {
      joinTable = ABContactDocumentLink.TYPE.get().getRelativeName()
      joinTableProperty = ABContactDocumentLink#ABContact.getPropertyInfo().getName()
      var joinedBean = ABContactDocumentLink#ABContact.getPropertyInfo().getAccessor().getValue(entity)
      joinedPublicId = (joinedBean as KeyableBean).PublicID
    }
    else {
      throw new RuntimeException("Only ABContact can be joined to Documents in this IDocumentMetadataSource plugin implementation, not " + entity.IntrinsicType.RelativeName)
    }
    var urlStr = UrlRoot + "removeLinkProperty?" +
        "Document.PublicID=" + URLEncoder.encode(document.PublicID, "utf-8") + "&" +
        "JoinTable.Type=" + joinTable + "&" +
        "JoinTable.JoinedProperty=" + joinTableProperty + "&" +
        "Joined.PublicID=" + URLEncoder.encode(joinedPublicId, "utf-8")
    ABLoggerCategory.DOCUMENT.debug("SBDMS-removeDocumentLinkedToEntity url=" + urlStr)
    var content : byte[]
    readFromServlet(urlStr, \ is -> {content = StreamUtil.getContent(is)})
  }
}
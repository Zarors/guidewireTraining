package gw.plugin.document.impl

uses gw.ab.document.DocumentsUtil
uses gw.api.system.ABLoggerCategory
uses gw.document.DocumentContentsInfo
uses gw.plugin.document.IDocumentContentSource
uses gw.plugin.document.IDocumentMetadataSource

uses java.io.ByteArrayInputStream
uses java.io.InputStream
uses java.lang.RuntimeException
uses java.lang.Throwable
uses java.net.HttpURLConnection
uses java.net.URL
uses java.net.URLEncoder
uses java.util.Date
uses java.lang.IllegalStateException
uses java.util.Map

/**
 *
 * IMPORTANT: This implementation is for Demo purpose only. Please do not modify it. Use it as an example for your
 * IDocumentContentSource implementation for the Synchronous case and define it in the SynchedContentSource for your
 * IDocumentContentSource.gwp.
 *
 * IDocumentContentSource implementation for synchronous document management using DMSServlet.
 *
 * Document entity is not persisted when the IDocumentMetadataSource plugin is enabled. The implementation
 * of this plugin assumes that the document validation for MimeType (#updateDocument) is done at the UI level.
 * Consulting the IDocumentMetadataSource plugin is expensive so better to do it in the UI and it also give
 * more flexibility in configuration.
 */
@Export
class ServletBackedDocumentContentSource extends ServletBackedDocumentBaseSource implements IDocumentContentSource {

  var _metadataSource : Boolean
  public property get MetadataSource() : boolean {
    if (_metadataSource == null) {
      _metadataSource = gw.plugin.Plugins.isEnabled(IDocumentMetadataSource)
    }
    return _metadataSource
  }

  override property set Parameters(parameters: Map<Object, Object>) {
    parameters.put("gw.document.DMSServlet.props","ABContactDocumentLink.ABContact")
    super.Parameters = parameters
  }

  override function addDocument(content: InputStream, document: Document): boolean {

    // For the Asynchronous case, we want to preserve the DateModified from the moment the document
    // is uploaded to the application. See AsyncDocumentContentSource#createTemporaryStore
    if (document.DateModified == null) {
      document.DateModified = Date.CurrentDate
    }

    var xml = document.asXml(false)
    var publicId = writeToServlet(UrlRoot + "metadata", new ByteArrayInputStream(xml.asUTFString().getBytes("utf-8")))
    ABLoggerCategory.DOCUMENT.debug("SBDCS-addDocument to the DMS with PublicId=" + publicId)


    try {
      document.PublicID = publicId
      var docUID = "content/" + URLEncoder.encode(publicId, "utf-8") + "/" + URLEncoder.encode(xml.Name, "utf-8")
      document.DocUID = docUID
      writeToServlet(UrlRoot + docUID, content)
    } catch (e : Throwable) {
      ABLoggerCategory.DOCUMENT.error("SBDCS-addDocument aborted on PublicId=" + publicId, e);
      cleanDMS(document)
      throw e
    }

    return _metadataSource
  }

  override function isDocument(document: Document): boolean {
    return document.DocUID != null and not document.Retired and document.isDMS() != null and document.DMS
  }

  private function refreshDocUID( document : Document ) {
    if (!MetadataSource) { // if metadata source always upto date
      var encodedPublicID = URLEncoder.encode(document.PublicID, "utf-8")
      var docUID = "content/" + encodedPublicID + "/" + URLEncoder.encode(document.Name, "utf-8")
      if (docUID != document.DocUID) {
        ABLoggerCategory.DOCUMENT.debug("SBDCS-refreshDocUID docUID has changed doc.PublicID " + document.PublicID + " was " + document.DocUID + " should be " + docUID)
      }
    }
  }

  override function getDocumentContentsInfo(document: Document, includeContents: boolean): DocumentContentsInfo {

    ABLoggerCategory.DOCUMENT.debug("SBDCS-getDocumentContentsInfo doc.DocUID=" + document.DocUID)

    if (document.DMS == null) {
      ABLoggerCategory.DOCUMENT.debug("SBDCS-getDocumentContentsInfo new document has not declared DMS or contentless doc.PublicID " + document.PublicID)
      return null
    }
    if (document.DocUID == DocumentsUtil.NO_FILE_CONTENT_UID || document.DMS == false) {
      ABLoggerCategory.DOCUMENT.debug("SBDCS-getDocumentContentsInfo contentless doc.PublicID " + document.PublicID)
      return null
    }
    refreshDocUID(document)
    if (document.DocUID == null) {
      ABLoggerCategory.DOCUMENT.debug("SBDCS-getDocumentContentsInfo docUID undefined doc.PublicID " + document.PublicID)
      return null
    }

    return new DocumentContentsInfo(DocumentContentsInfo.ContentResponseType.URL, UrlRoot + document.DocUID,
        document.MimeType == null ? "application/octet-stream" : document.MimeType)
  }

  override function getDocumentContentsInfoForExternalUse(document: Document): DocumentContentsInfo {
    ABLoggerCategory.DOCUMENT.debug("SBDCS-getDocumentContentsInfoForExternalUse doc.PublicID=" + document.PublicID)
    if (document.DMS == null) {
      ABLoggerCategory.DOCUMENT.debug("SBDCS-getDocumentContentsInfo new document has not declared DMS or contentless doc.PublicID " + document.PublicID)
      return null
    }
    if (document.DocUID == DocumentsUtil.NO_FILE_CONTENT_UID || document.DMS == false) {
      ABLoggerCategory.DOCUMENT.error("SBDCS-getDocumentContentsInfoForExternalUse doc.DocUID is null for doc.PublicID " + document.PublicID)
      return null
    }
    refreshDocUID(document)
    return new DocumentContentsInfo(DocumentContentsInfo.ContentResponseType.URL, UrlRoot + document.DocUID, document.MimeType)
  }

  override function updateDocument(document: Document, content: InputStream): boolean {
    ABLoggerCategory.DOCUMENT.debug("SBDCS-updateDocument doc.DocUID=" + document.DocUID)
    if (document.Status == DocumentStatusType.TC_FINAL) {
      throw new IllegalStateException("SBDCS-updateDocument: you do not have the permission to update ${document.Status} documents.")
    }

    document.DateModified = Date.CurrentDate
    var encodedPublicId = URLEncoder.encode(document.PublicID, "utf-8")
    var xml = document.asXml(false)

    try {
      writeToServlet(UrlRoot + "metadata/" + encodedPublicId + "?update", new ByteArrayInputStream(xml.asUTFString().getBytes("utf-8")))
      document.DocUID = "content/" + encodedPublicId + "/" + URLEncoder.encode(xml.Name, "utf-8")
      writeToServlet(UrlRoot + document.DocUID, content)
    } catch (e: Throwable) {
      ABLoggerCategory.DOCUMENT.error("SBDCS-updateDocument aborted on PublicId=" + document.PublicID, e);
      throw e
    }

    return _metadataSource
  }

  override function removeDocument(document: Document): boolean {
    /**
     * Removing the document from the DMS is not implemented in this demo plugin. There could be other resources
     * referencing to the document. It is up to each IDocumentContentSource plugin implementation (Asynchronous and
     * Synchronous) to decide how to handle the removal of the documents from the DMS.
     *
     * This method is called when calling document.remove() which in ContactManager is called when disassociating a
     * document from an ABContact and no other ABContacts are associated with the document
     */

    if (document.Status == DocumentStatusType.TC_FINAL) {
      throw new IllegalStateException("SBDCS-removeDocument: you do not have the permission to remove ${document.Status} documents.")
    }

    if (MetadataSource) {
      return true
    }

    return false
  }

  /**
   * Clean the document from the DMS when there is a failure to add the document from addDocument
   * @param document
   */
  private function cleanDMS(document: Document) {
    ABLoggerCategory.DOCUMENT.debug("SBDCS-removeDocument doc.DocUID=" + document.DocUID)
    var encodedPublicId = URLEncoder.encode(document.PublicID, "utf-8")
    var urlString = UrlRoot + "metadata/" + encodedPublicId
    var url = new URL(urlString);
    var responseCode = 0
    var conn : HttpURLConnection
    try {
      conn = url.openConnection() as HttpURLConnection
      insertBasicAuthentication(conn)
      conn.RequestMethod = "DELETE"
      responseCode = extractResponseCode(conn)
    }
    finally {
      if (conn != null) {
        conn.disconnect()
      }
    }
    if (responseCode != 200) {
      var msg = "SBDCS-Delete " + urlString + " failed: " + responseCode
      ABLoggerCategory.DOCUMENT.warn(msg)
      throw new RuntimeException(msg)
    }
  }
}

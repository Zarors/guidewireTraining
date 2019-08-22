package gw.entity

uses com.guidewire.pl.web.controller.UserDisplayableException
uses gw.ab.document.DocumentsUtil
uses gw.api.locale.DisplayKey
uses gw.api.system.ABLoggerCategory
uses gw.api.util.DisplayableException
uses gw.api.web.WebFile
uses gw.document.ContentDisposition
uses gw.document.DocumentsUtilBase
uses gw.plugin.Plugins
uses gw.plugin.document.IDocumentContentSource
uses gw.util.Pair

uses java.util.Set

/**
 * Document Management UI helpers on Documents
 */

@Export
enhancement GWDocumentsEnhancement: entity.Document {

  static property get JoinTableLinks() : List<Pair<ILinkPropertyInfo, Set<String>>> {
    return { Pair.make(ABContactDocumentLink#Document.PropertyInfo as ILinkPropertyInfo, null as Set<String>) }
  }

  function asXml(doLinks : boolean) : gw.document.documentdto.Document {
    var xml = new gw.document.documentdto.Document()
    this.addToXml(xml.$TypeInstance, doLinks, JoinTableLinks)
    return xml
  }

  function removeJoinTableEntries() {
    for (entry in JoinTableLinks) {
      DocumentsUtilBase.markAsNonPersistingReferencedFromBeans(this, entry.First)
    }
  }

  /**
   * Determines the equality between two documents. Two documents are
   * the same if their PublicIDs are the same. This is true for all
   * supported configurations for IDocumentContentSource and
   * IDocumentMetadataSource plugins.
   *
   * @param document to compare to this
   * @return whether document is the same as this
   */
  public function isSameAs(document : Document) : boolean {
    return this.PublicID == document.PublicID
  }

  /**
   * Validates that the new file MimeType correspond to the original Document MimeType
   * @param webFile with content changes
   */
  public function isCompatibleMimeType (webFile : WebFile) {
    if (webFile.MIMEType != null and this.getMimeType() != webFile.MIMEType ) {
      throw new DisplayableException(DisplayKey.get("Web.ContactDetail.Documents.UpdateDocument.UpdateContent.IncorrectMimeType", getMimeTypeLabel(webFile.getMIMEType()), getMimeTypeLabel(this.getMimeType())))
    }
  }

  /**
   * Checks whether this document has content in the DMS to be displayed
   * @return if the document has content
   */
  property get ContentExist() : boolean {
    var _dmsPlugin = Plugins.get("IDocumentContentSource") as IDocumentContentSource
    return _dmsPlugin.isDocument(this)
  }

  /**
   * List of mimetypes configured in the mimetypemapping in config.xml. If the current
   * Document's MimeType is not mapped, the MimeType is added to the list and a message
   * is logged.
   * @return list of mimetypemapping's mimetypes
   */
  property get MimeTypeList() : java.util.List {
    var documentMimeType = this.getMimeType()
    var originalList = gw.document.DocumentsUtilBase.getMimeTypes().copy()

    if (documentMimeType != null) {
      var mimeTypeInList = gw.document.DocumentsUtilBase.getMimeTypes().hasMatch(\ configuredType -> configuredType == documentMimeType )

      if (!mimeTypeInList) {
        ABLoggerCategory.DOCUMENT.info("The uploaded document has a Mime Type '" + documentMimeType + "' that is not configured in the application. Please add the Mime Type to the mimetypemapping in the config.xml")
        originalList.add(documentMimeType)
      }
    }

    return originalList

  }

  /**
   * Return the description of the MimeType of the selected document. This is based on the
   * mimetypemapping's mimetype in the config.xml. If there is not a match, the MimeType is
   * returned instead.
   * @param documentMimeType Document's MimeType
   * @return the Document's MimeType description, if any. Document's MimeType otherwise.
   */
  static function getMimeTypeLabel(documentMimeType: String) : String {
    var configuredMimeTypeLabel = gw.document.DocumentsUtilBase.getMimeTypeDescription(documentMimeType)

    if (configuredMimeTypeLabel == null) {
      configuredMimeTypeLabel = documentMimeType
    }

    return configuredMimeTypeLabel
  }

  /**
   * Validates whether the Document's MimeType is registered in the config.xml under the mimetypemapping
   * @return whether the Document's MimeType is allowed for viewing
   */
  property get DocumentMimeTypeAllowed() : boolean {

    var documentMimeType = this.getMimeType()
    if (documentMimeType != null) {
      var mimeTypeInList = gw.document.DocumentsUtilBase.getMimeTypes().hasMatch(\ configuredType -> configuredType == documentMimeType )

      if (!mimeTypeInList) {
        return false
      }
      return true
    }
    return false
  }

}

package gw.document;

uses gw.ab.document.DocumentsUtil
uses gw.api.locale.DisplayKey
uses gw.api.system.PLLoggerCategory
uses gw.api.util.DisplayableException
uses gw.plugin.document.IDocumentTemplateDescriptor

@Export
public class DocumentCMContext extends BaseDocumentApplicationContext {
  private var _contact : ABContact

  private var _documents = new ArrayList<Document>()

  construct(contact : ABContact) {
    _contact = contact
  }

  override function createDocumentCreationInfo(): DocumentCreationInfo {
    return createDocumentCreationInfo(null)
  }

  override function createDocumentDetailsHelper(documents : Document[]): DocumentDetailsApplicationHelper {
    return new DocumentPropertiesCMHelper(documents);
  }

  override function createDocumentCreationInfo(documentTemplateDescriptor: IDocumentTemplateDescriptor): DocumentCreationInfo {
    var dci = DocumentsUtil.createDocumentCreationInfo(_contact)
    initializeDocumentProperties(dci.Document)

    // Track each document created for final linking to the contact on the worksheet commit
    _documents.add(dci.Document)
    return dci
  }

  override function generateDocument(documentCreationInfo: DocumentCreationInfo) {
    throw new UnsupportedOperationException("Document creation from template not supported in CM")
  }

  /**
   * Initialize a new content-less document which refers to a document which
   * does not have content stored in the DMS. This corresponds to the
   * "Indicate Existence of a Document"
   *
   * @return The newly created DocumentCreationInfo object.
   */
  function initDocumentExistence() : Document {
    var document = DocumentsUtil.initDocumentExistence(_contact)
    initializeDocumentProperties(document)

    // Track document existence for final linking to the contact on the worksheet commit
    _documents.add(document)
    return document
  }

  /**
   * Removes the document from this Context's list of documents to be added
   * @param document the document to remove
   */
  function removeDocument(document : Document) {
    _documents.remove(document)
    document.remove()
  }

  /**
   * Used to link all the created documents to the contact after they have been committed.
   * It is necessary to wait in case an IDMS is in use -- which requires that documents
   * exist in the DMS before being linked/joined to an entity.
   */
  public function linkDocumentsToContact() {
    try {
      _contact.addToDocuments(_documents.toTypedArray())
      _contact.Bundle.commit()
    } catch (t : Throwable) {
      var sb = new StringBuilder()
      sb.append(DisplayKey.get("Web.DocumentProperties.Error.Header", _contact.ID, _contact.PublicID))
      for (document in _documents) {
        if (document != null && document.getPublicID() != null) {
          sb.append(DisplayKey.get("Web.DocumentProperties.Error.Entry", document.ID, document.PublicID, document.Name))
        }
      }
      PLLoggerCategory.DOCUMENT.error(sb.toString(), t);
      throw new DisplayableException(sb.toString(), t);
    }
  }

  private function initializeDocumentProperties(document : Document) {
    document.Status = DocumentStatusType.TC_DRAFT
    document.Type = DocumentType.TC_OTHER
  }
}

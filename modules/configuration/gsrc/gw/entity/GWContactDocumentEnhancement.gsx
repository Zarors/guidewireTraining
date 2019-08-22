package gw.entity

uses gw.api.util.DisplayableException
uses gw.api.locale.DisplayKey
uses gw.transaction.Transaction

/**
 * Document Management creation helpers from the UI
 */
@Export
enhancement GWContactDocumentEnhancement: entity.ABContact {

  /**
   * Unlink the given document from the ABContact.
   * It also removes the document content and the document metadata
   * when there is not any other contacts associated to this document.
   * @param document to unlink from the contact
   */
  function unlinkDocumentForUI(document: Document) {
    // Add copies of the contact and document to a new bundle for removal.
    // This allows document removal from contacts to proceed independently
    // of whether the Contact is in edit mode or not, just like document existence/attachment.
    Transaction.runWithNewBundle(\bundle -> {
      bundle.add(this).removeFromDocuments(bundle.add(document))
    })
  }

  /**
   * Unlink the given documents from the ABContact.
   * It also removes the document content and the document metadata
   * when there is not any other contacts associated to this document.
   * @param documents to unlink from this contact
   */
  function unlinkDocumentsForUI(documents: Document[]) {
    // Cancels the removal of all documents if there is one document that cannot be removed.
    var insufficientPermissionDoc = documents.firstWhere( \ d -> !perm.Document.delete(d))
    if (insufficientPermissionDoc != null) {
      throw new DisplayableException(DisplayKey.get("Web.ContactDetail.Documents.RemoveDocument.InsufficientPermission", insufficientPermissionDoc.Name))
    }
    documents.each( \ doc -> unlinkDocumentForUI(doc))
  }
}

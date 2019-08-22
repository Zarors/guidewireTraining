package gw.web.merge

uses gw.api.system.ABLoggerCategory

uses java.util.HashMap

/**
 * This class is used as a helper by the ReviewDuplicateContactsPopup screen for the Documents tab.
 * It holds the list of documents across the Retiring and Kept Contacts and implements the merge of
 * the documents when the merge occurs.
 */

@Export
public class MergeContactsDocumentsHolder {
  private static var _logger = ABLoggerCategory.AB

  private var _duplicateContactPairWrapper: DuplicatePairWrapper
  private var _mergedContact : ABContact
  private var _mergedDocuments : Document[]
  private var _documentRowList : List<DocumentCardRowValue>

  class DocumentCardRowValue {
    var _onKept: Boolean as readonly OnKept
    var _onRetired: Boolean as readonly OnRetired
    var _document: Document as readonly Document
    var _included: Boolean as Included

    construct(onKept: boolean, onRetired: boolean, document: Document) {
      _onKept = onKept
      _onRetired = onRetired
      _included = true
      _document = document
    }

    property get DocumentInfo(): String {
      return _document.getName() +  "\n" + _document.getType().DisplayName + "\n"
          + _document.getStatus().DisplayName + "\n" + _document.getAuthor()
          + _document.getDateModified()
    }
  }

  construct(duplicateContactPairWrapper: DuplicatePairWrapper, mergedContact: ABContact) {
    _duplicateContactPairWrapper = duplicateContactPairWrapper
    _mergedContact = mergedContact
    _mergedDocuments = _mergedContact.getDocuments()
  }

  property get DocumentsRowList(): List<DocumentCardRowValue> {
    if (_documentRowList == null) {
      // Go over the documents on both contacts, checking for equality by document PublicID
      var keptDocuments = MergeContactsWebUtil.Instance.getKeptDocuments(_duplicateContactPairWrapper.Pair)
      var retiredDocuments = MergeContactsWebUtil.Instance.getRetiredDocuments(_duplicateContactPairWrapper.Pair)

      var documentRowValueMap = new HashMap<String, DocumentCardRowValue>()

      for (document in keptDocuments) {
        var dCR = new DocumentCardRowValue(true, false, document)
        documentRowValueMap.put(document.PublicID, dCR)
      }
      for (document in retiredDocuments) {
        var dCR = documentRowValueMap.get(document.PublicID)
        if (dCR == null) {
          dCR = new DocumentCardRowValue(false, true, document)
          documentRowValueMap.put(document.PublicID, dCR)
        } else {
          dCR._onRetired = true
        }
      }
      _documentRowList = documentRowValueMap.values().toList()
    }
    return _documentRowList
  }

  function mergeDocuments() {
    for (dcr in _documentRowList) {
      if (dcr.Included) {
        var mergedDoc = _mergedDocuments.firstWhere(\elt -> elt.PublicID == dcr.Document.PublicID)
        if (mergedDoc == null) {
          _mergedContact.addToDocuments(dcr.Document)
        }
      } else {
        var mergedDoc = _mergedDocuments.firstWhere(\elt -> elt.PublicID == dcr.Document.PublicID)
        if (mergedDoc != null) {
          _mergedContact.removeFromDocuments(mergedDoc)
        }
      }
    }
  }
}

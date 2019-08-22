package gw.web

uses gw.api.admin.MessagingUtil
uses gw.api.locale.DisplayKey
uses gw.api.system.ABLoggerCategory
uses gw.api.system.PLConfigParameters
uses gw.plugin.document.IDocumentContentSource
uses gw.plugin.document.IDocumentMetadataSourceBase

uses java.lang.Deprecated
uses java.lang.Exception

/**
 * UI helper functions for the Documents UI in ABContactDetailScreen and DocumentPropertiesPopup
 */
@Export
class ContactDocumentsActionsHelper {

  private var _contact : ABContact

  construct(c : ABContact) {
    _contact = c
  }

  /**
   * Determines the asynchronous message to display in the documents actions while the
   * document is been stored in the DMS.
   * @return Asynchronous message for document actions
   */
  property get AsynchronousActionsMessage() : String {
    return DocumentStoreSuspended ?
        DisplayKey.get("Web.ContactDetail.DocumentsLV.Actions.Pending") :
        DisplayKey.get("Web.ContactDetail.DocumentsLV.Actions.Pending.Refresh")
  }

  /**
   * Tells whether the documents tab should show for this contact.
   * It checks the vendor tag in the contact as well as the page mode.
   * @return whether the documents tab should show for this contact
   */
  property get ShowDocumentsTabForContact() : boolean {

    return (ContentSourceEnabled) and
        perm.System.docview and
        !_contact.isNew() and
        ( _contact.isVendor() or
            ( _contact.ChangedFields.HasElements and
                _contact.isArrayElementAddedOrRemoved(ABContact#Tags) and
                _contact.getOriginalValue(ABContact#Tags).hasMatch(\ contactTag -> contactTag.Type == ContactTagType.TC_VENDOR))
        )
  }

  /**
   * Tells whether to show the warning that the contact will lose the visibility of the Documents
   * @param editable whether the page is in edit mode or not
   * @return whether the loss documents warning should show for this contact
   */
  function isShowLossOfDocumentsWarning(editable: boolean) : boolean {

    return
        _contact.ChangedFields.HasElements and
            _contact.isArrayElementAddedOrRemoved(ABContact#Tags) and
            editable and
            _contact.Documents.Count > 0 and
            not _contact.isVendor()
  }

  /********************* Plugins Helpers *********************************************/
  /**
   *  IDocumentContentSource and IDocumentMetadataSource plugin helpers.
   */
  /***********************************************************************************/

  /**
   * Determines if the IDocumentContentSource plugin is enabled and available to communicate with the DMS
   * @return whether the DMS is available to do actions with the documents
   */
  property get DocumentContentServerAvailable() : boolean {
    try {
      return ContentSourceEnabled and gw.plugin.Plugins.get(IDocumentContentSource).isOutboundAvailable()
    } catch (e: Exception) {
      ABLoggerCategory.DOCUMENT.debug("DMSServer is unavailable to handle document content: " + e.getCause())
      return false
    }
  }

  /**
   * Determines if the IDocumentMetadataSource plugin is enabled and available to communicate with the DMS
   * @return whether the DMS is available to do access document metadata
   */
  property get DocumentMetadataServerAvailable() : boolean {
    try {
      return MetadataSourceEnabled and
          (gw.plugin.Plugins.get("IDocumentMetadataSource") as IDocumentMetadataSourceBase).isOutboundAvailable()
    } catch (e: Exception) {
      ABLoggerCategory.DOCUMENT.debug("DMSServer is unavailable to handle document content: " + e.getCause())
      return false
    }
  }

  /**
   * Checks if the IDocumentContentSource plugin is configured enabled.
   * @return whether the IDCS plugin is enabled
   */
  property get ContentSourceEnabled () : boolean {
    return gw.plugin.Plugins.isEnabled(gw.plugin.document.IDocumentContentSource)
  }

  /**
   * Checks if the IDocumentMetadataSource plugin is configured enabled.
   * @return whether the IDMS plugin is enabled
   */
  property get MetadataSourceEnabled () : boolean {
    return gw.plugin.Plugins.isEnabled(gw.plugin.document.IDocumentMetadataSource)
  }

  /**
   * Gets the status of the DocumentStore transport for the Asynchronous configuration
   * of the IDocumentContentSource plugin.
   *
   * @return the MessageDestinationStatus for DocumentStore
   */
  property get DocumentStoreSuspended () : boolean {
    var documentStoreDestination = MessagingUtil.getDestinationInfo().where(\destInfo -> destInfo.DestId == 324)
    if (documentStoreDestination != null) {
      if (documentStoreDestination.Count > 1) {
        ABLoggerCategory.DOCUMENT.warn("You have defined more than one configuration for the destination 324 in your messaging-config.xml. Please" +
            "take a look and make sure you only have one definition")
      }
      return {
          MessageDestinationStatus.TC_SHUTDOWN,
          MessageDestinationStatus.TC_SUSPENDED,
          MessageDestinationStatus.TC_SUSPENDING,
          MessageDestinationStatus.TC_SUSPENDEDINBOUND,
          MessageDestinationStatus.TC_SUSPENDEDOUTBOUND
      }.contains(documentStoreDestination.first().Status)
    } else {
      // If the DocumentStore destination is disabled, there is not a DestinationInfo for it in the MessagingUtil
      return false
    }
  }

  /**
   * Checks whether the actions in the Documents ListView are not visible because document is 'in flight'
   * @param document
   * @return whether the document is 'in flight'
   */
  function isDocumentPending(document: Document) : boolean {
    return document.PendingDocUID != null and document.DMS
  }

  /********************* Available Helpers *********************************************/
  /**
   *  Document actions' availability helpers.
   */
  /***********************************************************************************/

  /**
   * Tells whether to show Documents actions based on whether the page
   * is editable or not and if the DMS is available
   * @return true if the page is not editable, false otherwise
   */
  function isDocumentContentActionsAvailable() : boolean {
    return DocumentContentServerAvailable
  }

  /**
   * Tells whether to enable document actions related to the metadata of the
   * document that are independent on the content.
   * @return true if the page is not editable and document metadata is available, false otherwise
   */
  function isDocumentMetadataActionsAvailable() : boolean {
    if (MetadataSourceEnabled) {
      return DocumentMetadataServerAvailable
    }
    return ContentSourceEnabled
  }

  function isViewDocumentContentAvailable(document: Document, contentActionsAvailable : boolean) : boolean {
    return perm.Document.view(document) and contentActionsAvailable and
        document.ContentExist and document.DMS and
        document.PendingDocUID == null and document.DocumentMimeTypeAllowed
  }

  function isUploadDocumentContentAvailable(document: Document, metadataActionsEnabled : boolean, contentActionsAvailable : boolean) : boolean {
    return perm.Document.edit(document) and contentActionsAvailable and
        metadataActionsEnabled and
        document.ContentExist and document.PendingDocUID == null and
        DocumentStatusType.TC_FINAL != document.Status
  }

  function isDownloadDocumentContentAvailable(document: Document, contentActionsAvailable : boolean) : boolean {
    return contentActionsAvailable and document.ContentExist and perm.Document.view(document)
  }

  function isRemoveDocumentLinkAvailable(document: Document, metadataActionsEnabled : boolean) : boolean {
    return perm.Document.delete(document) and metadataActionsEnabled
  }

  function isDownloadDocumentContentAvailableInDocumentProperties(document: Document, contentActionsAvailable : boolean) : boolean {
    return contentActionsAvailable and document.ContentExist and document.PendingDocUID == null
  }

  function isRemoveDocumentLinkAvailableInDocumentProperties(document: Document, metadataActionsEnabled : boolean) : boolean {
    return perm.Document.delete(document) and metadataActionsEnabled and document.PendingDocUID == null
  }

  /********************* Visible Helpers *********************************************/
  /**
   *  Document actions' visibility helpers.
   */
  /***********************************************************************************/

  private function documentStoredInDMS(document : Document) : boolean {
    return ContentSourceEnabled and document.PendingDocUID == null and document.DMS
  }

  function isUploadDocumentContentVisible(document: Document) : boolean {
    return perm.Document.edit(document) and PLConfigParameters.DisplayDocumentEditUploadButtons.Value and documentStoredInDMS(document)
  }

  function isDownloadDocumentContentVisible(document: Document) : boolean {
    return documentStoredInDMS(document)
  }

  function isRemoveDocumentLinkVisible(document: Document) : boolean {
    return perm.Document.delete(document) and document.Status != DocumentStatusType.TC_FINAL and
        document.PendingDocUID == null
  }

  @Deprecated
  function isIconSpacerVisible(editable: boolean, document: Document) : boolean {
    return isDownloadDocumentContentVisibleInDocumentProperties(editable, document)
  }

  @Deprecated
  function isLastIconSpacerVisible(editable: boolean, document: Document) : boolean {
    return isIconSpacerVisible(editable, document) and
        typekey.DocumentStatusType.TC_FINAL != document.Status and
        document.DMS and perm.Document.edit(document)
  }

  function isUploadDocumentContentVisibleInDocumentProperties(editable: boolean, document: Document) : boolean {
    return not editable and ContentSourceEnabled and perm.Document.edit(document) and
        document.DMS and PLConfigParameters.DisplayDocumentEditUploadButtons.Value
  }

  function isDownloadDocumentContentVisibleInDocumentProperties(editable: boolean, document: Document) : boolean {
    return not editable and ContentSourceEnabled and perm.Document.view(document) and document.DMS
  }

  function isRemoveDocumentLinkVisibleInDocumentProperties(editable: boolean, document: Document) : boolean {
    return not editable and perm.Document.delete(document) and document.Status != DocumentStatusType.TC_FINAL
  }

  function isShowAsynchronousRefreshAction(documents : Document[]) : boolean {
    return documents.hasMatch( \ d -> isDocumentPending(d)) and not DocumentStoreSuspended
  }

  /********************* Tooltip Helpers *********************************************/
  /**
   *  Document actions' tooltips helpers. There are different tooltips based on the
   *  availability and visibility.
   */
  /***********************************************************************************/

  function ViewDocumentContentTooltip(document: Document) : String {

    if (!document.DMS) {
      return DisplayKey.get("Web.ContactDetail.DocumentsLV.Actions.ViewContent.IndicateExistence.Tooltip")
    } else if (!document.DocumentMimeTypeAllowed) {
      return DisplayKey.get("Web.ContactDetail.DocumentsLV.Actions.ViewContent.MissingMimetype.Tooltip")
    } else if (!perm.Document.view(document)) {
      return DisplayKey.get("Web.ContactDetail.DocumentsLV.Actions.ViewContent.MissingViewPermission.Tooltip")
    }

    return DisplayKey.get("Web.ContactDetail.DocumentsLV.Actions.ViewContent.Tooltip")
  }

  function UploadDocumentContentTooltip (document : Document) : String{

    if (DocumentStatusType.TC_FINAL == document.Status) {
      return DisplayKey.get("Web.ContactDetail.DocumentsLV.Actions.Upload.FinalDocument.Tooltip")
    } else if (!perm.Document.edit(document)) {
      return DisplayKey.get("Web.ContactDetail.DocumentsLV.Actions.Upload.MissingEditPermission.Tooltip")
    }

    return DisplayKey.get("Web.ContactDetail.DocumentsLV.Actions.Upload.Tooltip")
  }

  function DownloadDocumentContentTooltip (document : Document) : String {
    if (!perm.Document.view(document)) {
      return DisplayKey.get("Web.ContactDetail.DocumentsLV.Actions.Download.MissingViewPermission.Tooltip")
    }

    return DisplayKey.get("Web.ContactDetail.DocumentsLV.Actions.Download.Tooltip")
  }

  function RemoveDocumentLinkTooltip (document : Document) : String {
    if (!perm.Document.delete(document)) {
      return DisplayKey.get("Web.ContactDetail.DocumentsLV.Actions.Delete.MissingPermission.Tooltip")
    }

    return DisplayKey.get("Web.ContactDetail.DocumentsLV.Actions.Delete.Tooltip")
  }

}
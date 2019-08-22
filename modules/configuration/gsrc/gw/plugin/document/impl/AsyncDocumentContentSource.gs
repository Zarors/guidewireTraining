package gw.plugin.document.impl

uses com.guidewire.pl.web.controller.UserDisplayableException
uses gw.api.locale.DisplayKey
uses gw.api.util.DisplayableException
uses gw.datatype.DataTypes
uses gw.plugin.document.IDocumentContentSource
uses java.util.Map
uses java.io.InputStream
uses gw.document.DocumentContentsInfo
uses gw.lang.reflect.TypeSystem
uses gw.plugin.InitializablePlugin
uses gw.api.util.DateUtil
uses java.io.File
uses java.lang.Throwable
uses java.io.FileInputStream
uses java.lang.StringBuilder
uses java.util.Date
uses gw.api.system.ABLoggerCategory

/**
 *
 *  IMPORTANT: This implementation is for Demo purpose only. Please do not modify it. Use it as an example for your
 *  IDocumentContentSource implementation for the Asynchronous case and define it in the plugin-gosu for your
 *  IDocumentContentSource.gwp.
 *
 *  This implements an asynchronous document content plugin for IDocumentContentSource as a wrapper around the existing plugin (ServletBasedDocumentContentSource).
 *  i.e., it just adds the functionality for splitting the document storage into steps when IDocumentContentSource is configured to try the synchronous implementation
 *  first.
 *
 *  The temporary storage is the same storage as the OOTB storage, i.e., it is a directory that is mapped across the cluster. Defined in the documents.path.
 */
@Export
class AsyncDocumentContentSource extends BaseLocalDocumentContentSource implements IDocumentContentSource {

  var AVAILABLE_PARAM = "TrySynchedAddFirst"
  var _attemptIfAvailable: boolean
  var _syncdIDCS : IDocumentContentSource
  var _maxFileNameLen : int
  var SYNCHED_CONTENT_SOURCE = "SynchedContentSource"

  construct() {
    ABLoggerCategory.DOCUMENT.debug("DocMgmt created instance of AsyncDocumentContentSource")
    var docUIDPropInfo = Document#DocUID.PropertyInfo
    var publicIDPropInfo = Document#PublicID.PropertyInfo
    var docUIDMaxLen = DataTypes.get(docUIDPropInfo).asConstrainedDataType().getLength(null, docUIDPropInfo)
    var publicIDMaxLen = DataTypes.get(publicIDPropInfo).asConstrainedDataType().getLength(null, docUIDPropInfo)
    _maxFileNameLen = docUIDMaxLen - 119 - publicIDMaxLen // Document.Name size is 80, so changing to max 72 so we can demo failure in the addDocument
  }

  override property set Parameters(params: Map) {
    super.Parameters = params
    _attemptIfAvailable = (params.get(AVAILABLE_PARAM) as String == "true")
    _syncdIDCS = wrapSyncdIDCS( params ) // throws on miss configuration
    ABLoggerCategory.DOCUMENT.debug("DocMgmt Async IDCS started async=${not _attemptIfAvailable} wrapping=${typeof _syncdIDCS}")
  }

  /** This should call the constructor and initialize the old synchronous version of the
   * IDocumentContentSource.
   * This should be overridden
   */
  function wrapSyncdIDCS(parameters: Map): IDocumentContentSource {
    var synchedTypeName = parameters.get(SYNCHED_CONTENT_SOURCE) as String
    if (synchedTypeName == null) {
      throw "AsyncDocumentContentSource -- missing required parameter ${SYNCHED_CONTENT_SOURCE}"
    }
    var synchedType = TypeSystem.getByFullNameIfValid(synchedTypeName)
    if (synchedType == null) {
      throw "AsyncDocumentContentSource -- could not find ${SYNCHED_CONTENT_SOURCE} ${synchedTypeName}"
    }
    var synchedIDCS = synchedType.TypeInfo.getConstructor({}).Constructor.newInstance({})
    if (synchedIDCS typeis InitializablePlugin) {
      synchedIDCS.setParameters(parameters)
    }
    if (synchedIDCS typeis IDocumentContentSource) {
      return synchedIDCS
    }
    else {
      throw "AsyncDocumentContentSource -- ${SYNCHED_CONTENT_SOURCE} ${synchedTypeName} is not an IDocumentContentSource"
    }
  }

  override property get InboundAvailable() : boolean {
    return _syncdIDCS != null && _syncdIDCS.InboundAvailable
  }

  override property get OutboundAvailable() : boolean {
    return _syncdIDCS != null && _syncdIDCS.OutboundAvailable
  }

  override function addDocument(documentContents : InputStream, document : Document) : boolean {
    if (documentContents == null) { // Moving the document to the permanent location
      if (document.DMS != null && !document.DMS) { // contentless document -- store immediately
        return _syncdIDCS.addDocument(documentContents, document)
      } else if (not isDocument(document)) { // document not already uploaded to the permanent location
        if (document.PendingDocUID != null) {
          if (document.New) {
            return false // nth commit after a rollback
          }
          // The document is in the temp location and it is processing the "DocumentStore" message created
          // in the "Async Document Store" rule after the event sent was added in the createTemporaryStore.
          // If there is a failure in the process of transporting the document from the temp location to the
          // DMS location, you can throw an exception which will then create a "FailedDocumentStore"
          // which can be handled in the "Async Document Store Failed" rule
          return storeDocument(document)
        }
      }
      return _syncdIDCS.addDocument(documentContents, document)
    }
    else {
      if (_syncdIDCS.InboundAvailable and _attemptIfAvailable) {
        return _syncdIDCS.addDocument(documentContents, document)
      }

      if (_maxFileNameLen < document.Name.size) {
        throw new UserDisplayableException(DisplayKey.get("Java.Document.AttachFailure", _maxFileNameLen ))
      }
      // Stores the document in the temp location
      return createTemporaryStore(documentContents, document)
    }
  }

  override function isDocument(document : Document) : boolean {
    return document.PendingDocUID == null && _syncdIDCS.isDocument( document )
  }

  override function updateDocument(document : Document, isDocument : InputStream) : boolean {
    if (document.PendingDocUID != null) {
      throw new DisplayableException(DisplayKey.get("Document.ViewFailure"))
    }
    return _syncdIDCS.updateDocument(document, isDocument)
  }

  override function removeDocument(document : Document) : boolean {

    if (document.PendingDocUID != null) {
      // Clear the DMS if the document is in the temporary location.
      var file = getDocumentFile( document.PendingDocUID );
      file.delete();
      return false;
    }

    return _syncdIDCS.removeDocument(document)
  }

  override function getDocumentContentsInfo( document : Document, includeContents: boolean ) : DocumentContentsInfo  {
    if (document.PendingDocUID != null) {
      throw new DisplayableException(DisplayKey.get("Document.ViewFailure"))
    }
    return _syncdIDCS.getDocumentContentsInfo( document, includeContents )
  }

  override function getDocumentContentsInfoForExternalUse(document : Document) : DocumentContentsInfo {
    if (document.PendingDocUID != null) {
      throw new DisplayableException(DisplayKey.get("Document.ViewFailure"))
    }
    return _syncdIDCS.getDocumentContentsInfoForExternalUse( document )
  }


  /* This will create a temporary file and send an event to move it to permanent
  * storage using "DocumentStore" event.
  */
  private function createTemporaryStore(is : InputStream, document : Document) : boolean {
    try {
      var docInfoWrapper = new DocumentInfoWrapper(document)
      var file : File
      do {
        document.PendingDocUID = getDocUID(docInfoWrapper)
        file = getDocumentFile( document.PendingDocUID )
      } while (file.exists())
      copyToFile(is, file)

      document.setPersistenceRequired( true )
      document.addEvent( "DocumentStore" )
      document.DateModified = Date.CurrentDate
      ABLoggerCategory.DOCUMENT.debug("DocMgmt created temporary file '${file}'")
      return false
    } catch (e : Throwable) {
      var docDetailName = document.PendingDocUID
      if (docDetailName == null) {
        docDetailName =  document.Name
      }
      ABLoggerCategory.DOCUMENT.warn("DocMgmt failed to store '${docDetailName}'", e)
      throw e
    }
  }

  /* This will move the document from temporary storage to the DMS, via the
  * ServletBased IDCS implementation
  */
  function storeDocument(document : Document) : boolean {
    var holdPendingDocUID = document.PendingDocUID
    if (document.Status == DocumentStatusType.TC_FINAL) {
      gw.document.DocumentsUtilBase.overridePermissionChecks()
    }

    try {
      var file = getDocumentFile(document.PendingDocUID)
      document.PendingDocUID = null
      var rtn = _syncdIDCS.addDocument(new FileInputStream(file), document)
      file.delete()
      return rtn
    } catch (t : Throwable) {
      document.PendingDocUID = holdPendingDocUID
      ABLoggerCategory.DOCUMENT.debug("Async storeDocument failed for " + document.Name, t)
      throw t
    } finally {
      if (document.Status == DocumentStatusType.TC_FINAL) {
        gw.document.DocumentsUtilBase.reinstatePermissionChecks()
      }
    }
  }

  /**
   * Inner class that represents a document name and the name of a subdirectory where the document will reside
   */
  public static class DocumentInfoWrapper implements BaseLocalDocumentContentSource.IDocumentInfoWrapper {
    private var _docName : String
    private var _date : Date

    public construct(document : Document) {
      _docName = document.getName()
      _date = DateUtil.currentDate()
    }

    override function getDocumentName() : String {
      return _docName + "." + _date.Minute + "." + (DateUtil.currentDate().Time - _date.Time)
    }

    override function getSubDirForDocument() : String {
      var strSubDir = new StringBuilder()
      strSubDir.append("async").append(File.separator)
      strSubDir.append(_date.YearOfDate).append(File.separator)
      return strSubDir.toString()
    }
  }

}

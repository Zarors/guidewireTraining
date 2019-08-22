package gw.plugin.document.impl

uses gw.api.system.PLLoggerCategory
uses gw.api.util.DateUtil
uses gw.lang.reflect.TypeSystem
uses gw.plugin.document.DocumentConfigUtil
uses gw.plugin.document.IDocumentContentSource
uses gw.document.DocumentContentsInfo
uses java.io.File
uses java.io.InputStream
uses java.lang.IllegalArgumentException
uses java.lang.StringBuilder
uses java.util.Date
uses gw.pl.util.FileUtil

@Export
class LocalDocumentContentSource extends BaseLocalDocumentContentSource implements IDocumentContentSource
{
  construct() {
  }

  override property set Parameters( parameters : Map ) : void {
    super.Parameters = parameters
    DocumentConfigUtil.validateSamePluginImpl(IDocumentContentSource.Name, TypeSystem.getFromObject(this).Name)
  }

  override function addDocument(documentContents : InputStream, document : Document) : boolean {
    var docInfoWrapper = new DocumentInfoWrapper(document)
    if (documentContents == null) {
      if (document.DocUID == null) {
        document.DocUID = getDocUID(docInfoWrapper)
      }
      // if recall, just update the date fields
    } else {
        document.DocUID = addDocument(documentContents, docInfoWrapper)
    }
    if (document.DateCreated == null) {
      document.DateCreated = DateUtil.currentDate()
    }
    if (document.DateModified == null) {
      document.DateModified = DateUtil.currentDate()
    }
    return false
  }

  override function isDocument(document : Document) : boolean {
    if (document.getDocUID() != null) {
        var docFile = getDocumentFile(document.getDocUID())
        return FileUtil.isFile(docFile) && docFile.exists()
    } else {
        return isDocumentFile(new DocumentInfoWrapper(document))
    }
  }

  override function getDocumentContentsInfo(document : Document, includeContents : boolean) : DocumentContentsInfo {
    PLLoggerCategory.DOCUMENT_ADAPTER_PLUGIN.info("LocalDocumentContentSource getting '" + document.DocUID + "' for " + User.util.getCurrentUser().Credential.UserName)
    if (document.getDocUID() == null) {
      return null;
    }
    var dci = getDocumentContents(document.DocUID, includeContents)
    dci.setResponseMimeType(document.getMimeType())
    return dci
  }
  
  override function getDocumentContentsInfoForExternalUse(document : Document) : DocumentContentsInfo {
    PLLoggerCategory.DOCUMENT_ADAPTER_PLUGIN.info("LocalDocumentContentSource getting external '" + document.DocUID + "' for " + User.util.getCurrentUser().Credential.UserName)
    if (document.getDocUID() == null) {
      return null;
    }
    var dci = getExternalDocumentContents(document.getDocUID());
    dci.setResponseMimeType(document.getMimeType())
    return dci
  }

  override function updateDocument(document : Document, docStream: InputStream) : boolean {
    if (docStream != null) { // when recalled (after first rollback) is will be null
      updateDocument(document.getDocUID(), docStream)
    }
    document.DateModified = Date.CurrentDate
    return false
  }
  
  override function removeDocument(document : Document) : boolean {
    removeDocumentById(document.getDocUID())
    return false
  }
  
  override function getDocumentFile(relativeName : String, lookInDemoFolder : boolean) : File {
    var thisType = (typeof this)
    var url = thisType.TypeLoader.getResource( thisType.Namespace + "/" + relativeName )
    if (url != null) {
      if (url.Protocol != "file") {
        throw new IllegalArgumentException("The protocol for the URL should be file was ${url}")
      }
      return new File(url.Path)
    }
    
    return super.getDocumentFile(relativeName, lookInDemoFolder);
  }
  
  /**
   * Inner class that represents a document name and the name of a subdirectory where the document will reside
   */
  public static class DocumentInfoWrapper implements BaseLocalDocumentContentSource.IDocumentInfoWrapper {
    private var _docName : String
    private var _date : Date

    public construct(document : Document) {
        _docName = document.getName()
        _date = document.CreateTime
        if (_date == null) {
          _date = DateUtil.currentDate()
        }
    }

    override function getDocumentName() : String {
        return _docName
    }

    override function getSubDirForDocument() : String {
      var strSubDir = new StringBuilder()
      strSubDir.append(_date.YearOfDate).append(File.separator)
      strSubDir.append(_date.MonthOfYear).append(File.separator)
      strSubDir.append(_date.DayOfMonth).append(File.separator)
      strSubDir.append(_date.HourOfDay).append(File.separator)
      return strSubDir.toString()
    }
  }
}

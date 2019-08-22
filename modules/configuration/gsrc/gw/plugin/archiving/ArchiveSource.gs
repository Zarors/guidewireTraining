package gw.plugin.archiving

uses gw.plugin.document.impl.BaseLocalDocumentContentSource
uses java.io.FileInputStream
uses gw.api.archiving.ArchivingLogger
uses java.io.InputStream
//uses java.util.zip.ZipEntry
//uses java.io.BufferedInputStream
//uses java.util.zip.ZipInputStream
//uses java.io.BufferedOutputStream
//uses java.io.OutputStream
//uses java.util.zip.ZipOutputStream
uses gw.api.importing.ImportingUtil
uses java.util.Map
uses gw.api.system.server.ServerModeUtil
uses gw.api.archiving.ArchivingUtil
uses gw.api.archiving.upgrade.Issue
uses java.io.File
uses java.lang.Throwable
uses java.lang.IllegalStateException
uses java.lang.RuntimeException
uses java.util.Date
uses gw.api.util.DateUtil
uses gw.api.util.DisplayableException
uses gw.api.util.RetryableException
uses java.util.ArrayList
uses gw.entity.IEntityType
uses gw.util.Pair
uses java.util.List
uses gw.pl.persistence.core.Key;


/** This class implements the IArchiveSource interface.  This example implementation uses
 * the BaseLocalDocumentContentSource so that the store/retrieval bypasses the async storage
 * mechanism, i.e., writing the graph to a message seems wasteful of message history space
 * and is not needed for reliability.
 * 
 * It might be possible to implement this in terms of the customer's own plugin depending on
 * whether they break down their plugin.
 */
 @Export
class ArchiveSource extends BaseLocalDocumentContentSource implements IArchiveSource  {
  public static final var STORE_INITIAL_STATE_PARAM : String = "store-state" 
  public static final var RETRIEVE_INITIAL_STATE_PARAM : String = "retrieve-state" 
  public static final var ARCHIVE_SUBDIR : String = "archive"
  public static final var ARCHIVE_SUBDIR_WITH_SEPARATOR : String = ARCHIVE_SUBDIR + System.getProperty("file.separator")

  public static class StatusImpl implements ArchiveSourceInfo {
    var _storeStatus : ArchiveSourceStatus as StoreStatus
    var _retrieveStatus : ArchiveSourceStatus as RetrieveStatus
    var _deleteStatus : ArchiveSourceStatus as DeleteStatus
    var _asOfDate : Date as AsOf
    var _count : int as Count
    var _size : long as SizeKB
    var _root : File as Root
    var _oldest : Date as Oldest
    var _newest : Date as Newest
    override function toString() : String {
      return " store: " + StoreStatus 
           + " retrieve: " + RetrieveStatus
           + " delete: " + DeleteStatus
           + " asOf=" +  AsOf
           + " count=" + Count
           + " size=" + SizeKB/1024 + "mb"
           + " root=" + Root
           + " oldest=" + Oldest
           + " newest=" + Newest
    }
  }

  var _status = new StatusImpl()
   override property get Status() : ArchiveSourceInfo {
     return _status
   }

  override property set Parameters(parameters : Map) {
    if (!ServerModeUtil.isDev() && !ServerModeUtil.isTest()) {
      ArchivingLogger.error("This plugin was not meant for production")
    }
    super.Parameters = parameters
    refresh()
  }
  
   override function refresh() {
    _status.StoreStatus = TC_AVAILABLE
    _status.RetrieveStatus = TC_AVAILABLE
    _status.DeleteStatus = TC_AVAILABLE
    _status.Root = new File(getDocumentsDir(), ARCHIVE_SUBDIR)
    _status.Oldest = null
    _status.Newest = null
    _status.Count = 0
    _status.AsOf = DateUtil.currentDate()
    countDir(_status.Root)
   }

   private function countDir(dir : File) {
     for (file in dir.listFiles()) {
       if (file.Directory) {
         countDir(file)
       }
       else {
         _status.SizeKB += (file.length() + 1023) / 1024
         if (file.Extension == "xml") {
           _status.Count ++
           var testDate = new Date(file.lastModified())
           if (_status.Oldest == null || _status.Oldest > testDate) {
             _status.Oldest = testDate
           }
           if (_status.Newest == null || _status.Newest < testDate) {
             _status.Newest = testDate
           }
         }
       }
     }
   }
   
  override function prepareForArchive(info : RootInfo) {
  }
  
  override function updateInfoOnStore(info : RootInfo) {
  }

  override function store(graph : InputStream, info : RootInfo) {
    if (_status.StoreStatus != TC_AVAILABLE) {
      throw new IllegalStateException(_status.StoreStatus.Description);
    }
    qaPublicIdAsCommand("send", info)
    try {
      ensureSchemasAreStored()
//    var os1 = new ByteArrayOutputStream()
//    var os3 = zip(os1, makeValidPortableFileName(info.RootPublicID) + ".xml");
//    StreamUtil.copy(graph, os3)
//    os3.close()
//    var wrapped = new InfoWrapper(ARCHIVE_SUBDIR_WITH_SEPARATOR, super.makeValidPortableFileName(info.RootPublicID + ".zip"))
      var wrapped = new InfoWrapper(ARCHIVE_SUBDIR_WITH_SEPARATOR, super.makeValidPortableFileName(info.RootPublicID + ".xml"))
      var targetFile = getDocumentFile(wrapped, false)
      if (targetFile.exists()) {
        targetFile.delete()
      }
//    super.addDocument(new ByteArrayInputStream(os1.toByteArray()), wrapped) 
      super.addDocument(graph, wrapped) // will log the file
      ArchivingLogger.debug("Saved ${info.RootPublicID} graph to ${wrapped.getSubDirForDocument()}")
    }
    catch (e : Throwable) {
      throw e
    }
  }

  override function storeFinally(info : RootInfo, finalStatus : ArchiveFinalStatus, cause : List<String>) {
    ArchivingLogger.info("On root entity: " + info.RootPublicID + ", store finally status= " + finalStatus);
    if (finalStatus != TC_SUCCEEDED) {
      var strUID = super.getDocUID(new InfoWrapper(ARCHIVE_SUBDIR_WITH_SEPARATOR, super.makeValidPortableFileName(info.RootPublicID + ".xml")))
      var file = super.getDocumentFile(strUID)
      file.delete(); 
    }
  }

//  private function zip(os : OutputStream, name : String)  : OutputStream { 
//    var zipOS = new ZipOutputStream(new BufferedOutputStream(os));
//    var zipEntry = new ZipEntry(name)
//    zipOS.putNextEntry(zipEntry)
//    return zipOS
//  }

  override function retrieve(info : RootInfo) : InputStream {
    if (_status.RetrieveStatus != TC_AVAILABLE) {
      throw new RetryableException("", new IllegalStateException(_status.RetrieveStatus.Description));
    }
    qaPublicIdAsCommand("recv", info)
    try {
  //    var strUID = super.getDocUID(new InfoWrapper(ARCHIVE_SUBDIR_WITH_SEPARATOR, super.makeValidPortableFileName(info.RootPublicID + ".zip")))
      var strUID = super.getDocUID(new InfoWrapper(ARCHIVE_SUBDIR_WITH_SEPARATOR, super.makeValidPortableFileName(info.RootPublicID + ".xml")))
      var file = super.getDocumentFile(strUID)
  //    return unzip(new FileInputStream(file))
      return new FileInputStream(file)
    }
    catch (e : DisplayableException) {
      throw e
    }
    catch (e : Throwable) {
      throw new DisplayableException("On " + info.RootPublicID + ": " + e.Message, e)
    }
  }

   override function updateInfoOnRetrieve(info : RootInfo) {     
   }

  override function handleUpgradeIssues(info : RootInfo, root : KeyableBean, issues : List<Issue>) {
  }

  override function retrieveFinally(info : RootInfo, finalStatus : ArchiveFinalStatus, cause : List<String>) {
    ArchivingLogger.debug("On " + info.RootPublicID + " retrieve: final=" + finalStatus);
    
    if (finalStatus == TC_SUCCEEDED) {
      var strUID = super.getDocUID(new InfoWrapper(ARCHIVE_SUBDIR_WITH_SEPARATOR, super.makeValidPortableFileName(info.RootPublicID + ".xml")))
      var file = super.getDocumentFile(strUID)
      file.delete(); 
    }
  }

//  private function unzip(is : InputStream)  : InputStream { 
//    var zipIS = new ZipInputStream(new BufferedInputStream(is));
//    zipIS.getNextEntry();        
//    return zipIS;
//  }

  protected function qaPublicIdAsCommand(prefix : String, info : RootInfo) {
    var publicId = info.RootPublicID
    var parts = publicId.split(":")
    if (prefix == "send") {
      if (parts.Count > 2) {
        if (parts[0] == "send") {
          switch (parts[1]) {
            case "fail" : 
              _status.StoreStatus = TC_FAILURE
              throw new RuntimeException("qaPublicIdAsCommand:on command " + publicId)
            case "retry" : 
              throw new RetryableException("RetryableException", new RuntimeException("qaPublicIdAsCommand:on command " + publicId))
            case "retryDup" :
              throw new RetryableException("RetryableException", new RuntimeException("qaPublicIdAsCommand:on command "))      
            case "exf" : 
              throw new RuntimeException("qaPublicIdAsCommand:on command fixed")
            case "ex" : 
              throw new RuntimeException("qaPublicIdAsCommand:on command " + publicId)
            case "exDup" :
              throw new RuntimeException("qaPublicIdAsCommand:on command ")              
          case "avail" :
            ArchivingLogger.info("qaPublicIdAsCommand:on command " + publicId)
           _status.StoreStatus = TC_AVAILABLE
           break; 
          case "queue" : 
            _status.StoreStatus = TC_QUEUE; 
            ArchivingLogger.info("qaPublicIdAsCommand:on command " + publicId)
            break; 
          }
        }
        else if (parts[0] == "recv") {
          switch (parts[1]) {
            case "off" :
              ArchivingLogger.info("qaPublicIdAsCommand:on command " + publicId + " turning off retreiveals")
              _status.RetrieveStatus = TC_MANUALLY; 
              break; 
            case "on" : 
              ArchivingLogger.info("qaPublicIdAsCommand:on command " + publicId + " turning on retreiveals")
              _status.RetrieveStatus = TC_AVAILABLE;
              break; 
          }
        }
        else if (parts[0] == "del") {
          switch (parts[1]) {
            case "off" :
              ArchivingLogger.info("qaPublicIdAsCommand:on command " + publicId + " turning off deletes")
              _status.DeleteStatus = TC_MANUALLY; 
              break; 
            case "on" : 
              ArchivingLogger.info("qaPublicIdAsCommand:on command " + publicId + " turning on deletes")
              _status.DeleteStatus = TC_AVAILABLE;
              break; 
          }
        }
      }
    }
    else if (prefix == "recv") {
      if (parts.Count > 2 && parts[0] == "recv") {
        switch (parts[1]) {
          case "fail" : 
            _status.RetrieveStatus = TC_FAILURE
            throw new DisplayableException("qaPublicIdAsCommand:on command " + publicId)
          case "ex" : 
            throw new DisplayableException("qaPublicIdAsCommand:on command " + publicId)
        }
      }
    }
    else if (prefix == "del") {
      if (parts.Count > 2 && parts[0] == "del") {
        switch (parts[1]) {
          case "fail" : 
            _status.DeleteStatus = TC_FAILURE
            throw new DisplayableException("qaPublicIdAsCommand:on command " + publicId)
          case "ex" : 
            throw new DisplayableException("qaPublicIdAsCommand:on command " + publicId)
        }
      }
    }
  }
    
  override function retrieveSchema(platformMajor : int, platformMinor : int, appMajor : int, appMinor : int, extension : int) : InputStream {
    if (_status.RetrieveStatus != TC_AVAILABLE) {
      throw new IllegalStateException(_status.RetrieveStatus.Description);
    }
    try {
      var name = schemaFileName(platformMajor,platformMinor,appMajor,appMinor,extension)
      var strUID = super.getDocUID(new InfoWrapper(ARCHIVE_SUBDIR_WITH_SEPARATOR, name))
      var file = super.getDocumentFile(strUID)
      return new FileInputStream(file)
    }
    catch(e : Throwable) {
      throw e
    }
  }

   override function storeSchema(platformMajor : int, platformMinor : int, appMajor : int, appMinor : int, extension : int, schema : InputStream) {
    if (_status.StoreStatus != TC_AVAILABLE) {
      throw new IllegalStateException(_status.StoreStatus.Description);
    }
    try {
      ensureImportingSchemaIsStored();
      ensureArchivingSchemaIsStored();
      ensureGWAdditionalSchemaIsStored();
      var name = schemaFileName(platformMajor, platformMinor, appMajor, appMinor, extension)
      var infoWrapper = new InfoWrapper(ARCHIVE_SUBDIR_WITH_SEPARATOR, name)
      var strUID = super.getDocUID(infoWrapper)
      var file = super.getDocumentFile(strUID)
      if (file.exists()) {
        file.delete(); // overwrite
      }
      super.addDocument(schema, infoWrapper)
      ensureSchemaIsStored();
    } 
    catch (e : Throwable) {
      throw e
    }
  }

  private function schemaFileName(platformMajor : int, platformMinor : int, appMajor : int, appMinor : int, extension : int) : String {
    return "domain-" + platformMajor + "." + platformMinor + "." + appMajor + "." + appMinor + "." + extension + ".xsd"
  }

  private function ensureSchemasAreStored() {
    ensureSchemaIsStored();
    ensureImportingSchemaIsStored();
    ensureArchivingSchemaIsStored();
    ensureGWAdditionalSchemaIsStored();
  }
  
  private function ensureSchemaIsStored() {
    var name = schemaFileName(
      ImportingUtil.getPlatformMajorVersion(),
      ImportingUtil.getPlatformMinorVersion(),
      ImportingUtil.getApplicationMajorVersion(),
      ImportingUtil.getApplicationMinorVersion(),
      ImportingUtil.getExtensionVersion())
    var infoWrapper = new InfoWrapper(ARCHIVE_SUBDIR_WITH_SEPARATOR, name)
    var strUID = super.getDocUID(infoWrapper)
    var file = super.getDocumentFile(strUID)
    if (!file.exists()) {
      var schemaIS = ImportingUtil.generateDomainSchema()
      super.addDocumentIfNotExists(schemaIS, infoWrapper)
    }
  }

  private function ensureImportingSchemaIsStored() {
    var name = "importing-" + ImportingUtil.getImportingSchemaVersion() + ".xsd"
    var infoWrapper = new InfoWrapper(ARCHIVE_SUBDIR_WITH_SEPARATOR, name)
    var strUID = super.getDocUID(infoWrapper)
    var file = super.getDocumentFile(strUID)
    if (!file.exists()) {
      var schemaIS = ImportingUtil.getImportingSchema()
      super.addDocument(schemaIS, infoWrapper)
    }
  }
  
  private function ensureArchivingSchemaIsStored() {
    var name = "archiving-" + ArchivingUtil.getArchivingSchemaVersion() + ".xsd"
    var infoWrapper = new InfoWrapper(ARCHIVE_SUBDIR_WITH_SEPARATOR, name)
    var strUID = super.getDocUID(infoWrapper)
    var file = super.getDocumentFile(strUID)
    if (!file.exists()) {
      var schemaIS = ArchivingUtil.getArchivingSchema()
      super.addDocument(schemaIS, infoWrapper)
    }
  }
  private function ensureGWAdditionalSchemaIsStored() {
    var name = "gw-schema-additions-" + ImportingUtil.getGWAdditionsSchemaVersion() + ".xsd"
    var infoWrapper = new InfoWrapper(ARCHIVE_SUBDIR_WITH_SEPARATOR, name)
    var strUID = super.getDocUID(infoWrapper)
    var file = super.getDocumentFile(strUID)
    if (!file.exists()) {
      var schemaIS = ImportingUtil.getGWAdditionsSchema()
      super.addDocument(schemaIS, infoWrapper)
    }
  }

  protected static class InfoWrapper implements IDocumentInfoWrapper { // implement super's required parameter
    var _documentName : String
    var _subDirPath : String
    construct(subDirPath : String, docName : String) {
      _subDirPath = subDirPath
      _documentName = docName
    }
    override public function getDocumentName() : String {
      return _documentName
    }
    override public function getSubDirForDocument() : String {
      return _subDirPath
    }
  }

  override function updateInfoOnDelete(info : RootInfo) : List<Pair<IEntityType, List<Key>>> {
    qaPublicIdAsCommand("del", info)
    return new ArrayList<Pair<IEntityType, List<Key>>>()
   }

   override function delete(info : RootInfo) {   
     if (_status.DeleteStatus != TC_AVAILABLE) {
      throw new IllegalStateException(_status.DeleteStatus.Description);
     }
      var strUID = super.getDocUID(new InfoWrapper(ARCHIVE_SUBDIR_WITH_SEPARATOR, super.makeValidPortableFileName(info.RootPublicID + ".xml")))
      var file = super.getDocumentFile(strUID)
      if (file.exists()) {
        // print("file found " + file.Name);
        file.delete()
      }
   }
}

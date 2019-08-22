package gw.plugin.document.impl

uses gw.api.system.PLLoggerCategory
uses gw.api.upgrade.Coercions
uses gw.document.ContentDispositionType
uses gw.document.DocumentContentsInfo
uses gw.document.DocumentExistsException
uses gw.pl.util.FileUtil
uses gw.plugin.InitializablePlugin
uses gw.plugin.PluginParameter

uses java.io.File
uses java.io.FileOutputStream
uses java.io.IOException
uses java.io.InputStream
uses java.net.URL
uses gw.plugin.document.DocumentConfigUtil

@Export
@PluginParameter(:name="documents.path", :type=File)
@PluginParameter(:name="mode", :type=String, :helpText="This is either \"content\", \"url\", \"url-direct\"")
@PluginParameter(:name="contentDisposition", :type=String, :helpText="This is either \"INLINE\", \"ATTACHMENT\", \"DEFAULT\"" )
@PluginParameter(:name="target", :type=String, :helpText="This is either \"content\", \"url\", \"url-direct\"")
abstract class BaseLocalDocumentContentSource implements InitializablePlugin
{
  private var _rootDir : String as readonly RootDir
  private var _tempDir : String as readonly TempDir
  private var _documentsPathParameter : String as readonly DocumentsPathParameter
  private var _documentsPath : String as DocumentsPath
  private var _demoDocumentsPath : String as DemoDocumentsPath

  private var _contentResponseType = DocumentContentsInfo.ContentResponseType.DOCUMENT_CONTENTS
  private var _contentURL : String
  private var _contentDispositionType : ContentDispositionType = null;

  public final static var DOCUMENTS_PATH : String = "documents.path"

  public property get DemoDocumentsURL() : URL {
    return new URL("file", "", DemoDocumentsPath)
  }

  public property get DocumentsURL() : URL {
    return new URL("file", "", DocumentsPath)
  }

  //These mode parameters are provided for testing purposes; they allow simulation of different kinds of
  // content responses. See the documentation for DocumentContentsInfo for more details on the various modes.
  // Note that not all of the simulated modes faithfully transmit the actual document contents.
  // Generally speaking, the mode parameter should not be used in production.
  public final static var MODE_PARAM : String = "mode"

  //Determine disposition for content
  private static final var CONTENT_DISPOSITION_PARAM = "contentDisposition";

  //This is the script used for the jscript mode simulation
  private static var URL_PARAM = "url"

  construct() {
  }

  property get InboundAvailable() : boolean {
    return true
  }

  property get OutboundAvailable() : boolean {
    return true
  }
  
  override property set Parameters( parameters : Map ) : void {
    if (parameters != null) {
      _rootDir = parameters.get(ROOT_DIR) as String
      _tempDir = parameters.get(TEMP_DIR) as String
      _documentsPathParameter = parameters.get(DOCUMENTS_PATH) as String
      buildDocumentsPath(RootDir, TempDir)

      var mode = parameters.get(MODE_PARAM) as String
      if (mode.HasContent) {
        var contentResponseType = DocumentContentsInfo.ContentResponseType.fromMode(mode)
        if (contentResponseType != null) {
          _contentResponseType = contentResponseType
          if (contentResponseType == URL || contentResponseType == URL_DIRECT)
            _contentURL = parameters.get(URL_PARAM) as String
        } else {
          PLLoggerCategory.DOCUMENT.warn("DocumentContentSource specifies invalid mode: " + mode);
        }
      }

      var contentDispositionTypeName = parameters.get(CONTENT_DISPOSITION_PARAM) as String
      if (contentDispositionTypeName.HasContent) {
        _contentDispositionType = ContentDispositionType.fromString(contentDispositionTypeName);
      }

      PLLoggerCategory.DOCUMENT.info((typeof this).RelativeName + " starting mode=" + mode + " contentDisposition=" + contentDispositionTypeName)
    }
  }

  public static function appendFileToPath(strPath : String, strFile : String) : String {
    if (strPath == null) {
        strPath = ""
    }
    var strSeparator = File.separator
    if (strPath.endsWith("/") || strPath.endsWith("\\") || strPath.endsWith(File.separator)) {
        strSeparator = ""
    }
    return strPath + strSeparator + strFile
  }

  protected function match(source : String, words : String[]) : boolean {
    return match(source.split(","), words)
  }

  /**
   * @param source
   * @param words
   */
  protected function match(source : String[], words : String[]) : boolean {
    if (words == null || words.length == 0 || words[0] == null || words[0].length() == 0) {
        return true
    }
    if (source == null || source.length == 0) {
        return false
    }

    for (var word in words) {
      var found = false
      for (var src in source) {
        if (src != null && word.equalsIgnoreCase(src.trim())) {
          found = true
          break
        }
      }
      if (!found) {
        return false
      }
    }
    return true
  }

  protected function buildDocumentsPath(documentRootDir : String, documentTmpDir : String) {
    if (DocumentsPathParameter == null) {
      _documentsPathParameter = ""
    }
    DemoDocumentsPath = DocumentConfigUtil.getAbsolutePath(DocumentsPathParameter, documentRootDir)
    if (new File(DemoDocumentsPath) != new File(DocumentsPathParameter)) {
        PLLoggerCategory.DOCUMENT.warn((typeof this).RelativeName + " has a relative path specified for its documents.path parameter, so it will store documents in the app container's temporary directory. For production use, the configuration should be changed to a full directory path, not a relative path")
        DocumentsPath = DocumentConfigUtil.getAbsolutePath(DocumentsPathParameter, documentTmpDir)
        var file = new File(DocumentsPath)
        if (!file.exists() && file.isDirectory()) {
            file.mkdirs()
        }
    } else {
        DocumentsPath = DemoDocumentsPath
    }
    PLLoggerCategory.DOCUMENT.info((typeof this).RelativeName + "Documents path: " + DocumentsPath)
  }

  /**
   * Builds the DocumentContentsInfo containing the document contents information. Most of the code in this method
   * exists for the testing-time "mode" parameter; see the CONTENT_MODE section for the standard content-returning scenario.
   * @param strDocUID The DocUID of the document whose contents should be returned
   * @param includeContents If true, the actual contents of the document should be included in the DocumentContentsInfo
   * @return A DocumentContentsInfo object with the metadata of the Document Contents, and possibly the contents themselves
   */
  protected function getDocumentContents(strDocUID : String, includeContents : boolean) : DocumentContentsInfo {
    return DocumentContentsInfo.getDocumentContents(strDocUID, _contentResponseType, _contentURL, DocumentsURL as String, _documentsPath,
                                                    _demoDocumentsPath, _contentDispositionType, includeContents)
  }

  /**
   * Builds the DocumentContentsInfo containing the document contents information. Most of the code in this method
   * exists for the testing-time "mode" parameter; see the CONTENT_MODE section for the standard content-returning scenario.
   * @param strDocUID The DocUID of the document whose contents should be returned
   * @param includeContents If true, the actual contents of the document should be included in the DocumentContentsInfo
   * @return A DocumentContentsInfo object with the metadata of the Document Contents, and possibly the contents themselves
   */
  protected function getExternalDocumentContents(strDocUID : String) : DocumentContentsInfo {
    return DocumentContentsInfo.getDocumentContents(strDocUID, DOCUMENT_CONTENTS, null, DocumentsURL as String, _documentsPath,
                                                    _demoDocumentsPath, null, true)
  }

 /**
   * Store a new set of contents for the given DocUID.  Note that this can not default the date modified, because the
   * date is not null.
   */
  protected function updateDocument(strDocUID : String, isDocument : InputStream) {
    try {
        var file = getDocumentFile(strDocUID)
        if (!FileUtil.isFile( file ) || file.isReservedFileName()) {
            throw new IllegalArgumentException("Document ${strDocUID} does not exist!")
        }
        var backupFile = new File(file.getPath() + ".bak")
        if (not file.renameTo(backupFile) ) { // renamed physical file, 'file' still has previous name
          throw new RuntimeException("Failed to rename file to ${backupFile}")
        }
        copyToFile(isDocument, file)
        try {
          backupFile.delete()
        }
        catch (e : Throwable) {
          PLLoggerCategory.DOCUMENT.warn("DocMgmt failed to delete '${backupFile}'")
        }
    } catch (e : Exception) {
        throw new RuntimeException("Exception encountered trying to update document with doc UID: ${strDocUID}", e)
    }
  }

 /**
   * Store a new chunk of contents.
   * @param isDocument An input stream containing the content to be stored
   * @param docInfoWrapper Information which uniquely identifies this content
   * @return A string which can be used to retrieve the contents in the future (the DocUID)
   */
   protected function addDocument(isDocument : InputStream, docInfoWrapper : IDocumentInfoWrapper) : String {
     return addDocument(isDocument, docInfoWrapper, true)
   }

    /**
      * Store a new chunk of contents if not already exists.
      * @param isDocument An input stream containing the content to be stored
      * @param docInfoWrapper Information which uniquely identifies this content
      * @return A string which can be used to retrieve the contents in the future (the DocUID)
      */
    protected function addDocumentIfNotExists(isDocument : InputStream, docInfoWrapper : IDocumentInfoWrapper) : String {
      return addDocument(isDocument, docInfoWrapper, false)
    }

    private function addDocument(isDocument : InputStream, docInfoWrapper : IDocumentInfoWrapper, checkNotExists : boolean) : String {
      try {
        var docUID = getDocUID(docInfoWrapper)
        var file = getDocumentFile(docInfoWrapper, false)
        var fileExists = FileUtil.isFile(file) && !file.isReservedFileName();
        PLLoggerCategory.DOCUMENT.debug("BaseLocalDocumentContentSource-addDocument is? " + (isDocument != null)
                              + " checkNotExists=" + checkNotExists
                              + " fileExists=" + fileExists
                              + " file=" + file)
        if (checkNotExists && fileExists) {
          throw new DocumentExistsException("${docUID} already exists.")
        }
        if (!fileExists) {
          copyToFile(isDocument, file)
          PLLoggerCategory.DOCUMENT.info("DocMgmt created content file '${file}'")
        } else {
          PLLoggerCategory.DOCUMENT.info("DocMgmt found existing content file '${file}'")
        }
        return docUID
      } catch (e : Exception) {
        PLLoggerCategory.DOCUMENT.debug("DocMgmt failed to create content file for '${docInfoWrapper.getDocumentName()}'")
        throw new RuntimeException("Exception encountered trying to add document with doc UID: ${getDocUID(docInfoWrapper)}", e)
      }
    }
  
  /** This will create a document UID, in the case of OOTB this is the relative path
  */
  protected function getDocUID(docInfoWrapper : IDocumentInfoWrapper) : String {
    var strDocumentName = makeValidPortableFileName(docInfoWrapper.getDocumentName())
    if (strDocumentName == null) {
        throw new IllegalArgumentException("Document name is null.")
    }
    var docUID = convertBackSlashPathToSlashPath(makeSubDirPath(docInfoWrapper) + strDocumentName)
    return docUID
  }
  
  /**
   * Remove the contents identified by the given DocUID
   */
  protected function removeDocumentById(strDocumentId : String) {
    if (strDocumentId == null || strDocumentId.isEmpty() || strDocumentId == "none") {
      return
    }
    try {
        var file = getDocumentFile(strDocumentId)
        if (!file.exists()) {
            return
        }
        if (!file.delete()) {
            throw new IllegalStateException("Document could not be deleted: ${file}")
        }
    } catch (e : Exception) {
        throw new RuntimeException("Exception encountered trying to remove document with doc UID: ${strDocumentId}", e)
    }
  }

  protected function removeLinkToInfo(strDocumentId : String) {
    removeDocumentById(strDocumentId)
  }

  protected function copyToFile(is : InputStream, file : File) {
    using(var os = new FileOutputStream(file)) {
      var bytes = new byte[4096]
      while (true) {
        var i = is.read(bytes)
        if (i < 0) {
          break
        }
        os.write(bytes, 0, i)
      }
    }
    is.close()
  }

  protected function makeValidPortableFileName(strFileName : String) : String {
    if (strFileName == null || strFileName.length() == 0) {
      return strFileName
    }

    var sb = new StringBuilder(strFileName)
    if (sb.charAt(0) == Coercions.makePCharFrom(".")) {
      sb.deleteCharAt(0)
    }

    for (i in 0..|sb.length()) {
      var c = sb.charAt(i)
      if ("\"/\\[]:;|=,?<>*".indexOf(c as String) >= 0) {
        sb.setCharAt(i, Coercions.makePCharFrom("_"))
      }
    }

    return sb.toString()
  }

  protected function isDocumentFile(docInfoWrapper : IDocumentInfoWrapper) : boolean {
    try {
        var strName = docInfoWrapper.getDocumentName()
        if (!strName.HasContent) {
            throw new IllegalArgumentException("Document name is null or empty.")
        }
        var file = getDocumentFile(docInfoWrapper, true)
        return !file.isReservedFileName() and FileUtil.isFile(file)
    } catch (t : Throwable) {
        throw new RuntimeException("Exception encountered trying to test for the existiance of document named: ${docInfoWrapper.getDocumentName()}", t)
    }
  }

  protected function getDocumentsDir() : String {
    return DocumentsPath + File.separator
  }

  protected function getDemoDocumentsDir() : String {
    return DemoDocumentsPath + File.separator
  }
  /** This will get or create the file and create any required directories
  */
  protected function getDocumentFile(relativePath : String) : File {
    return getDocumentFile(relativePath, false)
  }
  
  protected function getDocumentFile(relativePath : String, checkDemoFolder : boolean) : File {
    var file = new File(getDocumentsDir(), relativePath)
    if (!file.exists() && checkDemoFolder) {
        file = new File(getDemoDocumentsDir(), relativePath)
    }
    return file
  }

  protected function makeSubDirPath(diw : IDocumentInfoWrapper) : String {
      var subDirPath = diw.getSubDirForDocument()
      var dirDoc = new File(getDocumentsDir() + subDirPath)
      if (not dirDoc.Directory) {
          dirDoc.mkdirs()
      }
      return subDirPath
  }

  protected function getDocumentFile(docInfoWrapper : IDocumentInfoWrapper, checkDemoFolder : boolean) : File {
    var strSubDir = makeSubDirPath(docInfoWrapper)
    var file = getDocumentFile(strSubDir + makeValidPortableFileName(docInfoWrapper.getDocumentName()), checkDemoFolder)
    return file
  }

  private function convertBackSlashPathToSlashPath(strPath : String) : String {
    if (strPath == null || strPath.length() == 0) {
        return strPath
    }
    return strPath.replace(Coercions.makePCharFrom("\\"), Coercions.makePCharFrom("/"))
  }

  //---------- Sub classes to factor out differences between app-specific document info --------------------------
  /**
   * Class which wraps required information into an identifying token for document contents
   */
  public static interface IDocumentInfoWrapper {

    public function getDocumentName() : String

    public function getSubDirForDocument() : String
  }
}

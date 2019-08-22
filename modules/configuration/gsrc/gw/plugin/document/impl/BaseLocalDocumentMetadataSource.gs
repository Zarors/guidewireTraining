package gw.plugin.document.impl

/** This is only a proof of concepts for document metadata source.  It uses a cache to avoid having duplicate objects
 * for the same document public id, which should be done by other implementors of IDocumentMetadataSource interface.
 * 
 * Note that the cache here is weak, because the cache could load all documents and be done with it.  However, in a production 
 * environment that cache would be too large.  So implement it as just a find search.
 * 
 * Note the primary use of the cache is to have only a single instance in the cache.
 * 
 */

uses gw.api.system.PLLoggerCategory
uses gw.document.DocumentsUtilBase
uses gw.pl.util.FileUtil
uses gw.plugin.InitializablePlugin
uses gw.plugin.document.DocumentConfigUtil
uses gw.plugin.document.IDocumentMetadataSourceBase
uses gw.plugin.util.RemotableSearchResultSpec
uses gw.util.StreamUtil

uses java.io.BufferedInputStream
uses java.io.BufferedOutputStream
uses java.io.File
uses java.io.FileInputStream
uses java.io.FileOutputStream
uses java.io.InputStream
uses java.io.OutputStream

@Export
abstract class BaseLocalDocumentMetadataSource implements IDocumentMetadataSourceBase, InitializablePlugin {

  private static var DMS_DIR_PROP = "metadata.dir"
  private var _metadata_dir : File as readonly MetadataDir = DocumentConfigUtil.getMetadataDir().toJavaFile()

  construct() {
    PLLoggerCategory.DOCUMENT.info("BaseLocalDocumentMetadataSource started")
  }

  override property set Parameters( parameters : Map ) {
    if (parameters != null) {
      if (parameters.containsKey(DMS_DIR_PROP)) {
        _metadata_dir = new File(parameters.get(DMS_DIR_PROP).toString())
        if (!_metadata_dir.exists() && !_metadata_dir.mkdirs()) {
          PLLoggerCategory.DOCUMENT.warn("Failed to create metadata directory '${_metadata_dir}'")
        }
      }
      // Attempting to set _metadata_dir using ROOT_DIR breaks a bunch of tests which expect TEMP_DIR
      // (due to DocumentConfigUtil.getMetadataDir())
    }
    PLLoggerCategory.DOCUMENT.info("BaseLocalDocumentMetadataSource MetadataDir ${_metadata_dir}")
  }

  /** This will match the document to the criteria.
  *
  * IMPLEMENTATION NOTE:  This should be overriden in sub classes and call super.
  */
  protected function documentMatchesCriteria( doc : Document, criteria : DocumentSearchCriteria) : boolean  {
    var name = criteria.NameOrID
    if (name != null and not doc.Name.startsWithIgnoreCase( criteria.NameOrID)) {
        return false
    }
    if (criteria.Author != null and not doc.Author.startsWithIgnoreCase( criteria.Author)) {
        return false
    }
    if (criteria.Language != null and criteria.Language != doc.Language) {
        return false
    }
    if (criteria.Section != null and criteria.Section != doc.Section) {
        return false
    }
    if (criteria.Status != null and criteria.Status != doc.Status) {
        return false
    }
    if (not criteria.IncludeObsoletes and doc.Obsolete) {
        return false
    }
    if (criteria.Type != null and criteria.Type != doc.Type) {
        return false
    }
    return true
  }

  override public property get InboundAvailable() : boolean {
    return true
  }

  override public property get OutboundAvailable() : boolean {
    return true
  }

  protected property get MetadataFiles() : File[] {
    var rtn = MetadataDir.listFiles().where(\ file -> FileUtil.isFile(file))
    if (PLLoggerCategory.DOCUMENT.DebugEnabled) {
      PLLoggerCategory.DOCUMENT.debug("BaseLocalDocumentMetadataSource MetadataFiles ${rtn?.toList()}")
    }
    return rtn
  }

  override function removeDocument( document : Document ) : void  {
    var metadataFile = getMetadataFileForUniqueId(document.PublicID)
    if (metadataFile.exists()) {
      metadataFile.delete()
    }
  }

  override function retrieveDocument( uniqueId : String ) : Document  {
    PLLoggerCategory.DOCUMENT.debug("BaseLocalDocumentMetadataSource retrieveDocument ${uniqueId}")
    var metadataFile = getMetadataFileForUniqueId(uniqueId)
    if (!metadataFile.exists()) {
      throw new IllegalArgumentException("No document metadata exists with id: " + uniqueId)
    }
    return retrieveDocument( metadataFile, true )
  }

  override function saveDocument( document : Document ) : void  {
    var docId = document.PublicID
    PLLoggerCategory.DOCUMENT.debug("BaseLocalDocumentMetadataSource saveDocument ${docId}")
    if (docId == null or docId.trim().length == 0) {
        docId = "doc" + document.ID.Value
        document.PublicID = docId
    }
    storeDocument(document)
  }
  
  override function searchDocuments( criteria : DocumentSearchCriteria, resultSpec : RemotableSearchResultSpec ) : DocumentSearchResult  {
    return getMatchingDocuments(new DocumentSearchResult(), criteria, resultSpec)
  }

  /** This will find the document by searching through the list of documents
  */
  private function getMatchingDocuments(result : DocumentSearchResult, criteria : DocumentSearchCriteria, resultSpec : RemotableSearchResultSpec) : DocumentSearchResult  {
    var securityTypeWrappers = criteria.DocumentSecurityTypes
    var legalSecurityTypes = new HashSet<DocumentSecurityType>()
    for (securityTypeWrapper in securityTypeWrappers) {
      legalSecurityTypes.add(securityTypeWrapper.DocumentSecurityType)
    }
    var documentFiles = MetadataFiles
    var rowsLeftBeforeStart = resultSpec.getStartRow()
    var totalResults = 0
    var count = 0
    if (documentFiles != null) {
      try {
        for (documentFile in documentFiles) {
          var doc = retrieveDocument(documentFile, false)
          PLLoggerCategory.DOCUMENT.debug("BaseLocalDocumentMetadataSource getMatchingDocuments doc ${doc}")
          if (doc != null
              and (legalSecurityTypes.size() == 0 or legalSecurityTypes.contains(doc.getSecurityType()))
              and documentMatchesCriteria(doc, criteria)) {
            totalResults++
            if (rowsLeftBeforeStart > 0) {
              rowsLeftBeforeStart--
            }
            else if (count >= resultSpec.MaxResults) {
              if (!(resultSpec.IncludeTotal)) {
                break
              }
            }
            else if (not resultSpec.GetNumResultsOnly) {
              count++
              result.addToSummaries( doc )
            }
          }
        }
      }
      catch (e : Exception) {
        throw new RuntimeException(e)
      }
    }
    if (resultSpec.IncludeTotal) {
      result.TotalResults = totalResults
    }
    return result
  }

  /** Given a metadata file, will return the metadata (Document)
  */  
  private function retrieveDocument( metadataFile : File, doThrow : boolean) : Document {
    var xml : InputStream
    try {
      xml = new BufferedInputStream(new FileInputStream(metadataFile))
      var result = DocumentsUtilBase.deserializeXml(xml, Document) as Document
      PLLoggerCategory.DOCUMENT.info("BaseLocalDocumentMetadataSource retrieveDocument id=${result.ID} docUID=${result.DocUID} publicId=${result.PublicID}")
      if (result != null) {
        DocumentsUtilBase.initOriginalValues(result)
        result.setRetrievedFromIDMS()
      }
      return result
    } 
    catch (e : Exception) {
      if (doThrow) {
        throw new RuntimeException(e)
      }
      else {
        PLLoggerCategory.DOCUMENT.warn("Could not get document metadata from " + metadataFile, e)
        return null
      }
    }
    finally {
      if (xml != null) {
        try {
           xml.close()
        } 
        catch (e : Exception) {
          // ignore
          PLLoggerCategory.DOCUMENT.debug("BaseLocalDocumentMetadataSource.storeDocument: " + e.Message, e)
        }
      }
    }
  }
  
  /** This will get the metadata file for the unique id
  */
  private function getMetadataFileForUniqueId(uniqueId : String) : File {
    var strFile = getFilePathForUniqueId(uniqueId, true)
    return new File( strFile )
  }

  /** given the unique id and suffix it will return the appropriate path.  Note suffix should either be 
  */
  function getFilePathForUniqueId(uniqueId : String, metadata : boolean ) : String {
    return appendFileToPath(MetadataDir.CanonicalPath, DocumentsUtilBase.makePortableFileName(uniqueId) + (metadata ? ".xml" : ""))
  }

  /** This will append the file name (public id) to the path
  */
  protected function appendFileToPath(strPath : String, strFile : String) : String {
    if (strPath == null) {
      strPath = ""
    }
    var strSeparator = File.separator
    // if root path already terminated then don't append anything
    if (strPath.endsWith("/") or strPath.endsWith("\\") or strPath.endsWith(File.separator)) {
      strSeparator = ""
    }

    return strPath + strSeparator + strFile
  }

  /** given a document it will store it.
  */
  protected function storeDocument(document : Document) {
    var metadataFile = getMetadataFileForUniqueId(document.PublicID)
    PLLoggerCategory.DOCUMENT.info( "BaseLocalDocumentMetadataSource.store id=${document.ID} docUUD=${document.DocUID} file=${metadataFile}" )
    var output : OutputStream
    try {
      var is = DocumentsUtilBase.serializeDocumentAsXML(document)
      if (not metadataFile.exists()) {
        metadataFile.createNewFile()
      }
      output = new BufferedOutputStream(new FileOutputStream(metadataFile))
      StreamUtil.copy(is, output)
      is.close()
    }
    catch (ex : Exception) {
      throw new RuntimeException(ex)
    }
    finally {
      if (output != null) {
        try {
          output.close()
        }
        catch (e : Exception) {
          // ignore
          PLLoggerCategory.DOCUMENT.debug("BaseLocalDocumentMetadataSource.storeDocument: " + e.Message, e)
        }
      }
    }
  }
}

package gw.wsi.pl

uses gw.api.webservice.importTools.ImportResults
uses gw.api.webservice.importTools.ImportToolsImpl
uses gw.api.webservice.exception.DataConversionException
uses gw.xml.ws.annotation.WsiWebService
uses gw.xml.ws.annotation.WsiAvailability
uses gw.xml.ws.WsiAuthenticationException
uses java.lang.IllegalArgumentException
uses gw.xml.XmlElement
uses gw.api.importing.graph.MapBackedGraph
uses java.io.ByteArrayInputStream
uses gw.api.importing.ImportingUtil
uses gw.transaction.Transaction
uses gw.api.util.DateUtil
uses java.util.HashMap
uses gw.api.webservice.importTools.ImportResultSummary
uses gw.api.webservice.importTools.ImportResultDetail
uses java.util.ArrayList
uses java.lang.Throwable
uses gw.api.archiving.ArchivingUtil
uses gw.api.importing.XmlExporterXmlElement
uses gw.lang.reflect.TypeSystem
uses gw.entity.IEntityType
uses gw.entity.IColumnPropertyInfo
uses gw.xml.ws.annotation.WsiGenInToolkit
uses gw.util.StreamUtil

/**
 * ImportToolsAPI is a remote interface to a set of tools to import XML data to the server.
 * <p/>
 * The XML import format is defined by dynamically-generated XML Schema Definition (XSD) files. Regenerate the XSD
 * files with the regen-xsd task. After XSD regeneration, you will find the XSD files in dist/xsd/import,
 * including the three XSD files: xx_typelists.xsd, xx_entities.xsd, xx_import.xsd (with "xx" replaced by the Guidewire
 * product code, e.g., "cc" for ClaimCenter).
 */
@WsiWebService("http://guidewire.com/pl/ws/gw/wsi/pl/ImportToolsAPI")
@WsiAvailability(MAINTENANCE)
@WsiGenInToolkit
@Export
class ImportToolsAPI {

  /**
   * Import XML.  This will either import from xml conforming to either archive's import xsd, or from xx_import xsd.
   * This is an inefficient process, since the xml will be writen out and reparsed by sax.  But it can make
   * the determination of which import to use, based solely on xml.
   *
   * Note that importing data through this call does not generate events for the newly imported objects.
   * <p>
   * <b>WARNING</b>: this is <em>only</em> supported for administrative database tables (such as User)
   * because these XML import routines do not perform complete data validation tests on imported data.
   * Any other use (claims, policies, etc) is dangerous and is <b>NOT</b> supported
   *
   * @param xml The data to import.    This may not be null or empty.
   * @return Set of results of the import (number of entities imported by type, and so on).  If the import failed,
   *         ImportResults will have the ok flag set to <code>false</code>, and the errorLog element will
   *         contain descriptions of the errors that were encountered.
   */
  @Throws(DataConversionException, "If the data can't be imported because it violates duplicate key constraints, contains nulls in non-nullable fields, or otherwise can't be safely inserted into the database.")
  @Throws(IllegalArgumentException, "If xml is null or empty.")
  @Throws (WsiAuthenticationException, "if the caller does not have soapadmin permission") 
  public function importXml(xml : XmlElement) : ImportResults {
    if (xml == null) {
      throw new IllegalArgumentException("xml")
    }
    if (xml.$QName.NamespaceURI == ImportingUtil.ENVELOPE_EL.NamespaceURI
        || xml.$QName.NamespaceURI == ArchivingUtil.ARCHIVE_EL.NamespaceURI) {
      return importArchiveXmlData(xml.asUTFString())
    }
    else {
      return importXmlData(xml.asUTFString())
    }
  }

  /**
   * Import XML data, the string must be utf-8.
   *
   * Note that importing data through this call does not generate events for the newly imported objects.
   * <p>
   * <b>WARNING</b>: this is <em>only</em> supported for administrative database tables (such as User)
   * because these XML import routines do not perform complete data validation tests on imported data.
   * Any other use (claims, policies, etc) is dangerous and is <b>NOT</b> supported
   *
   * @param xmlData The data to import, passed as a String.    This may not be null or empty.
   * @return Set of results of the import (number of entities imported by type, and so on).  If the import failed,
   *         ImportResults will have the ok flag set to <code>false</code>, and the errorLog element will
   *         contain descriptions of the errors that were encountered.
   */
  @Throws(IllegalArgumentException, "If xmlData is null or empty.")
  @Throws (WsiAuthenticationException, "if the caller does not have soapadmin permission") 
  public function importArchiveXmlData(xmlData : String) : ImportResults {
    if (xmlData == null || xmlData.trim().length == 0) {
      throw new IllegalArgumentException("xmlData")
    }
    return importArchiveXmlDataAsByteArray(StreamUtil.toBytes(xmlData))
  }

  /**
   * Import XML data, passing the data as an array of UTF-8 bytes representing the XML string.
   * To improve performance, the XML data string can be wrapped with CDATA tags.
   * For example:
   * <pre>&lt;![CDATA[<br>
   *   ...import XML...<br>
   * ]]></pre>
   *
   * Note that importing data through this call does not generate events for the newly imported objects.
   * <p>
   * <b>WARNING</b>: this is <em>only</em> supported for administrative database tables (such as User)
   * because these XML import routines do not perform complete data validation tests on imported data.
   * Any other use (claims, policies, etc) is dangerous and is <b>NOT</b> supported
   *
   * @see #importXmlData(String)
   * @param xmlData The data to import, passed as a byte[] for the UTF-8 bytes representing the XML string.    This may not be null or empty.
   * @return Set of results of the import (number of entities imported by type, and so on).  If the import failed,
   *         ImportResults will have the ok flag set to <code>false</code>, and the errorLog element will
   *         contain descriptions of the errors that were encountered.
   */
  @Throws(DataConversionException, "If the data can't be imported because it violates duplicate key constraints, contains nulls in non-nullable fields, or otherwise can't be safely inserted into the database.")
  @Throws(IllegalArgumentException, "If xmlData is null or empty.")
  @Throws (WsiAuthenticationException, "if the caller does not have soapadmin permission") 
  public function importArchiveXmlDataAsByteArray(xmlData : byte[]) : ImportResults {
    if (xmlData == null || xmlData.Count == 0) {
      throw new IllegalArgumentException("xmlData")
    }
    var rtn = new ImportResults()
    var summaries = new HashMap<String, ImportResultSummary>()
    var details = new ArrayList<ImportResultDetail>()
    var date = DateUtil.currentDate()
    var graph = new MapBackedGraph("xmlData", new ByteArrayInputStream(xmlData))
    rtn.Ok = true
    rtn.ParseTime = DateUtil.currentDate().Time - date.Time
    date = DateUtil.currentDate()
    try {
      Transaction.runWithNewBundle(\ bundle -> {
        var results = ImportingUtil.processImport(graph, true, bundle)
        for (bean in results.Values)  {
          var entityTypeName = bean.ID.Type.RelativeName
          var sum = summaries.get(entityTypeName)
          if (sum == null) {
            sum = new ImportResultSummary()
            sum.Type = ImportResults.INSERTED
            sum.EntityName = entityTypeName
            summaries.put(entityTypeName, sum)
          }
          sum.Count ++
          var detail = new ImportResultDetail()
          detail.Type = ImportResults.INSERTED
          detail.EntityName = entityTypeName
          detail.ExternalID = bean.PublicID
          detail.InternalID = bean.ID.Value
          detail.ExternalSource = "ImportToolsAPI"
          details.add(detail)
        }
      });
    }
    catch (t : Throwable) {
      var errors = new ArrayList<String>()
      errors.add((typeof t).Name)
      errors.add(t.Message)
      for (stack in t.StackTrace) {
        errors.add(stack as String)
      }
      rtn.Ok = false
      rtn.ErrorLog =  errors.toTypedArray()
    }
    rtn.Summaries = summaries.Values.toTypedArray()
    rtn.Details = details.toTypedArray()
    rtn.WriteTime = DateUtil.currentDate().Time - date.Time
    return rtn      
  }

  /**
   * Export XML
   * 
   * @param xmlData The data to import, passed as a byte[] for the UTF-8 bytes representing the XML string.    This may not be null or empty.
   * @return Set of results of the import (number of entities imported by type, and so on).  If the import failed,
   *         ImportResults will have the ok flag set to <code>false</code>, and the errorLog element will
   *         contain descriptions of the errors that were encountered.
   */
  @Throws(DataConversionException, "If the data can't be imported because it violates duplicate key constraints, contains nulls in non-nullable fields, or otherwise can't be safely inserted into the database.")
  @Throws(IllegalArgumentException, "If xmlData is null or empty.")
  @Throws (WsiAuthenticationException, "if the caller does not have soapadmin permission") 
  public function exportXml(entities : ExportEntities[]) : XmlElement {
    var writer = new XmlExporterXmlElement()
    Transaction.runWithNewBundle(\ bundle -> {
      for (entity in entities) {        
        var type = TypeSystem.getByRelativeName(entity.TypeName) as IEntityType
        for (publicId in entity.PublicIds) {
          var bean = bundle.loadByPublicId(type, publicId)
          if (bean != null) {
            writer.add(bean)
          }
        }
      }
      writer.finishExport(bundle)
    })
    return writer.Envelope
  }

  /**
   * Import XML data.
   * To improve performance, the XML data string can be wrapped with CDATA tags.
   * For example:
   * <pre>&lt;![CDATA[<br>
   *   ...import XML...<br>
   * ]]></pre>
   *
   * Note that importing data through this call does not generate events for the newly imported objects.
   * <p>
   * <b>WARNING</b>: this is <em>only</em> supported for administrative database tables (such as User)
   * because these XML import routines do not perform complete data validation tests on imported data.
   * Any other use (claims, policies, etc) is dangerous and is <b>NOT</b> supported
   *
   * @param xmlData The data to import, passed as a String.    This may not be null or empty.
   * @return Set of results of the import (number of entities imported by type, and so on).  If the import failed,
   *         ImportResults will have the ok flag set to <code>false</code>, and the errorLog element will
   *         contain descriptions of the errors that were encountered.
   */
  @Throws(DataConversionException, "If the data can't be imported because it violates duplicate key constraints, contains nulls in non-nullable fields, or otherwise can't be safely inserted into the database.")
  @Throws(IllegalArgumentException, "If xmlData is null or empty.")
  @Throws (WsiAuthenticationException, "if the caller does not have soapadmin permission") 
  public function importXmlData(xmlData : String) : ImportResults {
    if (xmlData == null || xmlData.trim().length == 0) {
      throw new IllegalArgumentException("xmlData")
    }
    return importXmlDataAsByteArray(StreamUtil.toBytes(xmlData))
  }

  /**
   * Import XML data, passing the data as an array of UTF-8 bytes representing the XML string.
   * To improve performance, the XML data string can be wrapped with CDATA tags.
   * For example:
   * <pre>&lt;![CDATA[<br>
   *   ...import XML...<br>
   * ]]></pre>
   *
   * Note that importing data through this call does not generate events for the newly imported objects.
   * <p>
   * <b>WARNING</b>: this is <em>only</em> supported for administrative database tables (such as User)
   * because these XML import routines do not perform complete data validation tests on imported data.
   * Any other use (claims, policies, etc) is dangerous and is <b>NOT</b> supported
   *
   * @see #importXmlData(String)
   * @param xmlData The data to import, passed as a byte[] for the UTF-8 bytes representing the XML string.    This may not be null or empty.
   * @return Set of results of the import (number of entities imported by type, and so on).  If the import failed,
   *         ImportResults will have the ok flag set to <code>false</code>, and the errorLog element will
   *         contain descriptions of the errors that were encountered.
   */
  @Throws(DataConversionException, "If the data can't be imported because it violates duplicate key constraints, contains nulls in non-nullable fields, or otherwise can't be safely inserted into the database.")
  @Throws(IllegalArgumentException, "If xmlData is null or empty.")
  @Throws (WsiAuthenticationException, "if the caller does not have soapadmin permission") 
  public function importXmlDataAsByteArray(xmlData : byte[]) : ImportResults {
    if (xmlData == null || xmlData.Count == 0) {
      throw new IllegalArgumentException("xmlData")
    }
    var rtn : ImportResults
    Transaction.runWithNewBundle(\ bundle -> {
      rtn = new ImportToolsImpl().importXmlDataAsByteArray( xmlData )
    });
    return rtn      
  }

  /**
   * Import CSV data.
   *
   * Note that importing data through this call does not generate events for the newly imported objects.
   * <p>
   * <b>WARNING</b>: this is <em>only</em> supported for administrative database tables (such as User)
   * because these XML import routines do not perform complete data validation tests on imported data.
   * Any other use (claims, policies, etc) is dangerous and is <b>NOT</b> supported
   *
   * @param csvData The data to import, passed as a String.  This may not be null.
   * @return Set of results of the import (number of entities imported by type, and so on).  If the import failed,
   *         ImportResults will have the ok flag set to <code>false</code>, and the errorLog element will
   *         contain descriptions of the errors that were encountered.
   */
  @Throws(DataConversionException, "If the data can't be imported because it violates duplicate key constraints, contains nulls in non-nullable fields, or otherwise can't be safely inserted into the database.")
  @Throws(IllegalArgumentException, "If csvData is null.")
  @Throws (WsiAuthenticationException, "if the caller does not have soapadmin permission") 
  public function importCsvData(csvData : String, dataSet : int, ignoreNullConstraintViolations : boolean, ignoreAllErrors : boolean) : ImportResults {
    if (csvData == null || csvData.trim().length == 0) {
      throw new IllegalArgumentException("csvData")
    }
    var rtn : ImportResults
    Transaction.runWithNewBundle(\ bundle -> {
      rtn = new ImportToolsImpl().importCsvData( csvData, dataSet, ignoreNullConstraintViolations, ignoreAllErrors )
    });
    return rtn      
  }

  /**
   * Convert CSV data to XML data suitable to be imported {@link #importXmlData(String)}
   *
   * @param csvData                        A String containing CSV data
   * @param dataSet                        An int defining the number of the dataset to be imported.  Datasets are ordered by inclusion, and
   *                                       the smallest dataset is always numbered 0.  Thus Dataset 0 is a subset of dataset 1, and datatset 1
   *                                       is a subset of dataset 2, etc.  If this param is set to -1, all data will be imported.
   * @param ignoreNullConstraintViolations Whether to continue after detecting an empty field in the CSV that
   *                                       corresponds to a property that is not nullable.  If false, throws an exception in this situation.
   * @param ignoreAllErrors
   * @return a String containing equivalent import data in XML format, suitable for import by #importXmlData(String)
   */
  @Throws (WsiAuthenticationException, "if the caller does not have soapadmin permission") 
  @Throws(IllegalArgumentException, "If csvData is null.")
  public function csvToXml(csvData : String, dataSet : int, ignoreNullConstraintViolations : boolean, ignoreAllErrors : boolean) : String {
    if (csvData == null || csvData.trim().length == 0) {
      throw new IllegalArgumentException("csvData")
    }
    return new ImportToolsImpl().csvToXml( csvData, dataSet, ignoreNullConstraintViolations, ignoreAllErrors )
  }

  /**
   * Export XML data into CSV data.  The reverse operation from #csvToXml(String)
   *
   * @param xmlData String containing CSV data
   * @return a String containing equivalent import data in CSV format.  The result of calling csvToXml on the result
   *         should be an equivalent XML document to #xmlData.
   */
  @Throws (WsiAuthenticationException, "if the caller does not have soapadmin permission") 
  @Throws(IllegalArgumentException, "If csvData is null.")
  public function xmlToCsv(xmlData : String) : String {
    if (xmlData == null || xmlData.trim().length == 0) {
      throw new IllegalArgumentException("xmlData")
    }
    return new ImportToolsImpl().xmlToCsv( xmlData)
  }

  /**
   * Rebuild the role privileges data by deleting the priviliges data in the database, and then
   * re-importing the roleprivileges.csv file.
   */
  @Throws (WsiAuthenticationException, "if the caller does not have soapadmin permission") 
  public function rebuildRolePrivileges() {
    Transaction.runWithNewBundle(\ bundle -> {
      new ImportToolsImpl().rebuildRolePrivileges()
    });
  }

}

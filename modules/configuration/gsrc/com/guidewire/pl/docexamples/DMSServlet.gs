package com.guidewire.pl.docexamples

/**
 * This servlet is acting as an external dms for testing and demoing purposes only.
 * Not intended for production, nor as the base for production implementation
 *
 */

uses java.io.BufferedInputStream
uses java.io.BufferedOutputStream
uses java.io.File
uses java.io.FileInputStream
uses java.io.FileOutputStream
uses java.lang.Integer
uses java.lang.Long
uses java.lang.RuntimeException
uses java.lang.StringBuffer
uses java.lang.System
uses java.lang.Thread
uses java.lang.Throwable
uses java.net.URLEncoder
uses java.net.URLDecoder
uses java.sql.PreparedStatement
uses java.sql.DriverManager
uses java.sql.Connection
uses java.util.ArrayList
uses java.util.Arrays
uses java.util.Date
uses java.util.concurrent.ConcurrentHashMap
uses javax.servlet.http.HttpServlet;
uses javax.servlet.http.HttpServletRequest;
uses javax.servlet.http.HttpServletResponse;
uses javax.servlet.ServletConfig
uses javax.servlet.ServletException;
uses gw.api.system.PLLoggerCategory
uses gw.document.documentdto.anonymous.elements.DocumentList_Document
uses gw.document.documentdto.Document
uses gw.document.documentdto.Documents
uses gw.document.DocumentsUtilBase
uses gw.pl.util.FileUtil
uses gw.servlet.Servlet
uses gw.servlet.ServletUtils
uses gw.util.Base64Util
uses gw.util.Pair
uses gw.util.StreamUtil

@Export
@Servlet(\ path -> path.matches("/dms/(.*)"))
class DMSServlet extends HttpServlet {

  public static final var ATTRIB_DOC_PUBLICID_PARAM: String = "Document.PublicID"
  public static final var ATTRIB_JOIN_TABLE_TYPE: String = "JoinTable.Type"
  public static final var ATTRIB_JOIN_TABLE_PROPERTY: String = "JoinTable.JoinedProperty"
  public static final var ATTRIB_JOINED_PUBLICID: String = "Joined.PublicID"
  private var _purgeableUrl: String

  enum PropType { String, Date, Other }
  var _dbDriver = "org.h2.Driver"
  var _dbURL : String;
  var _dbUsername = "sa"
  var _dbPassword = "sa"
  var _urlRoot : String

  var _rootPath = "/tmp/dms"
  var _rootDir : File
  static var docTableStr = "CREATE TABLE IF NOT EXISTS Doc (Id BIGINT PRIMARY KEY AUTO_INCREMENT, PublicId VARCHAR UNIQUE, Name VARCHAR, MimeType VARCHAR  );"
  static var propertyTableStr = "CREATE TABLE IF NOT EXISTS Property (Id BIGINT PRIMARY KEY AUTO_INCREMENT, Name VARCHAR UNIQUE, PropType VARCHAR );"
  static var docPropTableStr = "CREATE TABLE IF NOT EXISTS DocProp (Id BIGINT PRIMARY KEY AUTO_INCREMENT, DocId BIGINT, PropertyId BIGINT, LinkPublicId VARCHAR, StringValue VARCHAR_IGNORECASE, DateValue TIMESTAMP, FOREIGN KEY(DocId) REFERENCES Doc(Id) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY(PropertyId) REFERENCES Property(Id), UNIQUE (DocId, PropertyId, LinkPublicId));"
  static var docInsertStr = "INSERT INTO Doc ( PublicId, Name, MimeType ) VALUES (?, ?, ? )";
  static var docSetStr = "UPDATE Doc SET Name = ?, MimeType = ? WHERE PublicId = ?";
  static var docDeleteStr = "DELETE FROM Doc WHERE PublicId = ?";
  static var maxIdStr = "SELECT MAX(Id) FROM Doc";
  static var docQueryStr = "SELECT Name, MimeType FROM Doc WHERE PublicId = ?"
  static var propInsertStr = "INSERT INTO Property ( Name, PropType ) VALUES (?, ?)";
  static var propQueryStr = "SELECT Id, PropType FROM Property WHERE Name = ?";
  static var seenPropQueryStr = "SELECT Id, Name, PropType FROM Property";
//  static var propAllQueryStr = "SELECT Name, PropType FROM Property";
  static var docPropInsertStr = "INSERT INTO DocProp ( DocId, PropertyId, StringValue, DateValue, LinkPublicId ) VALUES (SELECT Id FROM Doc WHERE PublicId = ?, SELECT Id From Property WHERE Name = ?, ?, ?, ?)";
  static var docPropDeleteStr = "DELETE FROM DocProp WHERE DocId = (SELECT Id FROM Doc WHERE PublicId = ?) AND PropertyId = (SELECT Id From Property WHERE Name = ?) AND StringValue = ?";
  static var clearDocPropDeleteStr = "DELETE FROM DocProp WHERE DocId = (SELECT Id FROM Doc WHERE PublicId = ?) AND LinkPublicId = ?";
  static var docPropQueryStr = "SELECT Id FROM DocProp WHERE DocId = (SELECT Id FROM Doc WHERE PublicId = ?) AND PropertyId = (SELECT Id From Property WHERE Name = ?) AND StringValue = ?";
  static var findLinkPropQueryStr = "SELECT StringValue FROM DocProp WHERE DocId = (SELECT Id FROM Doc WHERE PublicId = ?) AND PropertyId = (SELECT Id From Property WHERE Name = ?)";

  var _props = new ConcurrentHashMap<String, Pair<Integer,String>>()
  var _interval : long = 0
  var _highWater = 0

  private function handleLogin(req : HttpServletRequest, resp : HttpServletResponse) : User{
    PLLoggerCategory.DOCUMENT.debug("DMSServlet-login req.QueryString='" + req.QueryString + "'")

    // SESSION AUTH : Get user from session if the client is already signed in.
    var user = ServletUtils.getAuthenticatedUser(req, true)
    PLLoggerCategory.DOCUMENT.debug("DMSServlet-login getAuthUser=" + user?.DisplayName)

    // HTTP BASIC AUTH : If the session user cannot be authenticated, try HTTP Basic
    if (user == null) {
      try {
        user = gw.servlet.ServletUtils.getBasicAuthenticatedUser(req)
        PLLoggerCategory.DOCUMENT.debug("DMSServlet-login getBasicUser=" + user?.DisplayName)
      }
      catch (e : Throwable) {
        resp.sendError(HttpServletResponse.SC_UNAUTHORIZED,
            "Unauthorized. HTTP Basic authentication error.")
        PLLoggerCategory.DOCUMENT.info("DMSServlet-login getBasicUser", e)
        return null // Be sure to RETURN early because authentication failed!
      }
    }
    if (user == null) {
      var username = req.getParameter("username")
      var password = req.getParameter("password")
      if (username != null && password != null) {
        try {
          user = ServletUtils.login(req, username, password)
        }
        catch (e : Throwable) {
          resp.sendError(HttpServletResponse.SC_UNAUTHORIZED,
              "Unauthorized. username & password.")
          PLLoggerCategory.DOCUMENT.info("DMSServlet-login login", e)
          return null // Be sure to RETURN early because authentication failed!
        }
      }
    }
    if (user == null) {
      resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized. No valid user info.")
      PLLoggerCategory.DOCUMENT.info("DMSServlet-login no info in queryString='" + req.QueryString + "'")
    }
    return user
  }

  override function doGet(req: HttpServletRequest, resp: HttpServletResponse) {
    var path = req.PathInfo.substring("/dms/".length)
    PLLoggerCategory.DOCUMENT.debug("DMSServlet-doGet path='" + path + "'")
    if (path.startsWith("sleep")) {
      var param = req.ParameterMap.get("minutes")
      if (param == null ) {
        resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Should have \"minutes\" parameter")
        return
      }
      _interval = Long.parseLong(param[0])
      resp.setStatus(HttpServletResponse.SC_OK)
      resp.setContentType("text/plain")
      resp.OutputStream.print("Will wait " + _interval + " minutes for each non sleep request")
      resp.OutputStream.flush()
      return
    }
    if (_interval > 0) {
      PLLoggerCategory.DOCUMENT.debug("DMSServlet-doGet sleeping for " + _interval)
      Thread.sleep(_interval * 60 * 1000)
      PLLoggerCategory.DOCUMENT.debug("DMSServlet-doGet awake")
    }
    if (path == "ping") {
      resp.setStatus(HttpServletResponse.SC_OK)
      resp.setContentType("text/plain")
      return
    }
    if (path == "clean") {
      PLLoggerCategory.DOCUMENT.debug("DMSServlet-clean")
      if (_dbURL == _purgeableUrl) {
        try {
          FileUtil.clearDir(_rootDir)
          rebuildDatabase()
        }
        catch (t : Throwable) {
          PLLoggerCategory.DOCUMENT.info("DMSServlet-clean caught", t)
        }
      }
      resp.setStatus(HttpServletResponse.SC_OK)
      resp.setContentType("text/plain")
      return
    }
    if (path.matches("metadata[/]*") && req.ParameterMap.Empty) {
      DocumentsUtilBase.createXmlTemplate().writeTo(resp.OutputStream)
      resp.setStatus(HttpServletResponse.SC_OK)
      resp.setContentType("text/xml")
      resp.OutputStream.flush()
      return
    }
    if (path.startsWith("content/")) {
      doGetContent(path.substring("content/".length), req, resp)
      return
    }
    if (path == "addLinkProperty") {
      doProperty(req, resp, Which.Add)
      return
    }
    if (path == "removeLinkProperty") {
      doProperty(req, resp, Which.Delete)
      return
    }
    if (path == "findLinkProperty") {
      doProperty(req, resp, Which.Find)
      return
    }
    if (path == "isLinkProperty") {
      doProperty(req, resp, Which.Test)
      return
    }
    if (path.startsWith("metadata")) {
      var user = handleLogin(req, resp)
      if (user == null) {
        return // not user found
      }
      if (req.ParameterMap.Empty) {
        doGetMetadata(path.substring("metadata/".length), req, resp)
      }
      else {
        doSearch(req, resp)
      }
    }
    else {
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST)
    }
  }

  private function doGetContent(path : String, req: HttpServletRequest, resp: HttpServletResponse) {
    path = URLDecoder.decode(path, "utf-8")
    var pos = path.indexOf("/")
    var publicId = path.substring(0, pos)
    var fileName = path.substring(pos + 1)
    if (fileName.contains("FailGetContent")) {
      PLLoggerCategory.DOCUMENT.info("DMSServlet-doGetContent for " + publicId + " file name forces failure=" + fileName)
      resp.setStatus(HttpServletResponse.SC_BAD_REQUEST)
      resp.setContentType("text/plain")
      return
    }
    PLLoggerCategory.DOCUMENT.debug("DMSServlet-doGetContent looking publicId=" + publicId + " file=" + fileName )
    try {
      using(var conn = getConnection()) {
        using (var stmt = conn.prepareStatement(docQueryStr)) {
          stmt.setString(1, publicId)
          using (var rs = stmt.executeQuery()) {
            if (rs.next()) {
              var file = new File(_rootDir, encode(publicId) + "/" + fileName)
              if (file.exists()) {
                var mimeType = rs.getString(2) == null ? "application/octet-stream" : rs.getString(2)
                resp.ContentType = mimeType
                using (var is = new BufferedInputStream(new FileInputStream(file))) {
                  var os = new BufferedOutputStream(resp.OutputStream)
                  StreamUtil.copy(is, os)
                  os.flush()
                  return
                }
              }
              else {
                PLLoggerCategory.DOCUMENT.debug("DMSServlet-doGetContent file does not exist file=" + file )
              }
            }
            else {
              PLLoggerCategory.DOCUMENT.debug("DMSServlet-doGetContent no result set publicId=" + publicId )
            }
          }
        }
      }
    }
    catch (e : Throwable) {
      PLLoggerCategory.DOCUMENT.error("DMSServlet-doGetContent failed on PublicId=" + publicId, e )
      if (!resp.Committed) {
        resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
      }
      return
    }
    resp.sendError(HttpServletResponse.SC_NOT_FOUND)
  }

  private function doGetMetadata(path : String, req: HttpServletRequest, resp: HttpServletResponse) {
    var publicId = URLDecoder.decode(path, "utf-8")
    PLLoggerCategory.DOCUMENT.debug("DMSServlet-doGetMetadata looking for " + publicId)
    var xml = prepareXML(publicId)
    if (xml != null) {
      if (xml.Name.contains("FailGetMetadata")) {
        PLLoggerCategory.DOCUMENT.info("DMSServlet-doGetMetadata for " + publicId + " file name forces failure=" + xml.Name)
        resp.setStatus(HttpServletResponse.SC_BAD_REQUEST)
        resp.setContentType("text/plain")
        return
      }
      resp.setStatus(HttpServletResponse.SC_OK)
      resp.setContentType("text/xml")
      var os = new BufferedOutputStream(resp.OutputStream)
      xml.writeTo(os)
      os.flush()
      return
    }
    else {
     PLLoggerCategory.DOCUMENT.debug("DMSServlet-doGetMetadata could not find xml for publicId=" + publicId)
    }
    resp.sendError(HttpServletResponse.SC_NOT_FOUND)
  }

  private function prepareXML(publicId : String) : Document {
    var file = new File(_rootDir, encode(publicId) + ".xml")
    var xml : Document
    if (file.exists()) {
      xml = Document.parse(new BufferedInputStream(new FileInputStream(file)))
      if (xml != null && publicId != null && xml.Name != null) {
        xml.URL = _urlRoot + xml.DocUID
      }
// TODO PL-34167 Can I create the join table elements?
    }
    return xml
  }

  private enum Which { Add, Delete, Find, Test };

  private function doProperty(req: HttpServletRequest, resp: HttpServletResponse, which : Which) {
    var user = handleLogin(req, resp)
    if (user == null) {
      return
    }
    PLLoggerCategory.DOCUMENT.debug("DMSServlet-doProperty " + which + " with " + req.ParameterMap)
    if (req.ParameterMap.Empty) {
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "No info provided")
      return
    }
    var work = req.ParameterMap.get(ATTRIB_DOC_PUBLICID_PARAM)
    if (work == null || work.length != 1) {
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Single Document.PublicID required")
      return
    }
    var publicId = work[0]
    var docName = lookupDocName(publicId, resp);
    if (docName == null) {
      resp.sendError(HttpServletResponse.SC_NOT_FOUND, "No Document with PublicID " + publicId)
      return
    }
    if (docName.contains("FailPropertyAdd") && which == Add) {
      PLLoggerCategory.DOCUMENT.info("DMSServlet-doProperty Add for " + publicId + " file name forces failure")
      resp.setStatus(HttpServletResponse.SC_BAD_REQUEST)
      resp.setContentType("text/plain")
      return
    }
    if (docName.contains("FailPropertyRemove") && which == Delete) {
      PLLoggerCategory.DOCUMENT.info("DMSServlet-doProperty Delete for " + publicId + " file name forces failure")
      resp.setStatus(HttpServletResponse.SC_BAD_REQUEST)
      resp.setContentType("text/plain")
      return
    }
    if (docName.contains("FailPropertyFind") && which == Find) {
      PLLoggerCategory.DOCUMENT.info("DMSServlet-doProperty Find for " + publicId + " file name forces failure")
      resp.setStatus(HttpServletResponse.SC_BAD_REQUEST)
      resp.setContentType("text/plain")
      return
    }
    work = req.ParameterMap.get(ATTRIB_JOIN_TABLE_TYPE)
    if (work == null || work.length != 1) {
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "JoinTable.Type required")
      return
    }
    var joinTableType = work[0]
    work = req.ParameterMap.get(ATTRIB_JOIN_TABLE_PROPERTY)
    if (work == null || work.length != 1) {
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "JoinTable.JoinedProperty required")
      return
    }
    var joinTableProperty = work[0]
    var attribName = joinTableType + "." + joinTableProperty

    if (which == which.Find) {
      using (var conn = getConnection()) {
        using (var stmt = conn.prepareStatement(findLinkPropQueryStr)) {
          stmt.setString(1, publicId)
          stmt.setString(2, attribName)
          using (var rs = stmt.executeQuery()) {
            using (var os = new BufferedOutputStream(resp.OutputStream)) {
              resp.setStatus(HttpServletResponse.SC_OK)
              resp.setContentType("text/xml")
              while (rs.next()) {
                os.write(StreamUtil.toBytes(rs.getString(1)));
                os.write(StreamUtil.toBytes("\n"));
              }
              os.flush()
            }
          }
        }
      }
      return
    }

    work = req.ParameterMap.get(ATTRIB_JOINED_PUBLICID)
    if (work == null || work.length != 1) {
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Joined.PublicID required")
      return
    }
    var joinedPublicId = work[0]
    var alreadyExists = lookupLink(publicId, attribName, joinedPublicId, resp)
    if (which == Test) {
      resp.setStatus(HttpServletResponse.SC_OK)
      resp.setContentType("text/xml")
      resp.OutputStream.print(alreadyExists)
      resp.OutputStream.flush()
      return
    }
    if (which == Add) {
      if (alreadyExists) {
        resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Document.PublicID " + publicId + " Joined.PublicID " + joinedPublicId + " already exists")
      }
      else {
        using (var conn = getConnection()) {
          var insertPropStmt = conn.prepareStatement(propInsertStr)
          var queryPropStmt = conn.prepareStatement(propQueryStr)
          var insertDocPropStmt = conn.prepareStatement(docPropInsertStr)
          populateProperties(publicId, attribName,
              joinedPublicId, PropType.Other,
              insertDocPropStmt,
              insertPropStmt,
              queryPropStmt,
              joinedPublicId)
        }
      }
      return
    }
    if (which == Delete) {
      if (!alreadyExists) {
        resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Document.PublicID " + publicId + " Joined.PublicID " + joinedPublicId + " does not exists")
      }
      else {
        using (var conn = getConnection(),
               var deletePropStmt = conn.prepareStatement(docPropDeleteStr)) {
          deletePropStmt.setString(1, publicId)
          deletePropStmt.setString(2, attribName)
          deletePropStmt.setString(3, joinedPublicId)
          deletePropStmt.executeUpdate()
        }
      }
      return
    }
  }

  private function doSearch(req: HttpServletRequest, resp: HttpServletResponse) {
    PLLoggerCategory.DOCUMENT.debug("DMSServlet-doSearch looking for " + req.ParameterMap)
    var failedCriteriaExists = false
    var docs = new Documents()
    var countOnly = false
    var startRow = 0
    var maxRows = Integer.MAX_VALUE
    var n = 0
    var fromBuf = new StringBuffer()
    fromBuf.append("SELECT DISTINCT D.PublicId FROM Doc D")
    var whereBuf = new StringBuffer()
    for (entry in req.ParameterMap.entrySet()) {
      var entryValue = entry.Value as String[]
      if (entry.Key == "_GetNumResultsOnly") {
        if (entry.Value.Count == 1 && "true" == entry.Value[0]) {
          countOnly = true
        }
        continue
      }
      if (entry.Key == "_IncludeTotal") {
        // always
        continue
      }
      if (entry.Key == "_StartRow") {
        if (entry.Value.Count == 1) {
          startRow = Integer.valueOf(entry.Value[0])
        }
        continue
      }
      if (entry.Key == "_SortColumns") {
        if (entry.Value.Count != 0) {
          PLLoggerCategory.DOCUMENT.debug("DMSServlet-doSearch not supported key=" + entry.Key + " value=" + Arrays.asList(entryValue))
//        if (entry.Value != null) {
//          sortColumns = entry.Value;
//        }
        }
        continue
      }
      if (entry.Key == "_MaxResults") {
        if (entry.Value.Count == 1) {
          maxRows = Integer.valueOf(entry.Value[0])
        }
        continue
      }
      var info = _props.get(entry.Key)
      if (info == null) {
        PLLoggerCategory.DOCUMENT.warn("DMSServlet-doSearch not found key=" + entry.Key)
        failedCriteriaExists = true
        continue
      }
      var entryvalue = entryValue as String[]
      if (entryvalue == null || entryvalue.Count == 0 || entryvalue[0] == null)  {
        continue
      }
      fromBuf.append(", DocProp DP${n}")
      if (n == 0) {
        whereBuf.append(" WHERE")
      }
      else {
        whereBuf.append(" AND")
      }
      var propId = info.First
      whereBuf.append(" DP${n}.DocId = D.Id")
      if (info.Second == PropType.Date.Code) {
        var dates = URLDecoder.decode(entryvalue[0], "utf-8").split(",", 2)
        if (dates[0].Empty) {
          whereBuf.append(" AND DP${n}.PropertyId = ${propId} AND DP${n}.DateValue <= '${dates[1]}'")
        }
        else if (dates[1].Empty) {
          whereBuf.append(" AND DP${n}.PropertyId = ${propId} AND DP${n}.DateValue >= '${dates[0]}'")
        }
        else {
          whereBuf.append(" AND DP${n}.PropertyId = ${propId} AND DP${n}.DateValue BETWEEN '${dates[0]}' AND '${dates[1]}'")
        }
      }
      else if (info.Second == PropType.Other.Code) {
        if (entry.Key == "SecurityType") {
          whereBuf.append(" AND DP${n}.PropertyId = ${propId} AND (DP${n}.StringValue IS NULL OR DP${n}.StringValue IN ('")
              .append(entryValue.map(\elt -> URLDecoder.decode(elt, "UTF-8")).join("','"))
              .append("'))")
        }
        else if (entry.Key == "DocUID") {
          whereBuf.append(" AND DP${n}.PropertyId = ${propId} AND DP${n}.StringValue = '${entry.Value[0]}'")
        }
        else {
          for (value in entryValue) {
            var val = URLDecoder.decode(value, "UTF-8")
            if (val.startsWith("!")) {
              whereBuf.append(" AND NOT D.Id IN (SELECT DocId FROM DocProp DP${n} WHERE DP${n}.StringValue = '${val.substring(1)}' AND DP${n}.PropertyId = ${propId})")
            }
            else {
              whereBuf.append(" AND DP${n}.PropertyId = ${propId} AND DP${n}.StringValue = '${val}'")
            }
          }
        }
      }
      else {
        var val = URLDecoder.decode(entryValue[0], "UTF-8")
        if (val.contains("FailSearch")) {
          PLLoggerCategory.DOCUMENT.info("DMSServlet-doSearch property value forces failure=" + val)
          resp.setStatus(HttpServletResponse.SC_BAD_REQUEST)
          resp.setContentType("text/plain")
          return
        }
        whereBuf.append(" AND DP${n}.PropertyId = ${propId} AND DP${n}.StringValue LIKE '%${val}%'")
      }
      n++
    }
    if (failedCriteriaExists && whereBuf.length() == 0) {
      PLLoggerCategory.DOCUMENT.error("DMSServlet-doSearch nothing loaded yet or unknown criteria " + req.ParameterMap )
//      resp.sendError(HttpServletResponse.SC_BAD_REQUEST)
//      return
    }
    try {
     var ids = new ArrayList<String>()
      using (var conn = getConnection()) {
        PLLoggerCategory.DOCUMENT.debug("DMSServlet-doSearch \n\tfromBuf=" + fromBuf.toString() + "\n\twhereBuf=" + whereBuf.toString())
        using (var stmt = conn.prepareStatement(fromBuf.toString() + whereBuf.toString()),
               var rs = stmt.executeQuery()) {
          while (rs.next()) {
            ids.add(rs.getString(1))
          }
        }
      }
      docs.Start = startRow
      docs.End = 0
      docs.Total = ids.Count
      if (!countOnly) {
        var ndx = 0;
        for (publicId in ids) {
          ndx++
          if (ndx > startRow) {
            maxRows--
            if (maxRows < 0) {
              break;
            }
            var doc = prepareXML(publicId)
            if (doc != null) {
              PLLoggerCategory.DOCUMENT.debug("DMSServlet-doSearch publicId=" + publicId + " doc.DocUID=" + doc.DocUID)
              docs.Document.add(new DocumentList_Document(doc.$TypeInstance))
              docs.End = ndx
            } else {
              PLLoggerCategory.DOCUMENT.debug("DMSServlet-doSearch could not find xml for publicId=" + publicId)
            }
          }
        }
      }
      resp.setStatus(HttpServletResponse.SC_OK)
      resp.setContentType("text/xml")
      var os = new BufferedOutputStream(resp.OutputStream)
      docs.writeTo(os)
      os.flush()
    }
    catch (e : Throwable) {
      PLLoggerCategory.DOCUMENT.error("DMSServlet-doSearch " + fromBuf.toString() + whereBuf.toString() + " failed ", e)
      if (!resp.Committed) {
        resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
      }
    }
  }

  override function doPut(req: HttpServletRequest, resp: HttpServletResponse) {
    if (_interval > 0) {
      PLLoggerCategory.DOCUMENT.debug("DMSServlet-doPut sleeping for " + _interval)
      Thread.sleep(_interval * 60 * 1000)
      PLLoggerCategory.DOCUMENT.debug("DMSServlet-doPut awake")
    }
    var user = handleLogin(req, resp)
    if (user == null) {
      return
    }
    var path = req.PathInfo.substring("/dms/".length, req.PathInfo.length)
    path = URLDecoder.decode(path, "utf-8")
    PLLoggerCategory.DOCUMENT.debug("DMSServlet-doPut path='" + path + "'")
    if (path.startsWith("content/")) {
      doPutContent(path.substring("content/".length), req, resp)
      return
    }
    if (path.startsWith("metadata")) {
      var publicId = path.startsWith("metadata/") ? path.substring("metadata/".length) : null
      var xml = Document.parse(req.InputStream)
      if (xml.PublicID != null && publicId != null && xml.PublicID != publicId) {
        throw new RuntimeException("Metadata PublicId '" + xml.PublicID + "' does not match expected '" + publicId + "'" )
      }
      if (publicId == null) {
        publicId = xml.PublicID
      }
      if (publicId == null) {
        publicId = genNextPublicID(resp)
      }
      var docName = lookupDocName(publicId, resp)
      if (docName == null) {
        doPutMetadata(publicId, xml, req, resp)
      }
      else {
        doUpdateMetadata(publicId, docName, xml, req, resp)
      }
      return
    }
    PLLoggerCategory.DOCUMENT.info("DMSServlet-doPut bad request path='" + path + "'")
    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST)
    resp.setContentType("text/plain")
  }

  override function doDelete(req: HttpServletRequest, resp: HttpServletResponse) {
    if (_interval > 0) {
      PLLoggerCategory.DOCUMENT.debug("DMSServlet-doDelete sleeping for " + _interval)
      Thread.sleep(_interval * 60 * 1000)
      PLLoggerCategory.DOCUMENT.debug("DMSServlet-doDelete awake")
    }
    var user = handleLogin(req, resp)
    if (user == null) {
      return
    }
    var path = req.PathInfo.substring("/dms/".length, req.PathInfo.length)
    path = URLDecoder.decode(path, "utf-8")
    PLLoggerCategory.DOCUMENT.debug("DMSServlet-doDelete path='" + path + "'")
    if (path.startsWith("metadata/")) {
      resp.setContentType("text/plain")
      var publicId = path.substring("metadata/".length)
      try {
        using (var conn = getConnection(),
            var deleteDocStmt = conn.prepareStatement(docDeleteStr)) {
          deleteDocStmt.setString(1, publicId)
          var rtn = deleteDocStmt.executeUpdate()
          conn.commit()
        }
      }
      catch (e : Throwable) {
        PLLoggerCategory.DOCUMENT.error("DMSServlet-doDelete error on path='" + path + "'", e)
        resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
        resp.setContentType("text/plain")
        return
      }
      var encodedName = encode(publicId)
      var docDir = new File(_rootDir, encodedName)
      if (docDir.exists()) {
        try {
          FileUtil.deleteDirectoryRecursively(docDir)
        } catch (e: Throwable) {
          PLLoggerCategory.DOCUMENT.info("DMSServlet-doDelete error on delete of docDir='" + docDir + "'", e)
        }
      }
      var metadataFile = new File(_rootDir, encodedName + ".xml")
      metadataFile.delete()
      return
    }
    PLLoggerCategory.DOCUMENT.info("DMSServlet-doDelete bad request path='" + path + "'")
    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST)
    resp.setContentType("text/plain")
  }

  private function genNextPublicID(resp: HttpServletResponse) : String {
    var rtn = 0
    try {
      using (var conn = getConnection(),
          var stmt = conn.prepareStatement(maxIdStr),
          var rs = stmt.executeQuery()) {
        if (rs.next()) {
          rtn = rs.getInt(1)
        }
      }
      if (rtn < _highWater) {
        rtn = _highWater
      }
      rtn = rtn + 1;
      _highWater = rtn
      PLLoggerCategory.DOCUMENT.debug("DMSServlet-getNextPublidID rtn=" + rtn)
      return "dms:" + rtn
    }
    catch (e : Throwable) {
      PLLoggerCategory.DOCUMENT.error("DMSServlet-genNextPublicId failed", e)
      resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
      return null
    }
  }

  private function lookupDocName(publicId : String, resp : HttpServletResponse): String {
    try {
      using (var conn = getConnection(),
          var stmt = conn.prepareStatement(docQueryStr)) {
        stmt.setString(1, publicId)
        using (var rs = stmt.executeQuery()) {
          if (rs.next()) {
            return rs.getString(1)
          }
        }
      }
    }
    catch (e : Throwable) {
      PLLoggerCategory.DOCUMENT.error("DMSServlet-doPutContent publicId" + publicId + " failed:", e)
      resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
    }
    return null
  }

  private function lookupLink(publicId : String, attribName : String, linkPublicId : String, resp : HttpServletResponse) : boolean {
    try {
      using (var conn = getConnection(),
             var stmt = conn.prepareStatement(docPropQueryStr)) {
        stmt.setString(1, publicId)
        stmt.setString(2, attribName)
        stmt.setString(3, linkPublicId)
        using (var rs = stmt.executeQuery()) {
          if (rs.next()) {
            return true
          }
        }
      }
    }
    catch (e : Throwable) {
      PLLoggerCategory.DOCUMENT.error("DMSServlet-doPutContent publicId" + publicId + " failed:", e)
      resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
    }
    return false
  }

  private function doPutContent(path : String, req: HttpServletRequest, resp: HttpServletResponse)  {
    var pos = path.indexOf("/")
    var publicId = path.substring(0, pos)
    var filename = path.substring(pos + 1)
    var name = lookupDocName(publicId, resp)
    if (name == null) {
      PLLoggerCategory.DOCUMENT.error("DMSServlet-doPutContent for " + publicId + " not added yet")
    }
    else if (name != filename) {
      PLLoggerCategory.DOCUMENT.error("DMSServlet-doPutContent for " + publicId + " file name does not match name=" + name + " filename=" + filename)
      // drops through to bad_request
    }
    else {
      if (name.contains("FailContent")) {
        PLLoggerCategory.DOCUMENT.info("DMSServlet-doPutContent for " + publicId + " file name forces failure=" + name + " filename=" + filename)
      }
      else {
        var file = new File(_rootDir, encode(publicId) + "/" + filename)
        file.ParentFile.mkdirs()
        using (var os = new FileOutputStream(file)) {
          StreamUtil.copy(req.InputStream, os)
        }
        resp.setStatus(HttpServletResponse.SC_OK)
        resp.setContentType("text/plain")
        return
      }
    }
    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST)
    resp.setContentType("text/plain")
  }

  private function doPutMetadata(publicId : String, xml: Document, req: HttpServletRequest, resp: HttpServletResponse) {
    if (xml.Name.contains("FailMetadata")) {
      PLLoggerCategory.DOCUMENT.info("DMSServlet-doPutMetadata for " + publicId + " file name forces failure=" + xml.Name)
      resp.setStatus(HttpServletResponse.SC_BAD_REQUEST)
      resp.setContentType("text/plain")
    }
    var file = new File(_rootDir, encode(publicId) + ".xml")
    file.ParentFile.mkdirs()
    try {
      using (var conn = getConnection(),
          var insertDocStmt = conn.prepareStatement(docInsertStr),
          var insertPropStmt = conn.prepareStatement(propInsertStr),
          var queryPropStmt = conn.prepareStatement(propQueryStr),
          var insertDocPropStmt = conn.prepareStatement(docPropInsertStr)) {
        insertDocStmt.setString(1, publicId)
        insertDocStmt.setString(2, xml.Name)
        insertDocStmt.setString(3, xml.MimeType)
        var rtn = insertDocStmt.executeUpdate()
        populateMetadata(publicId, xml, insertDocPropStmt, insertPropStmt, queryPropStmt)
      }
      using (var os = new FileOutputStream(file)) {
        xml.writeTo(new BufferedOutputStream(os))
      }
    }
    catch (e : Throwable) {
      PLLoggerCategory.DOCUMENT.error("DMSServlet-doPutMetadata publicId='" + publicId + "'", e)
      resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
      resp.setContentType("text/plain")
      return
    }
    resp.setStatus(HttpServletResponse.SC_OK)
    resp.setContentType("text/plain")
    resp.OutputStream.print(publicId)
    resp.OutputStream.flush()
  }

  private function doUpdateMetadata(publicId : String, docName : String, xml: Document, req: HttpServletRequest, resp: HttpServletResponse) {
    if (xml.Name.contains("FailUpdate")) {
      PLLoggerCategory.DOCUMENT.info("DMSServlet-doPutMetadata for " + publicId + " file name forces failure=" + xml.Name)
      resp.setStatus(HttpServletResponse.SC_BAD_REQUEST)
      resp.setContentType("text/plain")
    }
    var xmlFile = new File(_rootDir, encode(publicId) + ".xml")
    var docFile = new File(_rootDir, encode(publicId) + "/" + docName)
    xmlFile.ParentFile.mkdirs()
    try {
      using (var conn = getConnection()) {
        using(var docSetStmt = conn.prepareStatement(docSetStr),
              var docClearStmt = conn.prepareStatement(clearDocPropDeleteStr)) {
          docSetStmt.setString(1, xml.Name)
          docSetStmt.setString(2, xml.MimeType)
          docSetStmt.setString(3, publicId)
          var rtn = docSetStmt.executeUpdate()
          docClearStmt.setString(1, publicId)
          docClearStmt.setString(2, "")
          var rtn2 = docClearStmt.executeUpdate()
          docClearStmt.setString(2, "_")
          var rtn3 = docClearStmt.executeUpdate()
          conn.commit()
        }
        PLLoggerCategory.DOCUMENT.debug("DMSServlet-doUpdateMetadata docName=" + docName + " xml.Name=" + xmlFile.Name + " docFileExists=" + docFile.exists())
        if (docName != xml.Name) {
          if (docFile.exists()) {
            docFile.renameTo(new File(_rootDir, encode(publicId) + "/" + xml.Name) )
          }
        }
        using (var insertPropStmt = conn.prepareStatement(propInsertStr),
            var queryPropStmt = conn.prepareStatement(propQueryStr),
            var insertDocPropStmt = conn.prepareStatement(docPropInsertStr)) {
          populateMetadata(publicId, xml, insertDocPropStmt, insertPropStmt, queryPropStmt)
        }
      }
      using(var os = new FileOutputStream(xmlFile)) {
        xml.writeTo(new BufferedOutputStream(os))
      }
    }
    catch (e : Throwable) {
      PLLoggerCategory.DOCUMENT.error("DMSServlet-doUpdateMetadata publicId='" + publicId + "'", e)
      resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
      resp.setContentType("text/plain")
      return
    }
    resp.setStatus(HttpServletResponse.SC_OK)
    resp.setContentType("text/plain")
    resp.OutputStream.print(publicId)
    resp.OutputStream.flush()
  }

  override function init(config: ServletConfig) {
    _urlRoot = System.getProperty("gw.document.DMSServlet.url-root")
    if (_urlRoot != null) {
      _urlRoot = _urlRoot.endsWith("/") ? _urlRoot : (_urlRoot + "/")
      _urlRoot = _urlRoot.endsWith("/service/dms/") ? _urlRoot : (_urlRoot + "service/dms/")
    }

    PLLoggerCategory.DOCUMENT.info("DMSServlet-init urlRoot=" + _urlRoot)
    var wkRoot = System.getProperty("gw.document.DMSServlet.root-dir")
    if (wkRoot != null) {
      _rootPath = wkRoot;
    }
    _rootDir = new File(_rootPath)
    _rootDir.mkdirs()
    _purgeableUrl = "jdbc:h2:" + _rootDir + "/db"
    PLLoggerCategory.DOCUMENT.info("DMSServlet-init rootDir=" + _rootDir)

    var wkDriver = System.getProperty("gw.document.DMSServlet.db-driver")
    if (wkDriver != null) {
      _dbDriver = wkDriver;
    }
    var dbDriver = Class.forName(_dbDriver)
    if (dbDriver == null) {
      throw new ServletException("Failed to load driver " + _dbDriver)
    }
    var wkURL = System.getProperty("gw.document.DMSServlet.db-url")
    if (wkURL != null) {
      _dbURL = wkURL;
    }
    var wkUsername = System.getProperty("gw.document.DMSServlet.db-username")
    if (wkUsername != null) {
      _dbUsername = wkUsername;
    }
    var wkPassword = System.getProperty("gw.document.DMSServlet.db-password")
    if (wkPassword != null) {
      _dbPassword = wkPassword;
    }
    if (_dbURL == null) {
      _dbURL = _purgeableUrl
    }
    if (_dbURL.startsWith("jdbc:h2:")) {
      try {
        rebuildDatabase()
      } catch (e : Throwable) {
        FileUtil.clearDir(_rootDir)
        PLLoggerCategory.DOCUMENT.error("DMSServlet-init cleared directory " + _rootDir + ".  Will try to build again")
        rebuildDatabase()
      }
    }
  }

  private function rebuildDatabase() {
    try {
        createTables()
        populateTable()

      using (var conn = getConnection()) {
        populatePropMap(conn)
        var prePopulateProp = System.getProperty("gw.document.DMSServlet.props")
        if (prePopulateProp != null) {
          using (var insertPropStmt = conn.prepareStatement(propInsertStr),
                 var queryPropStmt = conn.prepareStatement(propQueryStr)) {
            var props = prePopulateProp.split(",")
            for (prop in props) {
              checkAddProperty(prop, PropType.Other, insertPropStmt, queryPropStmt)
            }
          }
        }
      }
    }
    catch (e : ServletException) {
      PLLoggerCategory.DOCUMENT.error("DMSServlet-init failed:", e)
      throw e
    }
    catch (e : Throwable) {
      PLLoggerCategory.DOCUMENT.error("DMSServlet-init failed:", e)
      throw new ServletException("Failed to construct/populate database " + _dbURL, e)
    }
  }

  @SuppressWarnings({"CallToDriverManagerGetConnection", "Method2Property"})
  private function getConnection() : Connection {
    try {
      return DriverManager.getConnection(_dbURL, _dbUsername, _dbPassword)
    }
    catch (e : Throwable) {
      throw new ServletException("Failed to open database " + _dbURL + " as " + _dbUsername, e)
    }
  }

  override function destroy() {
  }

  private function createTables() {
    using (var conn = getConnection()) {
      executePrepareStatement(docTableStr, conn);
      executePrepareStatement(propertyTableStr, conn);
      executePrepareStatement(docPropTableStr, conn);
      conn.commit();
    }
  }

  private function executePrepareStatement(sql : String, connection : Connection) {
    using (var ps = connection.prepareStatement(sql)) {
      ps.execute();
    }
  }

  function populatePropMap(conn : Connection) {
    using (var stmt = conn.createStatement(), var rs = stmt.executeQuery(seenPropQueryStr)) {
      while (rs.next()) {
        _props.put(rs.getString(2), Pair.make(rs.getInt(1), rs.getString(3)))
      }
    }
  }

  private function populateTable() {

    using (var conn = getConnection(), var statement = conn.createStatement(), var rs = statement.executeQuery("SELECT Id FROM Doc")) {

      if (!rs.next()) {
        PLLoggerCategory.DOCUMENT.info("DMSServlet - populating table")

        using (var insertDocStmt = conn.prepareStatement(docInsertStr),
               var insertPropStmt = conn.prepareStatement(propInsertStr),
               var queryPropStmt = conn.prepareStatement(propQueryStr),
               var insertDocPropStmt = conn.prepareStatement(docPropInsertStr)) {

          for (xmlFile in _rootDir.listFiles(\dir : File, name : String -> name.endsWith(".xml"))) {
            try {
              var fileName = xmlFile.Name
              var publicID = fileName.substring(0, fileName.length - ".xml".length)
              var xml = Document.parse(new BufferedInputStream(new FileInputStream(xmlFile)))
              insertDocStmt.setString(1, publicID)
              insertDocStmt.setString(2, xml.Name)
              insertDocStmt.setString(3, xml.MimeType)
              insertDocStmt.executeUpdate()
              if (populateMetadata(publicID, xml, insertDocPropStmt, insertPropStmt, queryPropStmt)) {
                using (var os = new FileOutputStream(xmlFile)) {
                  xml.writeTo(new BufferedOutputStream(os))
                }
              }
            } catch (e : Throwable) {
              PLLoggerCategory.DOCUMENT.warn("DMSServlet-populate on " + xmlFile, e)
            }
          }
        }
      }
    }
  }

  private function populateMetadata(publicId : String,
                                    xml : Document,
                                    insertDocPropStmt : PreparedStatement,
                                    insertPropStmt : PreparedStatement,
                                    queryPropStmt : PreparedStatement  ) : boolean {
    var changed = false;
    PLLoggerCategory.DOCUMENT.debug("DMSServlet-populateMetadata publicId='" + publicId + "' xml:\n" + xml.asUTFString())
    if (xml.PublicID == null) {
      xml.PublicID = publicId
      changed = true;
    }
    else if (publicId != null && xml.PublicID != publicId) {
      throw new RuntimeException("Metadata PublicId '" + xml.PublicID + "' does not match expected '" + publicId + "'" )
    }
    var docUID = "content/" + URLEncoder.encode(publicId, "utf-8") + "/" + URLEncoder.encode(xml.Name, "utf-8")
    if (xml.DocUID != docUID) {
      xml.DocUID = docUID
      changed = true;
    }
    var url = _urlRoot + xml.DocUID
    if (xml.URL != url) {
      xml.URL = url
      changed = true;
    }
    populateProperties(publicId, "MimeType", xml.MimeType, PropType.String, insertDocPropStmt, insertPropStmt, queryPropStmt, "")
    populateProperties(publicId, "Author", xml.Author, PropType.String, insertDocPropStmt, insertPropStmt, queryPropStmt, "")
    if (xml.Author != null) {
      populateProperties(publicId, "_Author", xml.Author.toLowerCase(), PropType.String, insertDocPropStmt, insertPropStmt, queryPropStmt, "")
    }
//  also in dateProp  populateProperties(publicId, "DateCreated", xml.DateCreated, PropType.Date, insertDocPropStmt, insertPropStmt, queryPropStmt)
//  also in dateProp  populateProperties(publicId, "DateModified", xml.DateModified, PropType.Date, insertDocPropStmt, insertPropStmt, queryPropStmt)
    populateProperties(publicId, "Language", xml.Language, PropType.Other, insertDocPropStmt, insertPropStmt, queryPropStmt, "")
    populateProperties(publicId, "Section", xml.Section, PropType.Other, insertDocPropStmt, insertPropStmt, queryPropStmt, "")
    populatePropertiesNullOkay(publicId, "SecurityType", xml.SecurityType, PropType.Other, insertDocPropStmt, insertPropStmt, queryPropStmt, "")
    populateProperties(publicId, "Status", xml.Status, PropType.Other, insertDocPropStmt, insertPropStmt, queryPropStmt, "")
    populateProperties(publicId, "Type", xml.Type, PropType.Other, insertDocPropStmt, insertPropStmt, queryPropStmt, "")
    populateProperties(publicId, "PublicID", xml.PublicID, PropType.Other, insertDocPropStmt, insertPropStmt, queryPropStmt, "")
    populateProperties(publicId, "Name", xml.Name, PropType.String, insertDocPropStmt, insertPropStmt, queryPropStmt, "")
    if (xml.Name != null) {
      populateProperties(publicId, "_NameOrID", xml.Name.toLowerCase(), PropType.String, insertDocPropStmt, insertPropStmt, queryPropStmt, "")
    }
    populateProperties(publicId, "DocUID", URLDecoder.decode(xml.DocUID, "utf-8"), PropType.Other, insertDocPropStmt, insertPropStmt, queryPropStmt, "")
    populateProperties(publicId, "URL", xml.URL, PropType.String, insertDocPropStmt, insertPropStmt, queryPropStmt, "")

    for (dateProp in xml.Date) {
      populateProperties(publicId, dateProp.Name, dateProp.Value, PropType.Date, insertDocPropStmt, insertPropStmt, queryPropStmt)
    }
    for (prop in xml.Property) {
      populateProperties(publicId, prop.Name, prop.Value, PropType.String, insertDocPropStmt, insertPropStmt, queryPropStmt, "")
      if (prop.Name == "DocumentIdentifier") {
        populateProperties(publicId, "_NameOrID", prop.Value, PropType.String, insertDocPropStmt, insertPropStmt, queryPropStmt, "_")
      }
    }
    for (prop in xml.Boolean) {
      populateProperties(publicId, prop.Name, prop.Value as String, PropType.Other, insertDocPropStmt, insertPropStmt, queryPropStmt, "")
    }
    for (prop in xml.Link) {
      populateProperties(publicId, prop.Name, prop.PublicID, PropType.Other, insertDocPropStmt, insertPropStmt, queryPropStmt, "")
      if (prop.DisplayName != null) {
        populateProperties(publicId, prop.Name, prop.DisplayName, PropType.Other, insertDocPropStmt, insertPropStmt, queryPropStmt, "_")
      }
    }
    insertDocPropStmt.Connection.commit();
    return changed;
  }

  private function populateProperties(publicId : String, name : String, value : String, propType : PropType,
                                      insertDocPropStmt : PreparedStatement,
                                      insertPropStmt : PreparedStatement,
                                      queryPropStmt : PreparedStatement,
                                      linkedPublicId : String){

    if (value == null) return
    populatePropertiesNullOkay(publicId, name, value, propType, insertDocPropStmt, insertPropStmt, queryPropStmt, linkedPublicId)
  }

  private function populatePropertiesNullOkay(publicId : String, name : String, value : String, propType : PropType,
                                      insertDocPropStmt : PreparedStatement,
                                      insertPropStmt : PreparedStatement,
                                      queryPropStmt : PreparedStatement,
                                      linkedPublicId : String){
    if (!_props.containsKey(name)) checkAddProperty(name, propType, insertPropStmt, queryPropStmt)
    insertDocPropStmt.setString(1, publicId)
    insertDocPropStmt.setString(2, name)
    insertDocPropStmt.setString(3, value)
    insertDocPropStmt.setDate(4, null)
    insertDocPropStmt.setString(5, linkedPublicId)
    PLLoggerCategory.DOCUMENT.debug("DMSServlet-populateProperties publicID=" + publicId + " name=" + name + " value=" + value)
    insertDocPropStmt.executeUpdate()
  }

  private function populateProperties(publicId : String, name : String, value : Date, propType : PropType,
                                      insertDocPropStmt : PreparedStatement,
                                      insertPropStmt : PreparedStatement,
                                      queryPropStmt : PreparedStatement){
    if (value == null) return
    if (!_props.containsKey(name)) checkAddProperty(name, propType, insertPropStmt, queryPropStmt)
    insertDocPropStmt.setString(1, publicId)
    insertDocPropStmt.setString(2, name)
    insertDocPropStmt.setString(3, null)
    insertDocPropStmt.setDate(4, new java.sql.Date(value.Time))
    insertDocPropStmt.setString(5, "")
    PLLoggerCategory.DOCUMENT.debug("DMSServlet-populateProperties publicID=" + publicId + " name=" + name + " value=" + value)
    insertDocPropStmt.executeUpdate()
  }

  private function checkAddProperty(name : String, propType : PropType, insertPropStmt : PreparedStatement, queryPropStmt : PreparedStatement) {
    queryPropStmt.setString(1, name)
    var attempt = 0
    while (attempt < 2) {
      if (_props.containsKey(name)) return // first race condition check
      using (var rtn = queryPropStmt.executeQuery()) { // second race condition check
        if (rtn.next()) {
          _props.put(name, Pair.make(rtn.getInt(1), rtn.getString(2)))
          return
        }
      }
      try { // perform the add
        attempt++
        insertPropStmt.setString(1, name)
        insertPropStmt.setString(2, propType.Code)
        insertPropStmt.executeUpdate()
      }
      catch (e : Throwable) {
        if (attempt > 1) {
          throw e;
        }
      }
    }
  }

  private function encode(publicId : String) : String {
    var encodeStr = new String(Base64Util.encode(StreamUtil.toBytes(publicId)))
    return encodeStr.endsWith("==")
        ? encodeStr.substring(0, encodeStr.length - 2)
        : encodeStr.endsWith("=")
            ? encodeStr.substring(0, encodeStr.length - 1)
            : encodeStr
  }
}

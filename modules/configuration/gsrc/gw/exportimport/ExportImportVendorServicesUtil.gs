package gw.exportimport

uses java.io.File
uses java.io.BufferedWriter
uses gw.api.database.Query
uses java.io.BufferedReader

uses gw.api.database.QuerySelectColumns
uses gw.api.locale.DisplayKey
uses gw.api.path.Paths
uses gw.transaction.Transaction
uses gw.api.database.Relop
uses java.util.ArrayList
uses java.lang.IllegalStateException
uses gw.api.system.ABLoggerCategory
uses java.nio.charset.MalformedInputException
uses gw.pl.util.FileUtil
uses gw.api.util.DateUtil
uses java.util.HashMap
uses java.util.List
/*
 * Class for loading services automatically to vendors through an export, map and import process.
 *
 * During initial setup of this class, there are several variables that will need to be configured:
 *    outputFolder should point to a location on the hosting machine where the files will be written during export
 *    serviceMap should point to a map of keys and service ids to add automatically during the mapping process (map should be updated before mapping process)
 *    keys should be an array list of all properties the user wants to include in the key values for the maps
 */
@Export
class ExportImportVendorServicesUtil {

  //Private variable for page size during the query. Does not impact functionality, only performance. Should be non-zero value
  private static var queryPageSize = 100
  //Location to store the exported files
  protected static var outputFolder : String = "C:\\outputfiles\\"
  //Maximum rows of each subtype spreadsheet before a new spreadsheet is created (does not include two header rows)
  private static var maxRowsPerSpreadsheet : int = 500
  /*
   * Column headers for spreadsheets. ColumnHeaders1 will contain only service names and does not impact functionality.
   * ColumnHeaders2 has titles for metadata columns and service ids will be added. The titles for the metadata columns
   * do not affect the content of the columns. Content needs to be changed by modifying the createAndAddNextRow method.
   */
  private static final var initialHeaders = {ABContact#Name.PropertyInfo.DisplayName, ABContact#LinkID.PropertyInfo.DisplayName, ABContact#PrimaryAddress.PropertyInfo.DisplayName, DisplayKey.get("Web.VendorServicesExportImport.Columns.Key"), ABContact#VendorServicesLoadStatus.PropertyInfo.DisplayName} //ensure there are no commas in header names
  //Reference to metadata columns used in map/import process. These values, columnHeaders2, and method createAndAddNextRow must be changed to alter metadata columns
  private static var nameColumnIndex = 0
  private static var idColumnIndex = 1
  private static var keyColumnIndex = 3
  private static var vendorServicesLoadStatusIndex = 4
  //Total number of metadata columns
  private static var numberOfNonServiceColumns = 5
  //ArrayList of contact property names to be used to create key during export
  private static var keys = {"Subtype", "PrimaryAddress.Country"}
  //On and off value used in spreadsheet
  protected static var onValue : String = "On"
  protected static var offValue : String = ""
  //Map to be used during service mapping process
  protected static var serviceMap : HashMap<String, String> = ServiceMappings.ServiceMap
  //Logger and string to return warning and error messages to user
  private static var _logger = ABLoggerCategory.AB
  private static var returnString : String

  /*
   * Export method for putting vendors and services into a spreadsheet. Spreadsheet will reflect any existing services on
   * vendors (if any exist).
   */
  public static function exportVendors() : String {
    returnString = ""
    var columnHeaders1 = new ArrayList<String>()
    var columnHeaders2 = initialHeaders.clone() as List<String>
    createHeaders(columnHeaders1, columnHeaders2)

    //Query to get all contacts with vendor tags
    var allContacts = Query.make(ABContact)
    var vendorTag = allContacts.join(ABContactTag, "ABContact")
    var vendorContacts = vendorTag.compare("Type", Relop.Equals, ContactTagType.TC_VENDOR).select()
    vendorContacts.orderBy(QuerySelectColumns.path(Paths.make(ABContact#Subtype)))
    vendorContacts.setPageSize(queryPageSize)
    if (!vendorContacts.HasElements) {
      displayErrorMessage(DisplayKey.get("Web.VendorServicesExportImport.Errors.NoVendorsFound"))
    }

    //Folder for output files with time stamp
    var timeStampedFolderName = outputFolder + "VendorServicesLoad-" + DateUtil.currentDate().toString().replace(":", ".")
    var timeStampedFolder = new File(timeStampedFolderName).mkdirs()

    var currentSubtype : typekey.ABContact
    var currentGrid = new ArrayList<ArrayList<String>>()
    for (var contact in vendorContacts) {
      if (currentSubtype == null) { //initialize subtype for the first contact
        currentSubtype = contact.Subtype
      } else if (currentSubtype != contact.Subtype) { //every time the subtype changes
        writeCurrentGrid(currentGrid, currentSubtype.toString(), timeStampedFolderName, columnHeaders1, columnHeaders2)
        currentSubtype = contact.Subtype
        currentGrid = new ArrayList<ArrayList<String>>()
        columnHeaders1 = new ArrayList<String>()
        columnHeaders2 = initialHeaders.clone() as List<String>
        createHeaders(columnHeaders1, columnHeaders2)

      }
      createAndAddNextRow(contact, currentGrid, columnHeaders1, columnHeaders2) //store row in data structure
    }
    if (currentGrid.HasElements) { //final grid
      writeCurrentGrid(currentGrid, currentSubtype.toString(), timeStampedFolderName, columnHeaders1, columnHeaders2)
    }
    returnString += DisplayKey.get("Web.VendorServicesExportImport.Results.ExportComplete", outputFolder) + "\n"
    return returnString
  }

  /*
   * Mapping method to automatically add services to vendors based on defined map.
   * @param fileName path of the file or directory to be mapped
   */
  public static function mapServices(fileName : String, subdirectories : boolean) : String {
    if (fileName == "") { //if no input
      throw new MalformedInputException(0)
    }
    returnString = ""
    var folderPath = new File(fileName)
    var listOfFiles = new ArrayList<File>()
    getAllFiles(folderPath, listOfFiles, subdirectories)
    var vendorServices =  retrieveVendorServices()
    checkServicesInMap(vendorServices)
    foreach (var file in listOfFiles) {
      mapFile(file, vendorServices)
    }
    returnString += DisplayKey.get("Web.VendorServicesExportImport.Results.MapComplete") + "\n"
    return returnString
  }

  /*
   * Import the vendors from a given file or directory whose path is specified by fileName. An error directory is also
   * created at the level of the path specified and an error spreadsheet is created for each spreadsheet being imported
   * that also has an error.
   * @param fileName path of the file or directory to be imported
   */
  public static function importVendors(fileName : String, subdirectories : boolean) : String {
    if (fileName == "") {
      throw new MalformedInputException(0)
    }
    var allContacts = Query.make(ABContact)
    var vendorTag = allContacts.join(ABContactTag, "ABContact")
    var vendorContacts = vendorTag.compare("Type", Relop.Equals, ContactTagType.TC_VENDOR).select()
    vendorContacts.setPageSize(queryPageSize)
    returnString =  ""

    var folderPath = new File(fileName)
    var listOfFiles = new ArrayList<File>()
    getAllFiles(folderPath, listOfFiles, subdirectories)
    var vendorServices = retrieveVendorServices()

    var errorsFolder = new File(outputFolder + "Errors" + File.separator).mkdirs()

    var importSuccessful = true
    foreach(var file in listOfFiles) {
      importSuccessful = importFileSuccessful(file, vendorServices) && importSuccessful
    }
    returnString += importSuccessful == true ? DisplayKey.get("Web.VendorServicesExportImport.Results.ImportComplete") : DisplayKey.get("Web.VendorServicesExportImport.Results.ImportFailed") + "\n"
    return returnString
  }

  /*
   * Initialize the headers with all specialist services found in database. If no services exist, print an error message
   * warning the user.
   */
  private static function createHeaders(columnHeaders1 : List<String>, columnHeaders2 : List<String>) {
    var vendorServices =  retrieveVendorServices()
    while (columnHeaders1.size() < columnHeaders2.size()) {
      columnHeaders1.add("") //initialize empty cells in first header above metadata columns
    }
    if (!vendorServices.HasElements) {
      displayErrorMessage(DisplayKey.get("Web.VendorServicesExportImport.Errors.NoServicesFound"))
    }
    for (service in vendorServices) {
      if (!columnHeaders2.contains(service.Code.remove(","))) {
        columnHeaders1.add(service.Name.remove(","))
        columnHeaders2.add(service.Code.remove(","))
      }
    }
  }

  /*
   * Writes the current grid to a .csv file. Uses the subtype in the file name.
   * @param grid current grid to be written to spreadsheet
   * @param subtype current subtype of the vendors being written to a spreadsheet
   * @param folderName the path of the folder where the spreadsheets will be written
   */
  private static function writeCurrentGrid(grid : ArrayList<ArrayList<String>>, subtype : String, folderName : String, columnHeaders1 : List<String>, columnHeaders2 : List<String>) {
    if (maxRowsPerSpreadsheet <= 0) {
      throw new IllegalStateException(DisplayKey.get("Web.VendorServicesExportImport.Errors.MaxRowPerSpreadsheetValue"))
    }
    var numberOfSpreadsheets = grid.size()/maxRowsPerSpreadsheet
    if((grid.size() % maxRowsPerSpreadsheet) > 0) {
      numberOfSpreadsheets++
    }
    for (var i in 0..|numberOfSpreadsheets) {
      var newFile = new File(folderName + File.separator + subtype + "-" + i + ".csv") //name file based on subtype
      newFile.createNewFile()
      var fw = FileUtil.getFileWriter(newFile.getAbsoluteFile())
      var bw = new BufferedWriter(fw)
      try {
        var max = maxRowsPerSpreadsheet * (i + 1) > grid.size() ? grid.size() : maxRowsPerSpreadsheet * (i + 1)
        //write column headers for each file
        bw.write(columnHeaders1.toString().substring(1, columnHeaders1.toString().length - 1))
        bw.write("\n")
        bw.write(columnHeaders2.toString().substring(1, columnHeaders2.toString().length - 1))
        bw.write("\n")
        for (var row in grid.subList(maxRowsPerSpreadsheet * i, max)) {
          bw.write(row.toString().substring(1, row.toString().length - 1))
          bw.write("\n")
        }
      } finally {
        bw.close()
      }
    }
  }

  /*
   * Creates the next row and adds it to the grid. If you want to change the values in the metadata columns, you need to
   * modify this method.
   * @param contact the contact that is being added as a row to the grid
   * @param currentGrid the data strucutre storing all the contacts to be added to the spreadsheet
   */
  private static function createAndAddNextRow(contact : ABContact, currentGrid : ArrayList<ArrayList<String>>, columnHeaders1 : List<String>, columnHeaders2 : List<String>) {
    var contactName = (contact.Name ?: ((contact as ABPerson).FirstName + " " + (contact as ABPerson).LastName)).remove(",")
    var contactAddress = contact.PrimaryAddress != null ? contact.PrimaryAddress.DisplayName.remove(",") : ""
    var keyValues = getKeyValues(contact)
    var vendorLoadStatus = contact.VendorServicesLoadStatus != null ? contact.VendorServicesLoadStatus.toString() : ""
    var nextRow = {contactName, contact.LinkID.remove(","), contactAddress, keyValues.substring(0, keyValues.lastIndexOf(" ")), vendorLoadStatus}
    while (nextRow.size() < columnHeaders2.size()) { //initialize empty row to size of service id columsn
      nextRow.add(offValue)
    }
    for (var service in contact.SpecialistServices) { //add services to rows
      var cIndex = columnHeaders2.indexOf(service.Code)
      if (cIndex == -1) {
        var codeToAdd = service.Code
        var nameToAdd = SpecialistService.getForCode(codeToAdd).Name
        columnHeaders1.add(nameToAdd)
        columnHeaders2.add(codeToAdd)
        nextRow.add(offValue)
        displayErrorMessage(DisplayKey.get("Web.VendorServicesExportImport.Errors.BranchServiceCantImport", service.Name))
      }
      nextRow.set(columnHeaders2.indexOf(service.Code), onValue)
    }
    currentGrid.add(nextRow)
  }

  /*
   * Get key values based on fields defined in class variables.
   * @param contact the contact whose information is being retrieved
   */
  private static function getKeyValues(contact : ABContact) : String {
    var keyValues = ""
    for (var v in keys) {
      var vSplit = v.split("\\.")
      var entity : KeyableBean = contact
      for (var i in 0..|vSplit.length) {
        if (entity.getFieldValue(vSplit[i]) == null) {
          keyValues += "null "
          break
        } else  if (i == vSplit.length-1) {
          keyValues += entity.getFieldValue(vSplit[vSplit.length-1]).toString().remove(",")
          keyValues += " "
        } else{
          entity = entity.getFieldValue(vSplit[i]) as KeyableBean
        }
      }
    }
    return keyValues
  }

  /*
   * Recursively get all files in a directory.
   * @param file root directory/file to start the process
   * @param listOfFiles data structure to store all files in a directory
   */
  private static function getAllFiles(file: File, listOfFiles: ArrayList<File>, subdirectories : boolean) {
    if (file.listFiles() == null) {
      listOfFiles.add(file)
    } else  {
      for (var f in file.listFiles()) {
        if (subdirectories) {
          getAllFiles(f, listOfFiles, subdirectories)
        } else if (f.listFiles() == null) {
          listOfFiles.add(f)
        }
      }
    }
  }

  /*
   * Check that all services in the mapping file are valid. If not valid, don't stop process but print error message for
   * user.
   * @param vendorServices the list of all services that exist in database
   */
  private static function checkServicesInMap(vendorServices : List<SpecialistService>) {
    for (var key in serviceMap.keySet()) {
      var services = serviceMap.get(key).split(",\\s*")
      for (var service in services) {
        if (!vendorServices.contains(SpecialistService.getForCode(service))) {
          displayErrorMessage(DisplayKey.get("Web.VendorServicesExportImport.Errors.NoSpecialistServiceFound", service))
        }
      }
    }
  }

  /*
   * Add services to a given file based on the mapping file.
   * @param file the file that is going to be mapped
   * @vendorServices the list of all services that exist in the database
   */
  private static function mapFile(file: File, vendorServices : List<SpecialistService>) {
    if (!file.toString().contains(".csv")) {
      displayErrorMessage(DisplayKey.get("Web.VendorServicesExportImport.Errors.NotAValidCSVFile", file.toString()))
    } else {
      var fr = FileUtil.getFileReader(file)
      var br = new BufferedReader(fr)
      var headerStrings1 = br.readLine().split(",\\s*")
      var headerStrings2 = br.readLine().split(",\\s*")
      if (headerStrings2.length - numberOfNonServiceColumns < vendorServices.size()) {
        displayErrorMessage(DisplayKey.get("Web.VendorServicesExportImport.Errors.ColumnWasDeleted", file.toString()))
      }
      var newFile = new File(file.toString().replace(".csv", "_mapped.csv")) //added _mapped to end of new file name
      newFile.createNewFile()
      var fw = FileUtil.getFileWriter(newFile.getAbsoluteFile())
      var bw = new BufferedWriter(fw)
      var headersValid = writeHeaders(bw, headerStrings1.toList(), headerStrings2.toList(), br, newFile, vendorServices)
      if (headersValid) {
        var nextLine = br.readLine()
        while(nextLine != null) {
          createNextRow(nextLine, bw, headerStrings2.toList(), file)
          nextLine = br.readLine()
        }
        br.close()
        bw.close()
        file.delete() //get rid of old file
      }
    }
  }

  /*
   * Add given error message to logger and to message displayed to user.
   * @param message the message to be returned to the user and added to the logger
   */
  private static function displayErrorMessage(message : String){
    if (!returnString.contains(message)) {
      _logger.warn(message)
      returnString += message + "\n"
    }
  }

  /*
   * Writes the headers for the new spreadsheet during mapping.
   * @param bw the buffered writer used to write the information to a new file
   * @param header1 the list containing the first row of headers from the file to be mapped
   * @param header2 the list containing the second row of headers from the file to be mapped
   * @param br the buffered readers used to read information in from the old file
   * @param file the new file that is being created
   * @param vendorServices the list of all services in the database
   */
  private static function writeHeaders(bw : BufferedWriter, header1 : List<String>, header2 : List<String>, br : BufferedReader, file : File, vendorServices : List<SpecialistService>) : boolean {
    for(var serviceID in header2.subList(numberOfNonServiceColumns, header2.size())) { //need to account for ones not in original
      if (!vendorServices.contains(SpecialistService.getForCode(serviceID))) {
        bw.close()
        br.close()
        file.delete()
        displayErrorMessage(DisplayKey.get("Web.VendorServicesExportImport.Errors.ColumnWasAddedImproperly", serviceID, file.toString()))
        return false
      }
    }
    bw.write(header1.toString().substring(1, header1.toString().length-1))
    bw.write("\n")
    bw.write(header2.toString().substring(1, header2.toString().length-1))
    bw.write("\n")
    return true
  }

  /*
   * Copies the row from the previous spreadsheet into the new mapped spreadsheet. Also applies any mapping defined in
   * the service map file.
   * @param nextLine the line that needs to be added to the spreadsheet
   * @param bw the buffered writer that is writing to the new spreadsheet
   * @param headerIDs the list of service ids found in the headers
   */
  private static function createNextRow(nextLine : String, bw : BufferedWriter, headerIDs : List<String>, file : File) {
    var cells = nextLine.split(",\\s*").toList()
    var key = cells.get(keyColumnIndex)
    if (serviceMap.keySet().contains(key)) { //if key is defined in map
      var servicesToAdd = serviceMap.get(key).split(",\\s*")
      while (headerIDs.size() > cells.size()-1) {
        if (cells.size() <= numberOfNonServiceColumns - 1) {
          cells.add(cells.size(), "")
        } else {
          cells.add(cells.size(), offValue)
        }
      }
      for (var service in servicesToAdd) {
        var col = headerIDs.indexOf(service)
        if (col != -1) {
          cells.set(col, onValue)
        } else {
          displayErrorMessage(DisplayKey.get("Web.VendorServicesExportImport.Errors.ServiceNotListedInSpreadsheet", service, file.toString())) //service in map not listed in spreadsheet
        }
      }
    } else {
      displayErrorMessage(DisplayKey.get("Web.VendorServicesExportImport.Errors.KeyNotInMap", key, file.toString()))
    }
    bw.write(cells.toList().toString().substring(1, cells.toList().toString().size-1) + "\n")
  }

  /*
   * Import a given file, display or record any errors that occur during the process
   * @param file the file that is to be imported
   * @param vendorServices the list of all services in the database
   * @return a boolean indicating whether the import is finished without error
   */
  private static function importFileSuccessful(file : File, vendorServices : List<SpecialistService>) : boolean {
    if (!file.toString().contains(".csv")) {
      displayErrorMessage(DisplayKey.get("Web.VendorServicesExportImport.Errors.NotAValidCSVFile", file.toString()))
      return false
    } else {
      var errors = new ArrayList<String[]>()
      var fr = FileUtil.getFileReader(file)
      var headerStrings1 : String[]
      var headerStrings2 : String[]
      var br = new BufferedReader(fr)
      try {
        headerStrings1 = br.readLine().split(",\\s*")
        headerStrings2 = br.readLine().split(",\\s*")
        if (headerStrings2.length - numberOfNonServiceColumns < vendorServices.size()) { //removed column, display error and continue
          displayErrorMessage(DisplayKey.get("Web.VendorServicesExportImport.Errors.ColumnWasDeleted", file.toString()))
        }
        var header2 = headerStrings2.toList()
        for (var serviceID in header2.subList(numberOfNonServiceColumns, header2.size())) {
          if (!vendorServices.contains(SpecialistService.getForCode(serviceID))) { //if service is in map that does not exist in system, display error and continue
            displayErrorMessage(DisplayKey.get("Web.VendorServicesExportImport.Errors.ServiceCantBeAdded", serviceID, file.toString()))
          }
        }

        var nextLine = br.readLine()
        while (nextLine != null) {
          var cells = nextLine.split(",\\s*")
          var id = cells[idColumnIndex]
          updateVendor(id, cells, errors, headerStrings2.toList() as ArrayList<String>, vendorServices)
          nextLine = br.readLine()
        }
      } finally {
        br.close()
      }

      var errorsFileName = file.toString().substring(file.toString().lastIndexOf(File.separator) + 1)
      new File(outputFolder + "Errors" + File.separator + errorsFileName).delete()
      if (errors.HasElements) { //if there were any errors during the import
        writeErrorFile(errors, errorsFileName, headerStrings1, headerStrings2)
        return false
      }else{
        return true
      }
    }
  }

  /*
   * Find the vendor from the database based on the LinkID
   * @param id the id of the vendor that is to be updated
   * @param cells the information from a given row in the spreadsheet
   * @param errors the data structure to store all the rows in the spreadsheet that contain an error
   * @param header2 the list of strings stored in the second header row
   */
  private static function updateVendor(id : String, cells : String[], errors : ArrayList<String[]>, header2 : ArrayList<String>, vendorServices : List<SpecialistService>) {
    var allContacts = Query.make(ABContact)
    var vendor = allContacts.compare(ABContact#LinkID.PropertyInfo.Name, Relop.Equals, id).select().getAtMostOneRow()
    if (vendor == null) { //if no vendor found for id in database
      if (!errors.hasMatch( \ elt1 -> elt1[idColumnIndex] == cells[idColumnIndex])) {
        var cellList = cells.toList() as ArrayList<String>
        while (cellList.size() < header2.size()) {
          cellList.add("")
        }
        cellList.add(cellList.size(), "Bad LinkID")
        displayErrorMessage(DisplayKey.get("Web.VendorServicesExportImport.Errors.BadValue", cells[nameColumnIndex], cells[idColumnIndex], ABContact#LinkID.PropertyInfo.DisplayName))
        errors.add(cellList?.toTypedArray())
      }
    } else {
      updateVendorServicesInDB(vendor, cells, errors, header2, vendorServices)
    }
  }

  /*
   * Update vendor services in database based on columns defined as on in the spreadsheet. Also updates the vendor service
   * load status.
   * @param vendor the vendor to be updated
   * @param cells the information from a given row in the spreadsheet
   * @param errors the data structure to store all the rows in the spreadsheet that contain an error
   * @param header2 the list of strings stored in the second header row
   */
  private static function updateVendorServicesInDB(vendor : ABContact, cells : String[], errors : ArrayList<String[]>, header2 : ArrayList<String>, vendorServices : List<SpecialistService>) {
    Transaction.runWithNewBundle(\ bundle -> {
      vendor = bundle.add(vendor)
      var services = new ArrayList<SpecialistService>()
      if (cells.length > vendorServicesLoadStatusIndex) {
        var loadStatus = cells[vendorServicesLoadStatusIndex]
        if (VendorServicesLoadStatus.get(loadStatus) == null && loadStatus != "") {
          var cellList = cells.toList() as ArrayList<String>
          while (cellList.size() < header2.size()) {
            cellList.add("")
          }
          cellList.add(cellList.size(), "Bad VendorServiceLoadStatus value")
          displayErrorMessage(DisplayKey.get("Web.VendorServicesExportImport.Errors.BadValue", cells[nameColumnIndex], cells[idColumnIndex], ABContact#VendorServicesLoadStatus.PropertyInfo.DisplayName))
          errors.add(cellList?.toTypedArray())
        } else {
          vendor.VendorServicesLoadStatus = VendorServicesLoadStatus.get(cells[vendorServicesLoadStatusIndex])
        }
      }
      var i = numberOfNonServiceColumns
      while (i < cells.length && i < header2.size()) {
        var specialistService = SpecialistService.getForCode(header2.get(i))
        if (vendorServices.contains(specialistService)) {// skip invalid service column(s) if there's any
          if (cells[i] == onValue) { //if service is defined as on
            services.add(specialistService)
          } else if (cells[i] != offValue) { //if value is not onValue or offValue
            if (!errors.hasMatch(\elt1 -> elt1[idColumnIndex] == cells[idColumnIndex])) {
              var cellList = cells.toList() as ArrayList<String>
              while (cellList.size() < header2.size()) {
                cellList.add("")
              }
              cellList.add(cellList.size(), "Bad cell value")
              displayErrorMessage(DisplayKey.get("Web.VendorServicesExportImport.Errors.BadValue", cells[nameColumnIndex], cells[idColumnIndex], DisplayKey.get("Web.VendorServicesExportImport.CellValue")))
              errors.add(cellList?.toTypedArray())
            }
            return //stop import of this row
          }
        }
        i++
      }
      vendor.setSpecialistServices(services)
    })
  }

  /*
   * Writes an error spreadsheet for each file that had an error during the import process.
   * @param errors the list of rows that had an error during the import process
   * @param fileName the name of the errors file to be created
   * @param header1 the first header row
   * @param header2 the second header row
   */
  private static function writeErrorFile(errors: ArrayList<String[]>, fileName: String, header1 : String[], header2 : String[]) {
    var newFile = new File(outputFolder + "Errors" + File.separator + "errors-" + fileName)
    newFile.createNewFile()
    var fw = FileUtil.getFileWriter(newFile.getAbsoluteFile())
    var bw = new BufferedWriter(fw)
    try {
      bw.write(header1.toList().toString().substring(1, header1.toList().toString().length - 1))
      bw.write("\n")
      bw.write(header2.toList().toString().substring(1, header2.toList().toString().length - 1))
      bw.write("\n")
      for (var e in errors) {
        bw.write(e.toList().toString().substring(1, e.toList().toString().length - 1))
        bw.write("\n")
      }
    } finally {
      bw.close()
    }
  }

  private static function retrieveVendorServices() : List<SpecialistService> {
    var specialistServiceQuery = Query.make(SpecialistService)
    var specialistServiceParentQuery = Query.make(SpecialistServiceParent)

    // find leaf services
    specialistServiceQuery.subselect(
        SpecialistService#ID.PropertyInfo.Name,
        CompareNotIn,
        specialistServiceParentQuery,
        SpecialistServiceParent#ForeignEntity.PropertyInfo.Name)
    return specialistServiceQuery.select().toList()
  }

}

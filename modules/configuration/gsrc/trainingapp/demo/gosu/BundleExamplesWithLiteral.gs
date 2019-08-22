package trainingapp.demo.gosu
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.transaction.Transaction
uses java.util.Date

class BundleExamplesWithLiteral {
  public static function setInspectionDateByPublicID(publicID: String, inspectionDate: Date): String {
    // This method finds the company with the specified public ID and sets
    // the inspection date to the specified date. It also creates a
    // contact note to document this.
    // This method adds the company to the new bundle
    var returnString: String
    Transaction.runWithNewBundle(\newBundle -> {
      var queryObj = Query.make(ABCompany)
      queryObj.compare(ABCompany#PublicID, Relop.Equals, publicID)
      var targetCompany = queryObj.select().AtMostOneRow
      if (targetCompany == null) {
        returnString = "There is no company with the specified public ID."
      }
      else {
        // targetCompany must be copied to the new bundle
        targetCompany = newBundle.add(targetCompany)
        // Set the Inspection fields as appropriate
        targetCompany.InspectionRequired = true
        targetCompany.InspectionDate = inspectionDate
        // Create note to record the change
        var newNote = new ContactNote()
        newNote.Subject = "Change to inspection date"
        newNote.ContactNoteType = ContactNoteType.TC_DATA_UPDATE
        var originalInspectionDate = targetCompany.getOriginalValue("InspectionDate")
        newNote.Body = "Inspection date updated from " + originalInspectionDate +
            " to " + targetCompany.InspectionDate
        // Add note to bundle entity
        targetCompany.addToContactNotes(newNote)
        returnString = targetCompany.Name + ": " + newNote.Body
      }
      // runWithNewBundle() executes an implicit commit
      // User context is required when none is supplied
    }, "su")
    return returnString
  }

  public static function setInspectionDateByName(name: String, inspectionDate: Date): String {
    // This method finds the company with the specified name and sets
    // the inspection date to the specified date. It also creates a
    // contact note to document this.
    // This method adds the company to the new bundle using a query.
    var returnString: String
    Transaction.runWithNewBundle(\newBundle -> {
      var queryObj = gw.api.database.Query.make(ABCompany)
      queryObj.compare(ABCompany#Name, Relop.Equals, name)
      var targetCompany = queryObj.select().AtMostOneRow
      if (queryObj.select().Count != 1) {
        returnString = "There is not exactly one company with the specified name."
      }
      else {
        // targetCompany must be copied from read-only bundle to new bundle
        targetCompany = newBundle.add(targetCompany)
        // Set the Inspection fields as appropriate
        targetCompany.InspectionRequired = true
        targetCompany.InspectionDate = inspectionDate
        // Create note to record the change
        var originalInspectionDate = targetCompany.getOriginalValue("InspectionDate")
        var newNote = new ContactNote() {
          :Subject = "Change to inspection date",
          :ContactNoteType = ContactNoteType.TC_DATA_UPDATE,
          :Body = "Inspection date updated from " + originalInspectionDate + " to " + targetCompany.InspectionDate
        }
        targetCompany.addToContactNotes(newNote)
        returnString = targetCompany.Name + ": " + newNote.Body
      }
      // runWithNewBundle() executes an implicit commit
    }, "su")
    return returnString
  }

  public static function setInspectionDateByEmployee(person: ABPerson, inspectionDate: Date): String {
    // This method finds the company that employees the given person and sets
    // the inspection date to the specified date. It also creates a
    // contact note to document this.
    // This method adds the company to the new bundle using a foreign key.
    var returnString: String
    Transaction.runWithNewBundle(\newBundle -> {
      var targetCompany = person.Employer
      if (targetCompany == null) {
        returnString = "The specified person has no employer."
      }
      else {
        // targetCompany must be copied from read-only bundle to new bundle
        targetCompany = newBundle.add(targetCompany)
        // Set the Inspection fields as appropriate
        targetCompany.InspectionRequired = true
        targetCompany.InspectionDate = inspectionDate
        // Create note to record the change
        var newNote = new ContactNote()
        newNote.Subject = "Change to inspection date"
        newNote.ContactNoteType = ContactNoteType.TC_DATA_UPDATE
        var originalInspectionDate = targetCompany.getOriginalValue("InspectionDate")
        newNote.Body = "Inspection date updated from " + originalInspectionDate +
            " to " + targetCompany.InspectionDate
        targetCompany.addToContactNotes(newNote)
        returnString = targetCompany.Name + ": " + newNote.Body
        // test person
      }
      // runWithNewBundle() executes an implicit commit
    }, "su")
    return returnString
  }
}
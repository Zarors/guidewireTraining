package trainingapp.demo.gosu

uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.entity.IEntityPropertyInfo
uses gw.transaction.Transaction
uses gw.pl.persistence.core.Key

uses java.util.Date

class BundleExamples {
  /**
     Finds the company with the specified PUBLIC ID, sets the inspection date to the specified date, and creates a contact note.
     Example of adding read-only entity from query to a new bundle, editing an entity, adding a new entity to a new bundle, and of using the addToArray() method
  */
  public static function setInspectionDateByPublicID(publicID: String, inspectionDate: Date): String {
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
        // Creates note to record the change; uses helper function; note is writable because created in new bundle context
        var note = createABCompanyNoteForInspection(targetCompany, inspectionDate)
        if (note != null) {
          // Creates target company foreign key for note
          targetCompany.addToContactNotes(note)
          returnString = targetCompany.Name + ": " + note.Body
        }
      }
      // runWithNewBundle() executes an implicit commit; user context is required when none is supplied
    }, "su")
    return returnString
  }

  /**
     Finds the company with the specified NAME, sets the inspection date to the specified date, and creates a contact note.
     Example of adding read-only entity from query to a new bundle, editing an entity, adding a new entity to a new bundle, and of using the addToArray() method
  */
  public static function setInspectionDateByName(name: String, inspectionDate: Date): String {
    var returnString: String
    Transaction.runWithNewBundle(\newBundle -> {
      var queryObj = Query.make(ABCompany)
      queryObj.compare(ABCompany#Name, Relop.Equals, name)
      var count = queryObj.select().Count
      if (count != 1) {
        returnString = "There is not exactly one company with the specified name. There are " + count + " with the " + name + " name."
      }
      else {
        var targetCompany = queryObj.select().AtMostOneRow
        // targetCompany must be copied from read-only bundle to new bundle
        targetCompany = newBundle.add(targetCompany)
        // Set the Inspection fields as appropriate
        targetCompany.InspectionRequired = true
        targetCompany.InspectionDate = inspectionDate
         // Creates note to record the change; uses helper function; note is writable because created in new bundle context
        var note = createABCompanyNoteForInspection(targetCompany, inspectionDate)
        if (note != null) {
           // Creates target company foreign key for note
          targetCompany.addToContactNotes(note)
          returnString = targetCompany.Name + ": " + note.Body
        }
      }
      // runWithNewBundle() executes an implicit commit; user context is required when none is supplied
    }, "su")
    return returnString
  }

  /**
     Finds the company that employs the given person, sets the inspection date to the specified date, and creates a contact note.
     Example of getting a foreign key entity, adding the read-only foreign key entity to a new bundle, editing an entity,  adding a new entity to a new bundle, and of using the addToArray() method
  */
  public static function setInspectionDateByEmployee(person: ABPerson, inspectionDate: Date): String {
    // The argument, person, is of the type ABPerson and may be in a writable bundle already. However, there may not be a permissive user context for editing person bundle. For this reason, add target company to a new writable bundle
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
        // Create note to record the change ; use helper function
        var note = createABCompanyNoteForInspection(targetCompany, inspectionDate)
        if (note != null) {
          // Creates target company foreign key for note
          targetCompany.addToContactNotes(note)
          returnString = targetCompany.Name + ": " + note.Body
        }
      }
      // runWithNewBundle() executes an implicit commit; user context is required when none is supplied
    }, "su")
    return returnString
  }

  /**
    Finds the company by KEY, sets the inspection date to the specified date, and creates a contact note.
    Example of adding read-only entity from loadBean() of current bundle to a new bundle, editing an entity, adding a new entity to a new bundle, and of using the addToArray() method
  */
  public static function setInspectionDateByLoadBean(key: Key, inspectionDate: Date): String {
    // The current bundle may be read-only or writable. However, there may not be a permissive user context for editing the current bundle. For this reason, add target company to a new writable bundle
    var returnString: String
    var currentBundle = Transaction.getCurrent()
    if (currentBundle != null) {
      var targetCompany = currentBundle.loadBean(key)
      if (targetCompany != null && targetCompany typeis ABCompany) {
        Transaction.runWithNewBundle(\newBundle -> {
          targetCompany = newBundle.add(targetCompany)
          targetCompany.InspectionRequired = true
          targetCompany.InspectionDate = inspectionDate
          // Create note to record the change ; use helper function
          var note = createABCompanyNoteForInspection(targetCompany, inspectionDate)
          if (note != null) {
             // Creates target company foreign key for note
            targetCompany.addToContactNotes(note)
            returnString = targetCompany.Name + ": " + note.Body
          }
          // runWithNewBundle() executes an implicit commit
        }, "su")
      } else {
        returnString = "There is no company with the specified public ID."
      }
    } else {
      returnString = "No current bundle."
    }
    return returnString
  }

  /**
     For a given company, sets the inspection date to the specified date, and creates a contact note.
     Example of creating a new bundle taht requies an explicit commit, editing an entity, adding a new entity to a new bundle, and of using the addToArray() method
 */
  public static function setInspectionDateWithBundle(anABContact: ABCompany, inspectionDate: Date): String {
    var returnString: String
    var targetCompany = anABContact
    if (targetCompany != null && targetCompany typeis ABCompany) {
      var newBundle = Transaction.newBundle()
      // targetCompany must be copied to the new bundle
      targetCompany = newBundle.add(targetCompany)
      targetCompany.InspectionRequired = true
      targetCompany.InspectionDate = inspectionDate
      // Create note to record the change ; use helper function
      var note = createABCompanyNoteForInspection(targetCompany, inspectionDate)
      if (note != null) {
         // Creates target company foreign key for note
        targetCompany.addToContactNotes(note)
        returnString = targetCompany.Name + ": " + note.Body
      }
      newBundle.commit()
    } else {
      returnString = "No company."
    }
    return returnString
  }

  /**
      Helper Method
  */
  private static function createABCompanyNoteForInspection(targetCompany: ABCompany, inspectionDate: Date): ContactNote {
    // It is possible to create the FK to ABCompany in the helper method since targetCompany has publicID
    // For educational purposes, this is done in the calling method's entity.addToContactNotes(note)
    var newNote = new ContactNote()
    newNote.Subject = "Change to inspection date"
    newNote.ContactNoteType = typekey.ContactNoteType.TC_DATA_UPDATE
    var originalInspectionDate = targetCompany.getOriginalValue(ABCompany#InspectionDate.getPropertyInfo() as IEntityPropertyInfo)
    newNote.Body = String.format("Inspection date updated from %s to %s ", {originalInspectionDate, targetCompany.InspectionDate})
    return newNote
  }
}


package trainingapp.entity

uses gw.transaction.Transaction

enhancement ABContactEnhancement: entity.ABContact {
  /* Returns true if contact has at least one open FlagEntry
  */

  property get IsFlagged(): boolean {
    return this.FlagEntries.hasMatch(\e -> e.IsOpen)
  }

  // end of property


  /* Returns true if contact has at least one vendor evaluation
     whose status is unverified or pending.
  */

  property get HasUnverifiedEvaluations(): boolean {
    var anyUnverifiedEvals: boolean = false
    for (thisVendorEval in this.VendorEvaluations) {
      if ((thisVendorEval.Status == typekey.VendorEvaluationStatus.TC_UNVERIFIED) or (thisVendorEval.Status == typekey.VendorEvaluationStatus.TC_PENDING)) {
        anyUnverifiedEvals = true
      }
    }
    return anyUnverifiedEvals
  }

  // end of property


  /* This functions deletes all addresses associated to a contact except
     for the current primary address.
  */

  function deleteSecondaryAddresses(): void {
    for (currentAddress in this.SecondaryAddresses) {
      this.removeAddress(currentAddress)
    }
  }

  // end of function


  /* This function executes two actions. (1) It notes that the current user viewed the
     given contact. This is used to determine which contact to display if the Contact
     tab is clicked. (2) It creates a history event identifying that the given
     contact was viewed by the current user. (This function does nothing
     if the RecordInHistory-UserViewsOfContacts script parameter is set to false.)
  */

  function recordContactViewed(): void {
    // This function is called from the ABContact location group's afterEnter
    // property. Because it is called from a PCF file, there is no database
    // commit. Therefore, a new bundle must be created so that data can
    // be committed to the database.
    var currentUser = User.util.getCurrentUser()
    // create new bundle
    Transaction.runWithNewBundle(\bundle -> {
      // NOTE: The ABContact that the keyword "this" references is not in this new
      // bundle, and any changes made to "this" will not get committed when the
      // new bundle is committed. Therefore, the code must create a copy of the
      // contact that "this" references inside the new bundle and make changes
      // to that copy. This in-the-bundle copy is named contactInNewBundle.
      // Recording view of contact in ViewedContact object
      var newViewedContact = new ViewedContact()
      var contactInNewBundle = bundle.add(this)
      newViewedContact.ViewedContact = contactInNewBundle
      newViewedContact.ViewingUser = currentUser
      if (ScriptParameters.RecordInHistory_UserViewsOfContacts) {
        // Recording view of contact in contact history
        var newEntry = new HistoryEntry()
        newEntry.EventType = typekey.HistoryEventType.TC_VIEWED
        newEntry.Description = currentUser.DisplayName + " viewed this contact."
        contactInNewBundle.addToHistoryEntries(newEntry)
      }// end if RecordInHistory_UserViewsOfContacts
      // runWithNewBundle() inherently commits the data
    })
  }

  // end of function


  /* This functions creates a new contact note associated to the ABContact.
  */

  function addContactNote(): ContactNote {
    var newContactNote = new ContactNote()
    this.addToContactNotes(newContactNote)
    return newContactNote
  }
  
  // end of function


  /* As of ContactManager 7.0, every new contact must have at least one contact tag.
     This functionality is not relevant to TrainingApp, so all references to contact
     tags have been removed from the UI. This method is used when a new contact is
     being created and a default tag is needed (such as the NewContact page's
     beforeCommit property).
  */
  
  function addDefaultTagToNewContact(): void {
    var defaultTag = new ABContactTag()
    defaultTag.Type = typekey.ContactTagType.TC_CLAIMPARTY
    this.addToTags(defaultTag)
  }
  
  // end of function
}
// end ABContactEnhancement enhancement


package trainingapp.restapi

uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.api.json.JsonConfigAccess
uses gw.api.json.JsonObject
uses gw.api.json.mapping.JsonMappingOptions
uses gw.api.json.mapping.TransformResult
uses gw.transaction.Transaction
uses jsonschema.trn.ta.contact.v1_0.ContactUpdate
uses jsonschema.trn.ta.contactnote.v1_0.ContactNoteDetails

class ContactAPIHandler {

  function getContact(contactId : String, filter : String) : TransformResult {
    // Query for contact
    var contact = findContactById(contactId)
    // Create mapper object
    var mapper = JsonConfigAccess.getMapper("trn.ta.contact-1.0", "ContactDetails")
    if(filter != null) {
      // Create JsonMappingOptions object
      var mappingOpts = new JsonMappingOptions()
      switch(filter) {
        case "contact_details":
          mappingOpts.withFilter("trn.ta.contact_details-1.0")
          break
        case "contactnote_details":
          mappingOpts.withFilter("trn.ta.contactnote_details-1.0")
          break
      }
      return mapper.transformObject(contact, mappingOpts)
    } else {
      return mapper.transformObject(contact)
    }
  }

  function updateContact(contactId : String, body : JsonObject) : String{
    var contact = findContactById(contactId)
    var contactUpdate = ContactUpdate.wrap(body)
    Transaction.runWithNewBundle(\b -> {
      contact = b.add(contact)

      if(body.containsKey("dateOfBirth")) {
        (contact as ABPerson).DateOfBirth = contactUpdate.DateOfBirth
      }

      if(body.containsKey("driversLicenseNumber")) {
        (contact as ABPerson).LicenseNumber = contactUpdate.DriversLicenseNumber
      }

      if(body.containsKey("driversLicenseState")) {
        (contact as ABPerson).LicenseState = contactUpdate.DriversLicenseState
      }
    })
    return ("Contact " + contact.DisplayName + " was successfully updated")
  }

  function createContactNote(contactId : String, body : JsonObject) : void {
    var contact = findContactById(contactId)
    var contactNote = ContactNoteDetails.wrap(body)
    Transaction.runWithNewBundle(\b -> {
      var newNote = new entity.ContactNote()
      newNote.ContactNoteType = contactNote.ContactNoteType
      newNote.IsConfidential = contactNote.Confidential
      newNote.Subject = contactNote.Subject
      newNote.Body = contactNote.Body
      contact.addToContactNotes(newNote)
    })
  }

  private function findContactById(contactId : String) : ABContact {
    // Query for contact
    var queryObj = Query.make(ABContact)
    queryObj.compare(ABContact#PublicID, Relop.Equals, contactId)
    var targetObj = queryObj.select().AtMostOneRow
    return targetObj
  }

}

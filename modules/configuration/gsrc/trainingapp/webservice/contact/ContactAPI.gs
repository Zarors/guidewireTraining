package trainingapp.webservice.contact
uses gw.api.webservice.exception.ServerStateException
uses gw.api.webservice.exception.PermissionException
uses gw.api.webservice.exception.BadIdentifierException
uses gw.xml.ws.annotation.WsiWebService
uses gw.xml.ws.annotation.WsiPermissions
uses gw.xml.ws.annotation.WsiAvailability
uses gw.xml.ws.annotation.WsiGenInToolkit

@WsiWebService
@WsiPermissions({SystemPermissionType.TC_ABEDIT})
@WsiAvailability(MAINTENANCE)
@WsiGenInToolkit

class ContactAPI {

  @Throws(ServerStateException, "")
  @Throws(PermissionException, "")
  @Throws(BadIdentifierException, "")

  // Method that simply returns a value
  function doesContactExist (publicId : String) : boolean {
    var queryObj = gw.api.database.Query.make(ABContact)
    queryObj.compare("PublicID", Equals, publicId)
    return (not queryObj.select().Empty)
  }

  // Method that modifies data
  function setContactEmail (publicId : String, email : String)
      : void {
    // query for contact with given public ID
    var queryObj = gw.api.database.Query.make(ABContact)
    queryObj.compare("PublicID", Equals, publicId)
    var targetContact = queryObj.select().AtMostOneRow
    // create new bundle    
    gw.transaction.Transaction.runWithNewBundle( \ newBundle -> {
      // Queried contact is in read-only bundle. Add it to this bundle
      targetContact = newBundle.add(targetContact)
      // Modify contact
      targetContact.EmailAddress1 = email
      // runWithNewBundle implicitly commits bundle
      })
  }

  // Method that returns instance of a Gosu class
  function getContactInfo (publicId : String) : ContactInfo {
    var queryObj = gw.api.database.Query.make(ABContact)
    queryObj.compare("PublicID", Equals, publicId)
    var targetContact = queryObj.select().AtMostOneRow
    var aContactInfo = new ContactInfo()
    aContactInfo.contactName = targetContact.DisplayName
    aContactInfo.contactType = targetContact.Subtype.DisplayName
    aContactInfo.email = targetContact.EmailAddress1
    aContactInfo.primaryPhone =
        targetContact.PrimaryPhone.DisplayName
    return aContactInfo
  }
}






















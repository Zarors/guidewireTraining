package gw.webservice.pl.pl900.personaldata

uses gw.api.database.Query
uses gw.api.personaldata.PersonalDataDestroyer
uses gw.api.system.PLLoggerCategory
uses gw.api.webservice.exception.BadIdentifierException
uses gw.api.webservice.exception.RequiredFieldException
uses gw.api.webservice.exception.SOAPException
uses gw.personaldata.PersonalDataDestructionController
uses gw.plugin.Plugins
uses gw.plugin.personaldata.PersonalDataDestruction
uses gw.xml.ws.annotation.WsiPermissions
uses gw.xml.ws.annotation.WsiWebService

uses java.lang.Deprecated


/**
 * @deprecated (since 10.0.0) - Use the pl1000 version of this API.
 */
@WsiWebService("http://guidewire.com/pl/ws/gw/webservice/pl/pl900/personaldata/PersonalDataDestructionAPI")
@Export
@Deprecated
class PersonalDataDestructionAPI {

  static var _logger = PLLoggerCategory.DATA_DESTRUCTION_REQUEST

  /**
   * Contact will be destroyed if possible and the result will sent through the PersonalDataDestruction plugin
   * @param addressBookUID address book identifier for contact
   * @param requesterID The identifier for who is making the request
   * @return Returns a unique publicID that will be used to track this removal request
   */
  @Throws(SOAPException, "If communication errors occur")
  @Throws(RequiredFieldException, "If required field is missing")
  @Throws(BadIdentifierException, "If AddressBookUID is not found")
  @Throws(RuntimeException, "RuntimeException occured please look at exception message")
  @Param("addressBookUID", "The address book UID of the contact to be removed.")
  @Param("requesterID", "The requester unique id")
  @Returns("A unique publicID for this request")
  @WsiPermissions({SystemPermissionType.TC_REQUESTCONTACTDESTRUCTION})
  function requestContactRemovalWithABUID(addressBookUID : String, requesterID: String) : String {
    require(addressBookUID, "addressBookUID")
    require(requesterID, "requester")

    var foundPurgeRequest = PersonalDataDestructionController.findPurgeRequestWithAddressBookUID(addressBookUID)
    var publicIDs = Destroyer.translateABUIDToPublicIDs(addressBookUID)
    if (publicIDs.isEmpty() and foundPurgeRequest == null) {
      throw new BadIdentifierException("Could not find contact with AddressBookUID of " + addressBookUID)
    }

    var contactPurgeRequester : PersonalDataDestructionRequester

    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      if (foundPurgeRequest == null) {
        foundPurgeRequest = new PersonalDataDestructionRequest(bundle){:AddressBookUID = addressBookUID}
      } else {
        foundPurgeRequest = bundle.add(foundPurgeRequest)
      }

      publicIDs
          .where(\publicID -> not foundPurgeRequest.PersonalDataContactDestructionRequests*.ContactPublicID.contains(publicID))
          .each(\publicID -> {
            var contactDestructionRequest = new PersonalDataContactDestructionRequest(bundle){:ContactPublicID = publicID}
            foundPurgeRequest.addContactDestructionRequest(contactDestructionRequest)
      })

      contactPurgeRequester = new PersonalDataDestructionRequester(bundle){:RequesterID = requesterID}
      contactPurgeRequester.PersonalDataDestructionRequest = foundPurgeRequest

    })

    if (foundPurgeRequest.AllRequestsFulfilled) {
      PersonalDataDestructionController.notifyRequesterDestructionRequestHasFinished(contactPurgeRequester)
    }

    return contactPurgeRequester.PublicID
  }

  /**
   * Contact will be destroyed if possible and the result will sent through the PersonalDataDestruction plugin
   * @param contactPublicID contact publicID identifier for the contact
   * @param requesterID The identifier for who is making the request
   * @return Returns a unique publicID that will be used to track this removal request
   */
  @Throws(SOAPException, "If communication errors occur")
  @Throws(RequiredFieldException, "If required field is missing")
  @Throws(BadIdentifierException, "If PublicID is not found")
  @Throws(RuntimeException, "RuntimeException occured please look at exception message")
  @Param("contactPublicID", "The contact public ID contact to be removed.")
  @Param("requesterID", "The requester unique id")
  @Returns("A unique publicID for this request")
  @WsiPermissions({SystemPermissionType.TC_REQUESTCONTACTDESTRUCTION})
  function requestContactRemovalWithPublicID(contactPublicID : String, requesterID: String) : String {
    require(contactPublicID, "contactPublicID")
    require(requesterID, "requester")

    var foundContactPurgeRequest = PersonalDataDestructionController.findPurgeRequestWithPublicID(contactPublicID)

    if ((not Destroyer.doesContactWithPublicIDExist(contactPublicID)) and foundContactPurgeRequest == null) {
      throw new BadIdentifierException("Could not find contact with publicID: " + contactPublicID)
    }

    var contactPurgeRequester : PersonalDataDestructionRequester


    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var dataDestructionRequest : PersonalDataDestructionRequest

      if (foundContactPurgeRequest == null) {
        foundContactPurgeRequest = new PersonalDataContactDestructionRequest(bundle){:ContactPublicID = contactPublicID}
        dataDestructionRequest = findAssociatedDataDestructionRequest(contactPublicID)
        if (dataDestructionRequest == null) {
          var abuid = Destroyer.translatePublicIDtoABUID(contactPublicID)
          dataDestructionRequest = new PersonalDataDestructionRequest(bundle){:AddressBookUID = abuid}
        }  else {
          dataDestructionRequest = bundle.add(dataDestructionRequest)
        }
        dataDestructionRequest.addContactDestructionRequest(foundContactPurgeRequest)
      } else {
        dataDestructionRequest = foundContactPurgeRequest.PersonalDataDestructionRequest
      }

      contactPurgeRequester = new PersonalDataDestructionRequester(bundle){:RequesterID = requesterID}
      contactPurgeRequester.PersonalDataDestructionRequest = dataDestructionRequest
    })

    if (foundContactPurgeRequest.PersonalDataDestructionRequest.AllRequestsFulfilled) {
      PersonalDataDestructionController.notifyRequesterDestructionRequestHasFinished(contactPurgeRequester)
    }


    return contactPurgeRequester.PublicID
  }

  private function findAssociatedDataDestructionRequest(publicID: String) : PersonalDataDestructionRequest {
    if (publicID == null or publicID.isEmpty()) {
      return null
    }

    var abuid = Destroyer.translatePublicIDtoABUID(publicID)
    if (abuid == null) {
      return null
    }
    var abuidRequest = Query.make(PersonalDataDestructionRequest).compare(PersonalDataDestructionRequest#AddressBookUID, Equals, abuid).select().AtMostOneRow
    return abuidRequest
  }

  /**
   * Credential, User, and UserContact will be obfuscated if possible
   * @param username the username from user's credential
   * @return Returns true if obfuscation is successful for all entities, else false
   */
  @Throws(SOAPException, "If communication errors occur")
  @Throws(RequiredFieldException, "If required field is missing")
  @Throws(BadIdentifierException, "If username is not found")
  @Throws(RuntimeException, "RuntimeException occured please look at exception message")
  @Param("username", "The username from user's credential to be obfuscated")
  @Returns("True if user obfuscation is successful")
  @WsiPermissions({SystemPermissionType.TC_REQUESTCONTACTDESTRUCTION})
  function destroyUser(username : String) : boolean {
    require(username, "username")

    var credential = Query.make(Credential).compare(Credential#UserName, Equals, username).select().AtMostOneRow

    if(credential == null) {
      throw new BadIdentifierException("Could not find username: " + username)
    }

    var user = Query.make(User).compare(User#Credential, Equals, credential).select().AtMostOneRow

    if (user == null) {
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        credential = bundle.add(credential) as Credential
        credential.obfuscate()
        _logger.warn("On destroyUser, Credential was found with: " + username + ". User was not found")
      })

      credential = credential.refresh() as Credential
      return credential.Obfuscated
    } else {
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        user = bundle.add(user) as User
        user.obfuscate() //OOTB implementation of user.obfuscate also obfuscates Credential and userContact
      })

      user = user.refresh() as User

      if (user.Obfuscated and user.Contact.Obfuscated and user.Credential.Obfuscated) {
        return true
      } else {
        _logger.warn("On destroyUser, an entity returned false from obfuscation: User (" + user.PublicID + ") - "
            + user.Obfuscated + ", UserContact (" + user.Contact.PublicID + ") - " + user.Contact.Obfuscated
            + ", Credential (" + user.Credential.PublicID + ") - " + user.Credential.Obfuscated)
        return false
      }
    }
  }

  /**
   * Checks if the contact with address book identifier exists in the database
   * @param addressBookUID address book identifier for contact
   * @return true if the contact is exist in the database, false otherwise
   */
  @Throws(SOAPException, "If communication errors occur")
  @Throws(RequiredFieldException, "If required field is missing")
  @Throws(BadIdentifierException, "If cannot find entity with given identifier")
  @Param("addressBookUID", "The address book unique identifier to check if in use")
  @WsiPermissions({SystemPermissionType.TC_REQUESTCONTACTDESTRUCTION})
  @Returns("true if address book unique identifier is in use")
  function doesABUIDExist(addressBookUID: String): boolean {
    require(addressBookUID, "addressBookUID")
    var publicIDs = Destroyer.translateABUIDToPublicIDs(addressBookUID)

    return !publicIDs.Empty
  }

  /**
   * Checks if the contact with publicID exists in the database
   * @param publicID the publicID for the contact
   * @return true if the contact exists, else false
   */
  @Throws(SOAPException, "If communication errors occur")
  @Throws(RequiredFieldException, "If required field is missing")
  @Throws(BadIdentifierException, "If cannot find entity with given identifier")
  @Param("publicID", "The publicID of the contact to check if in use")
  @WsiPermissions({SystemPermissionType.TC_REQUESTCONTACTDESTRUCTION})
  @Returns("true if address book unique identifier is in use")
  function doesContactWithPublicIDExist(publicID: String): boolean {
    require(publicID, "publicID")
    return Destroyer.doesContactWithPublicIDExist(publicID)
  }

  /**
   * Checks if a pending request for destruction has been made for a contact
   * @param uniqueRequestID The unique identifier given when the original request was made to destroy the contact
   * @return DestructionRequestStatus The status of the pending request for contact destruction
   */
  @Throws(SOAPException, "If communication errors occur")
  @Throws(RequiredFieldException, "If required field is missing")
  @Param("uniqueRequestID", "The unique identifier given when the original request was made to destroy the contact")
  @WsiPermissions({SystemPermissionType.TC_REQUESTCONTACTDESTRUCTION})
  @Returns("DestructionRequestStatus  The current status of the request to remove the address book unique identifier")
  function currentDestructionRequestStatusByRequestID(uniqueRequestID : String): DestructionRequestStatus {
    require(uniqueRequestID, "uniqueRequestID")

    var status = PersonalDataDestructionController.findPurgeRequestWithUniquePublicID(uniqueRequestID)?.Status
    return status ?: TC_DOESNOTEXIST
  }

  private function require(value: String, parameterName: String) {
    if (value == null) {
      throw new RequiredFieldException("Required field " + parameterName + " is null")
    }
    if (value.Empty) {
      throw new RequiredFieldException("Required field " + parameterName + " is empty")
    }
  }

  private property get Destroyer() : PersonalDataDestroyer {
    if (Plugins.isEnabled(PersonalDataDestruction)) {
      return Plugins.get(PersonalDataDestruction).Destroyer
    }

    throw new IllegalStateException("Plugin PersonalDataDestruction has not been enabled")
  }
}
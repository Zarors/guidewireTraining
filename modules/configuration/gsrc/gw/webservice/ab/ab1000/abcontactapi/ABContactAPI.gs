package gw.webservice.ab.ab1000.abcontactapi

uses gw.api.server.AvailabilityLevel
uses gw.api.webservice.exception.AlreadyExecutedException
uses gw.api.webservice.exception.BadIdentifierException
uses gw.api.webservice.exception.DataConversionException
uses gw.api.webservice.exception.DuplicateKeyException
uses gw.api.webservice.exception.EntityStateException
uses gw.api.webservice.exception.PermissionException
uses gw.api.webservice.exception.RequiredFieldException
uses gw.api.webservice.exception.SOAPException
uses gw.api.webservice.exception.SOAPSenderException
uses gw.webservice.contactapi.beanmodel.XmlBackedInstance
uses gw.xml.ws.annotation.WsiAvailability
uses gw.xml.ws.annotation.WsiCheckDuplicateExternalTransaction
uses gw.xml.ws.annotation.WsiExposeEnumAsString
uses gw.xml.ws.annotation.WsiPermissions
uses gw.xml.ws.annotation.WsiWebService

@WsiWebService( "http://guidewire.com/ab/ws/gw/webservice/ab/ab1000/abcontactapi/ABContactAPI" )
@WsiAvailability(AvailabilityLevel.MAINTENANCE)
@WsiPermissions({SystemPermissionType.TC_CLIENTAPP})

@WsiExposeEnumAsString(typekey.ABContact)
@WsiExposeEnumAsString(typekey.AddressType)
@WsiExposeEnumAsString(typekey.AdjudicativeDomain)
@WsiExposeEnumAsString(typekey.ContactBidiRel)
@WsiExposeEnumAsString(typekey.ContactCreationApprovalStatus)
@WsiExposeEnumAsString(typekey.ContactTagType)
@WsiExposeEnumAsString(typekey.Country)
@WsiExposeEnumAsString(typekey.GeocodeStatus)
@WsiExposeEnumAsString(typekey.LegalSpecialty)
@WsiExposeEnumAsString(typekey.LocaleType)
@WsiExposeEnumAsString(typekey.NamePrefix)
@WsiExposeEnumAsString(typekey.NameSuffix)
@WsiExposeEnumAsString(typekey.PrimaryPhoneType)
@WsiExposeEnumAsString(typekey.SpecialtyType)
@WsiExposeEnumAsString(typekey.State)
@WsiExposeEnumAsString(typekey.UnitOfDistance)
@WsiExposeEnumAsString(typekey.VendorAvailabilityType)
@WsiExposeEnumAsString(typekey.VendorType)
@WsiExposeEnumAsString(typekey.DocumentStatusType)
@WsiExposeEnumAsString(typekey.DocumentType)
@WsiExposeEnumAsString(typekey.DocumentSecurityType)
@WsiExposeEnumAsString(typekey.DocumentSection)
@WsiExposeEnumAsString(typekey.LanguageType)

@Export
class ABContactAPI {

  construct() { }

  /**
   * Update an existing contact. Contact information is expected to be in XmlBackedInstance format.
   * First, a preexisting ABContact is selected based on abContactXML.LinkID. If none is found, then a
   * BadIdentifierException is thrown. Then, origValue attributes for all fields and fks being updated
   * are checked against those same values in the local version, and if any discrepancies are found, then
   * an EntityStateException is thrown. In this way, ContactManager manages the versioning of contact-related
   * changes across multiple client applications. If no exceptions have yet been thrown, then
   * ContactIntegrationMapper.populateABContactFromXML is called to populate local entities from
   * abContactXML.
   *
   * The caller must set the transaction id in the soap request headers.  This can be done using
   * ContactAPIUtil.setTransactionId().
   *
   * @param abContactXML the contact information in XmlBackedInstance format
   * @return An AddressBookUIDContainer containing IDs for the Contact and child objects
   */
  @Throws(AlreadyExecutedException, "Instruction with transactionID has previously been executed")
  @Throws(BadIdentifierException, "If cannot find the existing contact")
  @Throws(DataConversionException, "If data format is invalid")
  @Throws(EntityStateException, "If the contact is out of date")
  @Throws(PermissionException, "If the user the remote application is calling ABContactAPI as doesn't have the neccessary permissions for this operation.")
  @Throws(RequiredFieldException, "If required fields are missing")
  @Throws(SOAPException, "Thrown in the event of a general SOAP error")
  @Throws(SOAPSenderException, "Thrown in the event of a general SOAP sender error")
  @WsiCheckDuplicateExternalTransaction
  function updateContact(abContactXML : XmlBackedInstance) : AddressBookUIDContainer {
    ExceptionHandler.require(abContactXML, "abContactXML")
    return ExceptionHandler.handleExceptions<AddressBookUIDContainer>(\->{
      return ABContactAPIUtil.updateContact(abContactXML)
    })
  }

  /**
   * Create a new contact. Contact information is expected to be in XmlBackedInstance format. A new
   * ABContact (of subtype as specified by abContactXML) is created. Then,
   * ContactIntegrationMapper.populateABContactFromXML is called to populate local entities from abContactXML
   *
   * The caller must set the transaction id in the soap request headers.  This can be done using
   * ContactAPIUtil.setTransactionId().
   *
   * @param abContactXML the contact information in XmlBackedInstance format
   * @return An AddressBookUIDContainer containing IDs for the Contact and child objects
   */
  @Throws(AlreadyExecutedException, "Instruction with transactionID has previously been executed")
  @Throws(BadIdentifierException, "If cannot find the existing contact")
  @Throws(DataConversionException, "If data format is invalid")
  @Throws(DuplicateKeyException, "If a provided external unique ID already exists")
  @Throws(PermissionException, "If the user the remote application is calling ABContactAPI as doesn't have the neccessary permissions for this operation.")
  @Throws(RequiredFieldException, "If required fields are missing")
  @Throws(SOAPException, "Thrown in the event of a general SOAP error")
  @Throws(SOAPSenderException, "Thrown in the event of a general SOAP sender error")
  @WsiCheckDuplicateExternalTransaction
  function createContact(abContactXML : XmlBackedInstance) : AddressBookUIDContainer {
    ExceptionHandler.require(abContactXML, "abContactXML")
    return ExceptionHandler.handleExceptions<AddressBookUIDContainer>(\->{
      return ABContactAPIUtil.createContact(abContactXML)
    })
  }

  /**
   * Invokes ValidateABContactCreationPlugin.validateCanCreate() to see if abContactXML
   * has the minimum data required to create an ABContact.
   *
   * @param abContactXML XmlBackedInstance representing an ABContact
   * @return An ABContactAPIValidateCreateContactResult indicating whether
   * validation passed and, in if validation failed, an error message.
   */
  @Throws(RequiredFieldException, "If abContactXML is null")
  @Throws(SOAPException, "Thrown in the event of a general SOAP error")
  @Throws(SOAPSenderException, "Thrown in the event of a general SOAP sender error")
  @Throws(PermissionException, "If the user the remote application is calling ABContactAPI as doesn't have the neccessary permissions for this operation.")
  function validateCreateContact(abContactXML : XmlBackedInstance) : ABContactAPIValidateCreateContactResult {
    ExceptionHandler.require(abContactXML, "abContactXML")
    return ExceptionHandler.handleExceptions<ABContactAPIValidateCreateContactResult>(\->{
      return ABContactAPIUtil.validateCreateContact(abContactXML)
    })
  }


  /**
   * Submit an update to an existing contact which requires approval before being applied. Contact
   * information is expected to be in XmlBackedInstance format.
   *
   * The updateContext contains the application context for the change from the client application.
   *
   * A preexisting ABContact is selected based on abContactXML.LinkID. If none is found, then a
   * BadIdentifierException is thrown. A PendingContactUpdate entity is created for that Contact with the
   * update XML and the context in this call.
   *
   * The caller must set the transaction id in the soap request headers.  This can be done using
   * ContactAPIUtil.setTransactionId().
   *
   * @param abContactXML the contact information in XmlBackedInstance format
   * @param updateContext the application context for this update
   */
  @Throws(AlreadyExecutedException, "Instruction with transactionID has previously been executed")
  @Throws(BadIdentifierException, "If cannot find the existing contact")
  @Throws(DataConversionException, "If data format is invalid")
  @Throws(EntityStateException, "If the contact is out of date")
  @Throws(PermissionException, "If the user the remote application is calling ABContactAPI as doesn't have the neccessary permissions for this operation.")
  @Throws(RequiredFieldException, "If required fields are missing")
  @Throws(SOAPException, "Thrown in the event of a general SOAP error")
  @Throws(SOAPSenderException, "Thrown in the event of a general SOAP sender error")
  @WsiCheckDuplicateExternalTransaction
  function updateContactPendingApproval(
      abContactXML: XmlBackedInstance,
      updateContext: ABContactAPIPendingContactChange) {

    ExceptionHandler.require(abContactXML, "abContactXML")
    ExceptionHandler.require(updateContext, "updateContext")

    ExceptionHandler.handleExceptions(\-> {
      ABContactAPIUtil.updateContactPendingApproval(abContactXML, updateContext)
      return null
    })
  }

  /**
   * Submit a new contact for creation that potentially requires approval. Contact information is
   * expected to be in XmlBackedInstance format.
   *
   * A new ABContact (of subtype as specified by abContactXML) is created. Then,
   * ContactMapper.populateABContactFromXML is called to populate local entities from abContactXML.
   * The status of the contact is set to APPROVAL_NEEDED.
   *
   * The caller must set the transaction id in the soap request headers.  This can be done using
   * ContactAPIUtil.setTransactionId().
   *
   * @param abContactXML the contact information in XmlBackedInstance format
   * @param updateContext the context information about this create request
   * @return An AddressBookUIDContainer containing IDs for the Contact and child objects
   */
   @Throws(AlreadyExecutedException, "Instruction with transactionID has previously been executed")
   @Throws(BadIdentifierException, "If cannot find the existing contact")
   @Throws(DataConversionException, "If data format is invalid")
   @Throws(DuplicateKeyException, "If a provided external unique ID already exists")
   @Throws(PermissionException, "If the user the remote application is calling ABContactAPI as doesn't have the neccessary permissions for this operation.")
   @Throws(RequiredFieldException, "If required fields are missing")
   @Throws(SOAPException, "Thrown in the event of a general SOAP error")
   @Throws(SOAPSenderException, "Thrown in the event of a general SOAP sender error")
   @WsiCheckDuplicateExternalTransaction
   function createContactPendingApproval(abContactXML : XmlBackedInstance,
                                 updateContext : ABContactAPIPendingContactChange) : AddressBookUIDContainer {
    ExceptionHandler.require(abContactXML, "abContactXML")
    ExceptionHandler.require(updateContext, "updateContext")
    return ExceptionHandler.handleExceptions<AddressBookUIDContainer>(\->{
      return ABContactAPIUtil.createContactPendingApproval(abContactXML, updateContext)
    })
   }


  /**
   * Removes the contact with the matching link ID if the contact is not being used by any remote application.
   * If a remote application is not running when this method runs, then the contact is assumed to be in use
   * and is not removed.
   *
   * The caller must set the transaction id in the soap request headers.  This can be done using
   * ContactAPIUtil.setTransactionId().
   *
   * @param abContactXML XmlBackedInstance that contains the linkID of the contact to be removed and miscellaneous information
   * @return whether the contact was successfully removed
   */
  @Throws(AlreadyExecutedException, "Instruction with transactionID has previously been executed")
  @Throws(BadIdentifierException, "If cannot find the contact with given link id")
  @Throws(PermissionException, "If the user the remote application is calling ABContactAPI as doesn't have the neccessary permissions for this operation.")
  @Throws(RequiredFieldException, "If not enough fields are specified for search")
  @Throws(SOAPException, "Thrown in the event of a general SOAP error")
  @Throws(SOAPSenderException, "Thrown in the event of a general SOAP sender error")
  @WsiCheckDuplicateExternalTransaction
  function removeContact(abContactXML : XmlBackedInstance) : boolean {
    ExceptionHandler.require(abContactXML, "abContactXML")
    return ExceptionHandler.handleExceptions<Boolean>(\->{
      return ABContactAPIUtil.removeContact(abContactXML)
    })
  }

  /**
   * Searches for all contacts that match the given search criteria.
   *
   * @param abContactAPISearchCriteria the criteria for the search.  This may not be null.
   * @param abContactAPISearchSpec specifications for how the results should be returned
   * @return ABContactAPISearchResultContainer contains search results
   */
  @Throws(PermissionException, "If the user the remote application is calling ABContactAPI as doesn't have the neccessary permissions for this operation.")
  @Throws(RequiredFieldException, "If not enough fields are specified for search")
  @Throws(SOAPException, "Thrown in the event of a general SOAP error")
  @Throws(SOAPSenderException, "Thrown in the event of a general SOAP sender error")
  function searchContact(abContactAPISearchCriteria : ABContactAPISearchCriteria,
                         abContactAPISearchSpec : ABContactAPISearchSpec)
    : ABContactAPISearchResultContainer {
    ExceptionHandler.require(abContactAPISearchCriteria, "abContactSearchCriteriaInfo")
    ExceptionHandler.require(abContactAPISearchSpec, "abContactAPISearchSpec")
    return ExceptionHandler.handleExceptions<ABContactAPISearchResultContainer>(\->{
      return ABContactAPIUtil.searchContact(abContactAPISearchCriteria, abContactAPISearchSpec) as ABContactAPISearchResultContainer
    })
  }

  /**
   * Finds contacts that match the specified contact.
   *
   * @param abContactXML the XmlBackedInstance for the contact for which to find matches
   * @param abContactAPISearchSpec specifications for how the results should be returned
   * @return ABContactAPIFindDuplicatesResultContainer contains summary information about each match
   */
  @Throws(PermissionException, "If the user the remote application is calling ABContactAPI as doesn't have the neccessary permissions for this operation.")
  @Throws(RequiredFieldException, "If not enough fields are specified for search")
  @Throws(SOAPException, "Thrown in the event of a general SOAP error")
  @Throws(SOAPSenderException, "Thrown in the event of a general SOAP sender error")
  function findDuplicates(abContactXML : XmlBackedInstance,
                          abContactAPISearchSpec : ABContactAPISearchSpec)
                          : ABContactAPIFindDuplicatesResultContainer {
    ExceptionHandler.require(abContactXML, "abContactXML")
    ExceptionHandler.require(abContactAPISearchSpec, "abContactAPISearchSpec")
    return ExceptionHandler.handleExceptions<ABContactAPIFindDuplicatesResultContainer>(\->{
      return (ABContactAPIUtil.findDuplicates(abContactXML, abContactAPISearchSpec)) as ABContactAPIFindDuplicatesResultContainer
    })
  }

  /**
   * Retrieve information about the contact uniquely specified by the linkID
   *
   * @param linkID
   * @return the contact information in XmlBackedInstance format
   */
  @Throws(DataConversionException, "Thrown in the event of a data conversion error")
  @Throws(PermissionException, "If the user the remote application is calling ABContactAPI as doesn't have the neccessary permissions for this operation.")
  @Throws(RequiredFieldException, "If not enough fields are specified for search")
  @Throws(SOAPException, "Thrown in the event of a general SOAP error")
  @Throws(SOAPSenderException, "Thrown in the event of a general SOAP sender error")
  function retrieveContact(linkID : String) : XmlBackedInstance {
    ExceptionHandler.require(linkID, "linkID")
    return ExceptionHandler.handleExceptions<XmlBackedInstance>(\->{
      return ABContactAPIUtil.retrieveContact(linkID)
    })
  }

  /**
   * Retrieve information about the contact's related contacts
   *
   * @param linkID specifies the contact
   * @param relationshipTypes relationship type of the related contacts to return information on. If null,
   *                          then no restriction is enforced on the related contacts returned.
   * @return information about the contact's related contacts
   */
  @Throws(DataConversionException, "Thrown in the event of a data conversion error")
  @Throws(PermissionException, "If the user the remote application is calling ABContactAPI as doesn't have the neccessary permissions for this operation.")
  @Throws(RequiredFieldException, "If not enough fields are specified for search")
  @Throws(SOAPException, "Thrown in the event of a general SOAP error")
  @Throws(SOAPSenderException, "Thrown in the event of a general SOAP sender error")
  function retrieveRelatedContacts(linkID : String, relationshipTypes : ContactBidiRel[]) : RelatedContactInfoContainer {
    ExceptionHandler.require(linkID, "linkID")
    ExceptionHandler.require(relationshipTypes, "relationshipTypes")
    return ExceptionHandler.handleExceptions<RelatedContactInfoContainer>(\->{
      return (ABContactAPIUtil.retrieveRelatedContacts(linkID, relationshipTypes)) as RelatedContactInfoContainer
    })
  }

  /**
   * Get the linkID of the address that replaces the address denoted by the argument because the latter has been
   * merged into the former.
   *
   * @param addressLinkID linkID of an address
   * @return linkID of the address that replaces the address denoted by the argument
   */
  @Throws(BadIdentifierException, "If cannot find the address with given link id")
  @Throws(SOAPException, "Thrown in the event of a general SOAP error")
  @Throws(SOAPSenderException, "Thrown in the event of a general SOAP sender error")
  @Throws(PermissionException, "If the user the remote application is calling ABContactAPI as doesn't have the neccessary permissions for this operation.")
  function getReplacementAddress(addressLinkID : String) : String {
    ExceptionHandler.require(addressLinkID, "addressLinkID")
    return ExceptionHandler.handleExceptions<String>(\->{
      return ABContactAPIUtil.getReplacementAddress(addressLinkID)
    })
  }

  /**
   * Returns the linkID of the contact that replaced the contact denoted by the argument.
   * This happens as a result of a contact merge in the UI or by calling ABContact.replaceWith(ABContact).
   * Returns null if the contact has not been replaced by another contact.
   *
   * @param contactLinkID linkID of an ABContact
   * @return linkID of the ABContact that replaced the ABContact denoted by the argument
   */
  @Throws(BadIdentifierException, "If cannot find the contact with given link id")
  @Throws(SOAPException, "Thrown in the event of a general SOAP error")
  @Throws(SOAPSenderException, "Thrown in the event of a general SOAP sender error")
  @Throws(PermissionException, "If the user the remote application is calling ABContactAPI as doesn't have the neccessary permissions for this operation.")
  function getReplacementContact(contactLinkID : String) : String {
    ExceptionHandler.require(contactLinkID, "contactLinkID")
    return ExceptionHandler.handleExceptions<String>(\->{
      return ABContactAPIUtil.getReplacementContact(contactLinkID)
    })
  }


  /**
   * @param linkID The linkID of an ABContact
   * @return The SpecialistServices for the ABContact with the given LinkID.
   */
  @Throws(BadIdentifierException, "Thrown if ContactManager cannot find the contact with the given LinkID")
  @Throws(RequiredFieldException, "Thrown if contactLinkID is null.")
  @Throws(PermissionException, "If the user the remote application is calling ABContactAPI as doesn't have the neccessary permissions for this operation.")
  function getSpecialistServices(contactLinkID : String) : ABContactAPISpecialistService[] {
    ExceptionHandler.require(contactLinkID, "contactLinkID")
    return ExceptionHandler.handleExceptions<ABContactAPISpecialistService[]>(\->{
      var result = ABContactAPIUtil.getSpecialistServices(contactLinkID)
      return result.toArray(new ABContactAPISpecialistService[result.size()])
    })
  }

  /**
   * Retrieve information about the contact's documents
   *
   * @param contactLinkID specifies the contact
   * @param abContactAPIDocumentSearchCriteria the criteria for the search.  This may not be null.
   * @param abContactAPIDocumentSearchSpec specifications for how the results should be returned
   * @return ABContactAPIDocumentSearchResultContainer contains search results
   */
  @Throws(BadIdentifierException, "Thrown if ContactManager cannot find the contact with the given contactLinkID")
  @Throws(RequiredFieldException, "Thrown if any of contactLinkID, abContactAPIDocumentSearchCriteria or abContactAPIDocumentSearchSpec is null.")
  @Throws(PermissionException, "If the user the remote application is calling ABContactAPI as doesn't have the neccessary permissions for this operation.")
  @Throws(SOAPException, "Thrown in the event of a general SOAP error")
  @Throws(SOAPSenderException, "Thrown in the event of a general SOAP sender error")
  function retrieveDocumentsForContact(contactLinkID : String, abContactAPIDocumentSearchCriteria : ABContactAPIDocumentSearchCriteria,
                                       abContactAPIDocumentSearchSpec : ABContactAPIDocumentSearchSpec) : ABContactAPIDocumentSearchResultContainer {
    ExceptionHandler.require(contactLinkID, "contactLinkID")
    ExceptionHandler.require(abContactAPIDocumentSearchCriteria, "abContactAPIDocumentSearchCriteria")
    ExceptionHandler.require(abContactAPIDocumentSearchSpec, "abContactAPIDocumentSearchSpec")

    return ExceptionHandler.handleExceptions<ABContactAPIDocumentSearchResultContainer>(\->{
      return ABContactAPIUtil.retrieveDocumentsForContact(contactLinkID, abContactAPIDocumentSearchCriteria, abContactAPIDocumentSearchSpec) as ABContactAPIDocumentSearchResultContainer
    })
  }
}

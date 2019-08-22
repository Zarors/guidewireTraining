package gw.web.merge

uses com.guidewire.ab.domain.addressbook.impl.AddressReplacingBundleTransactionCallback
uses com.guidewire.pl.system.bundle.EntityBundleImpl
uses gw.api.locale.DisplayKey
uses gw.api.database.Query
uses gw.api.util.DisplayableException
uses gw.lang.reflect.features.PropertyReference

uses java.lang.IllegalStateException
uses java.lang.ThreadLocal
uses java.util.Date
uses java.util.Map


// Needs to be @Export because the customer might need to change createCopy
@Export
class MergeContactsWebUtil implements IMergeContactsWebUtil {
  
  static var _pendingMergeKeptContact = new ThreadLocal<ABContact>()
  static var _instance : MergeContactsWebUtil as readonly Instance = new MergeContactsWebUtil()
  
  private construct() {}

  /**
   * Creates a shallow copy of the {@link ABContact} and its Tags, Services and PrimaryAddress.
   * This method can be customized to copy any custom fields or subtypes.
   * The preferred way of copying the fields is #copyNonPersisting which creates a shallow
   * copy and marks it as non-persisting.
   * 
   * @param contact The contact of which to make a copy from
   * @return The copied contact
   */
  function createCopy(contact : ABContact) : ABContact {
    var newContact = contact.deepCopyNonPersisting()
    
    // Here's an example of how one might copy additional data
    //  var newEFTRecords = new ArrayList<EFTData>()
    //  for (eftRecord in contact.EFTRecords) {
    //    newEFTRecords.add(contact.copyNonPersisting(eftRecord))
    //  }
    //  newContact.EFTRecords = newEFTRecords as entity.EFTData[]

    return newContact;
  }

  /**
   * Returns the merged contact.  It doesn't actually create it, it's just
   * duplicateContactPair.KeptContact
   * 
   * @return The merged contact
   */
  function createMergedContact(duplicateContactPair : DuplicateContactPair) : ABContact {
    var keptContact = duplicateContactPair.KeptContact
    
    // If it doesn't have any services but the retired contact does, we assume that if
    // the user makes it a vendor, they would probably want the services from the retired
    // contact.
    if (keptContact.SpecialistServices.Empty) {
      keptContact.SpecialistServices = duplicateContactPair.RetiredContact.SpecialistServices
    }
    
    return keptContact
  }

  /**
   * Merges two contacts and its addresses using the information from a {@link MergeContactsAddressHolder}.
   * Makes selected address primary address of the contact and moves kept addresses and contact addresses to
   * the merged contact.
   * 
   * @param contact The contact to merge to
   * @param retiredContact The contact to be merged; will become retired
   * @param addressDataHolder The UI address information
   * @param relatedContactsHolder The UI related contacts information
   * @param eftDataHolder The UI EFT information
   * @param documentContactsHolder The UI Documents information for the contacts
   */
  function merge(keptContact : ABContact, retiredContact : ABContact, addressDataHolder : MergeContactsAddressHolder,
                relatedContactsHolder : MergeContactsLinkedContactsHolder, eftDataHolder : MergeContactsEFTDataHolder,
                documentContactsHolder: MergeContactsDocumentsHolder) {

    // make sure we haven't been merged already
    if(retiredContact.Bundle == null) {
      throw new IllegalStateException("DuplicateContactPair has already been processed")
    }
    var addressDataByAddress = addressDataHolder.AddressDataByAddress
    keptContact.makePrimaryAddress(addressDataHolder.PrimaryAddress)
    mergeContactAddresses(keptContact, addressDataByAddress)
    mergeRetiredAddresses(keptContact, retiredContact, addressDataByAddress)
    mergeRelatedContacts(keptContact, retiredContact, relatedContactsHolder)
    mergeEFTData(keptContact, eftDataHolder)
    mergeReviewSummaries(keptContact, retiredContact)
    mergeDocuments(documentContactsHolder)
    addHistoryEvents(keptContact, retiredContact)
    _pendingMergeKeptContact.set(keptContact)
    retiredContact.replaceWith(keptContact)
  }
  
  /**
   * Tells if the contact is the kept contact in a merge that is in progress.  Called by event rules
   * so we don't send an update for that contact.
   */
  override function updateIsFromMerge(contact : ABContact) : boolean {
    return contact == _pendingMergeKeptContact.get()
  }

  /**
   * Returns a comma separated string of the contact's tags
   */
  function contactTagsDisplay(contact : ABContact) : String {
    return contact.TagTypes
      .sortBy(\ c -> c.DisplayName)
      .sortBy(\ c -> c.Priority)
      .map(\ c -> c.DisplayName)
      .join(", ")
  }

  function contactPhoneDisplay(contact : ABContact, propRef: PropertyReference, showAdd : boolean) : String{
    var display = new gw.api.phone.StandardPhoneOwner(new gw.api.phone.ContactPhoneDelegate(contact, propRef), "", false).format()
    if (display.length == 0 and showAdd)
      display = "add"
    return display
  }

  function getRetiredCreateTime(pair : DuplicateContactPair) : String {
    var createTime : Date = null
    try {
      var retiredContact = pair.RetiredContact
      createTime = retiredContact.CreateTime
    } catch(ise : IllegalStateException) {
      if(ise != null) { // usage to get rid of warning
        createTime = null
      }
    }
    return createTime == null ? "" : createTime.formatDate(gw.i18n.DateTimeFormat.SHORT)
  }

  function getRetiredUpdateTime(pair : DuplicateContactPair) : String {
    var updateTime : Date = null
    try {
      var retiredContact = pair.RetiredContact
      updateTime = retiredContact.UpdateTime
    } catch(ise : IllegalStateException) {
      if(ise != null) {
        updateTime = null
      }
    }
    return updateTime == null ? "" : updateTime.formatDate(gw.i18n.DateTimeFormat.SHORT)
  }

  function getKeptDocuments(duplicateContactPair : DuplicateContactPair) : Document[] {
    return duplicateContactPair.KeptContact.getDocuments()
  }

  function getRetiredDocuments(duplicateContactPair : DuplicateContactPair) : Document[] {
    return duplicateContactPair.RetiredContact.getDocuments()
  }

  //
  // PRIVATE SUPPORT FUNCTIONS
  //
  
  private function addHistoryEvents(keptContact : ABContact, retiredContact : ABContact) {
    addHistoryEvent(true, keptContact, retiredContact.toString(), retiredContact.LinkID)
    addHistoryEvent(false, retiredContact, keptContact.toString(), keptContact.LinkID)
  }
  
  private function addHistoryEvent(isKept : boolean, contact : ABContact, name : String, linkId : String) {
    var type = isKept ? CustomHistoryType.TC_CONTACTMERGEDKEPT : CustomHistoryType.TC_CONTACTMERGEDRETIRED
    var history = contact.addHistory(type, DisplayKey.get("Web.Contacts.MergeContacts.ContactMerged"))
    history.createTrackedChangesNoOriginalValues("Name", "Web.Contacts.MergeContacts.ContactMerged.Name", name)
    history.createTrackedChangesNoOriginalValues("LinkID", "Web.Contacts.MergeContacts.ContactMerged.LinkID", linkId)
  }
  
  private function mergeContactAddresses(contact : ABContact,
          addressDataByAddress : Map<Address, MergeContactsAddressHolder.AddressData>) {
    contact.ContactAddresses.each(\ ca -> {
      var address = ca.Address
      if (not addressDataByAddress[address].Included) {
        setReplacingAddressIdAndRetireContactAddress(ca, true, addressDataByAddress)
      }
    })
  }
    
  private function mergeRetiredAddresses(contact : ABContact, retiredContact : ABContact,
          addressDataByAddress : Map<Address, MergeContactsAddressHolder.AddressData>) {
    for (contactAddress in retiredContact.ContactAddresses) {
      var addressData = addressDataByAddress[contactAddress.Address]
      if (addressData.Included and not addressData.Primary) {
        contactAddress.Contact = contact
        continue
      }
      if (not addressData.Primary) {
        setReplacingAddressIdAndRetireContactAddress(contactAddress, false, addressDataByAddress)
      }
    }
    var primaryAddress = retiredContact.PrimaryAddress
    var addressData = addressDataByAddress[primaryAddress]
    if (addressData.Included and not addressData.Primary) {
      var addressCopy = primaryAddress.copy() as Address
      var btc = new AddressReplacingBundleTransactionCallback(addressCopy, ((EntityBundleImpl)(contact.getBundle())), primaryAddress);
      addressCopy.Bundle.addBundleTransactionCallback(btc) // reset LinkID on addressCopy and set ReplacingLinkID on primaryAddress
      contact.addAddress(addressCopy)
    }
  }

  private function mergeRelatedContacts(contact : ABContact, retiredContact : ABContact, relatedContactsHolder : MergeContactsLinkedContactsHolder) {
    relatedContactsHolder.KeptContactRelatedContacts.each(\ rc -> {
      if (not rc.Included) {
        rc.ContactContact.remove()
      }
    })
    relatedContactsHolder.RetiredContactRelatedContacts.each(\ rc -> {
      var contactContact = rc.ContactContact
      if (rc.Included) {
        contact.addContactByRelationship(contactContact.getBidiRel(retiredContact), contactContact.getOtherContact(retiredContact))
      }
      contactContact.remove()
    })
  }
  
  private function mergeEFTData(contact : ABContact, eftData : MergeContactsEFTDataHolder) {
    eftData.KeptContactData.each(\ d -> {
      if (not d.Included) {
        d.Data.remove()
      }
    })
    eftData.RetiredContactData.each(\ d -> {
      if (d.Included) {
        d.Data.Contact = contact
      }
    })
  }

  private function mergeDocuments(documentData : MergeContactsDocumentsHolder) {
    documentData.mergeDocuments()
  }

  private function mergeReviewSummaries(keptContact : ABContact, retiredContact : ABContact) {
    var summaries = Query.make(ReviewSummary).compare("ABContact", Equals, retiredContact).select()
    if (summaries.Empty) {
      return
    }
    summaries.each(\ s -> {
      var summary = keptContact.Bundle.add(s)
      summary.ABContact = keptContact
    })
    keptContact.UpdateScore = true
  }
  
  private function setReplacingAddressIdAndRetireContactAddress(contactAddress : ABContactAddress,
          isKeptContact : boolean,
          addressDataByAddress : Map<Address, MergeContactsAddressHolder.AddressData>) {
    var address = contactAddress.Address
    address.remove()
    contactAddress.remove()
    var addressData = addressDataByAddress[address]
    if (addressData.DuplicateAddress.NoneValue) {
      address.ReplacingAddressLinkID = null
      return
    }
    maybeSetReplacingAddressLinkId(address, isKeptContact, addressDataByAddress)
  }
  
  private function maybeSetReplacingAddressLinkId(address : Address,
          isKeptContact : boolean,
          addressDataByAddress : Map<Address, MergeContactsAddressHolder.AddressData>) {
    var addressData = addressDataByAddress[address]
    var replacingAddress = addressData.DuplicateAddress.Address
    var replacingAddressData = addressDataByAddress[replacingAddress]
    if (not replacingAddressData.Included and not replacingAddressData.Primary) {
      var contactKey = isKeptContact ? DisplayKey.get("Error.Merge.KeptContact") : DisplayKey.get("Error.Merge.RetiredContact")
      var errorMessage = DisplayKey.get("Error.Merge.DuplicateAddressNeedsToBeIncluded", address, addressData.Contact, contactKey,
          DisplayKey.get("Web.Contacts.ReviewDuplicateContacts.None"))
      throw new DisplayableException(errorMessage)
    }
    address.ReplacingAddressLinkID = replacingAddress.LinkID
  }
}

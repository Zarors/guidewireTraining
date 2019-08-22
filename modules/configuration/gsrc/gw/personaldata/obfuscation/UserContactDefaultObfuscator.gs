package gw.personaldata.obfuscation

uses gw.api.archiving.ArchiveDocumentReferencesUtil
uses gw.api.personaldata.DatabaseReferenceTrackerUtility

@Export
class UserContactDefaultObfuscator extends UserContactLinkedObfuscator {

  private var _addressesToDelete: Collection<Address> = {}
  private var _officialIDsToDelete: Collection<OfficialID> = {}
  private var _tagsToDelete: Collection<ContactTag> = {}
  protected var _userContact : UserContact

  construct(bean: UserContact) {
    super(bean)
    _userContact = getOwner() as UserContact
  }

  override function beforeObfuscate() {
    super.beforeObfuscate()

    var primaryAddress = _userContact.PrimaryAddress

    // retire primary address, which will be deleted after write to database
    if (isOnlySingleOwner(primaryAddress)) {
      _userContact.PrimaryAddress.remove()
      _addressesToDelete.add(primaryAddress)
    }

    // remove contact addresses, and retire the address that it is pointing to
    // contact addresses are not retireable, so will be deleted from the db on commit of the bundle
    removeUnreferencedContactAddresses(_userContact.ContactAddresses)

    // obfuscate or retire official IDs
    retireOrObfuscatedUnreferencedOfficialIDs(_userContact.OfficialIDs)

    // remove versionable Category Scores, this information is never filled OOTB for a UserContact, but could technically since it's available from the supertype
    removeUnreferencedNonRetireables(_userContact.CategoryScores)

    // remove retireable tags, this information is never filled OOTB for a UserContact, but could technically since it's available from the supertype
    removeUnreferencedTags(_userContact.Tags)

    addCallback(new RemoveRetireableTransactionCallback(_addressesToDelete))
    addCallback(new RemoveRetireableTransactionCallback(_officialIDsToDelete))
    addCallback(new RemoveRetireableTransactionCallback(_tagsToDelete))
  }

  private function retireOrObfuscatedUnreferencedOfficialIDs(officialIDs: OfficialID[]) {
    officialIDs.each(\officialID -> {
      if (DatabaseReferenceTrackerUtility.isReferencedFromDatabase(officialID) or
          ArchiveDocumentReferencesUtil.isReferencedFromArchiveDocument(officialID)) {
        if (officialID.OfficialIDType == TC_SSN or officialID.OfficialIDType == TC_FEIN) {
          officialID.obfuscate()
        }
      } else {
        officialID.remove()
        _officialIDsToDelete.add(officialID)
      }
    })
  }

  private function removeUnreferencedContactAddresses(contactAddresses: ContactAddress[]) {
    contactAddresses.each(\contactAddress -> {
      if (not ArchiveDocumentReferencesUtil.isReferencedFromArchiveDocument(contactAddress.Address) and
          DatabaseReferenceTrackerUtility.getBeansThatPointToMe(contactAddress.Address).Count == 1) {
        contactAddress.Address.remove()
        _addressesToDelete.add(contactAddress.Address)
      }
      contactAddress.remove()
    })
  }

  private function removeUnreferencedTags(tags: ContactTag[]): void {
    tags.each(\tag -> {
      if (not DatabaseReferenceTrackerUtility.isReferencedFromDatabase(tag)
          and not ArchiveDocumentReferencesUtil.isReferencedFromArchiveDocument(tag)) {
        tag.remove()
        _tagsToDelete.add(tag)
      }
    })
  }

  override property get UserContact(): UserContact {
    return _userContact
  }
}
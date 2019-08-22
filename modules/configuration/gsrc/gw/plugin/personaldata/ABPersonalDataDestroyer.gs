package gw.plugin.personaldata

uses entity.ABContact
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.api.locale.DisplayKey
uses gw.api.personaldata.ABAbstractPersonalDataDestroyer
uses gw.api.system.PLLoggerCategory
uses gw.plugin.Plugins

@Export
class ABPersonalDataDestroyer extends ABAbstractPersonalDataDestroyer {

  override function destroyContact(purgeRequest: PersonalDataContactDestructionRequest): ContactDestructionStatus {
    var contact = Query.make(ABContact)
        .withFindRetired(true)
        .compare(ABContact#PublicID, Equals, purgeRequest.ContactPublicID)
        .select()
        .AtMostOneRow

    if(contact != null) {
      return destroyContact(contact)
    }
    PLLoggerCategory.DATA_DESTRUCTION_REQUEST.warn(DisplayKey.get("Java.Purge.CannotPurge.ABContactPublicIDNotFound"))
    return ContactDestructionStatus.TC_COMPLETED
  }

  override function translateABUIDToPublicIDs(addressBookUID: String): List<String> {
    var contact = Query.make(ABContact)
        .compare(ABContact#LinkID, Relop.Equals, addressBookUID)
        .withFindRetired(true)
        .select()
        .AtMostOneRow

    return contact == null ? {} : {contact.PublicID}

  }

  override function doesContactWithPublicIDExist(publicID: String): boolean {
    return not Query.make(ABContact)
            .compare(ABContact#PublicID, Relop.Equals, publicID)
            .withFindRetired(true)
            .select()
            .Empty
  }

  override function translatePublicIDtoABUID(publicID: String): String {
    return Query.make(ABContact)
        .compare(ABContact#PublicID, Relop.Equals, publicID)
        .withFindRetired(true)
        .select()
        .AtMostOneRow
        ?.LinkID
  }

  private function destroyContact(contact: ABContact) : ContactDestructionStatus {
    try {
      if (canDestroy(contact)) {
        purgeImmediately(contact)
        return ContactDestructionStatus.TC_COMPLETED
      }
      return ContactDestructionStatus.TC_NOTDESTROYED
    } catch (e: Exception) {
      ABPersonalDataLogUtil.logErrorNotDestroyed(contact, e)
      return ContactDestructionStatus.TC_NOTDESTROYED
    }
  }

  private function canDestroy(contact: DestructionRootPinnable): boolean {
    var plugin = Plugins.get(PersonalDataDestruction)
    var disposition = plugin.shouldDestroyRoot(contact, null, null)
    return disposition == MUST_DESTROY or disposition == MAY_DESTROY
  }
}
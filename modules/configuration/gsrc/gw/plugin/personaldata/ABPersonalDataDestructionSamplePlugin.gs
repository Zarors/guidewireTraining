package gw.plugin.personaldata

uses entity.ABContact
uses gw.api.locale.DisplayKey
uses gw.api.personaldata.PersonalDataContactDeletableHelper
uses gw.api.personaldata.PersonalDataDestroyer

@Export
class ABPersonalDataDestructionSamplePlugin implements PersonalDataDestruction {

  override function shouldDestroyRoot(root: DestructionRootPinnable, descendants: Collection<DestructionRootPinnable>, origin: DestructionRootPinnable): PersonalDataDisposition {
    if (root typeis ABContact) {
      return shouldDestroyContact(root)
    } else if (root typeis UserContact) {
      return shouldDestroyUser(root)
    }

    return MUST_DESTROY
  }

  private function shouldDestroyContact(contact: ABContact): PersonalDataDisposition {
    if (contact.DoNotDestroy) {
      notifyDataProtectionOfficer(contact, DisplayKey.get("Web.Plugin.PersonalDataDestruction.UnableToDestroyRoot.Reason.DoNotDestroyABContact"))
      return MUST_NOT_DESTROY
    }

    if (contact typeis ABCompany or contact typeis ABPlace) {
      notifyDataProtectionOfficer(contact, DisplayKey.get("Web.Plugin.PersonalDataDestruction.UnableToDestroyRoot.Reason.WrongType", contact.IntrinsicType))
      return MUST_NOT_DESTROY
    }

    if (not PersonalDataContactDeletableHelper.isContactDeletableOnClientApps(contact)) {
      notifyDataProtectionOfficer(contact, DisplayKey.get("Web.Plugin.PersonalDataDestruction.UnableToDestroyRoot.Reason.NotDeletableOnClientApps"))
      return MUST_NOT_DESTROY
    }

    return MUST_DESTROY
  }

  override function shouldDestroyUser(userContact: UserContact): PersonalDataDisposition {
    return MUST_DESTROY
  }

  private function notifyDataProtectionOfficer(contact : ABContact, message : String) {
    notifyDataProtectionOfficer(contact, null, message, null)
  }

  override function notifyDataProtectionOfficer(root: DestructionRootPinnable, title: String, message: String, dateOfError: Date) {
    ABPersonalDataLogUtil.logInfoNotDestroyed(root, message)
  }

  override function notifyExternalSystemsRequestProcessed(requester: PersonalDataDestructionRequester) {

  }

  override function createContext(context: PersonalDataPurgeContext): PersonalDataPurgeContext {
    return context
  }

  override function prepareForPurge(context: PersonalDataPurgeContext) {

  }

  override function postPurge(context: PersonalDataPurgeContext) {

  }

  override property get Destroyer(): PersonalDataDestroyer {
    return new ABPersonalDataDestroyer()
  }
}
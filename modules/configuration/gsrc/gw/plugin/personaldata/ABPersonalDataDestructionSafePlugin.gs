package gw.plugin.personaldata

uses gw.api.personaldata.PersonalDataDestroyer

@Export
class ABPersonalDataDestructionSafePlugin  implements PersonalDataDestruction {

  override function shouldDestroyRoot(root: DestructionRootPinnable, descendants: Collection<DestructionRootPinnable>, origin: DestructionRootPinnable): PersonalDataDisposition {
    notifyDataProtectionOfficer(root, "Safe plugin implementation always returns MUST_NOT_DESTROY")
    return MUST_NOT_DESTROY
  }

  override function shouldDestroyUser(userContact: UserContact): PersonalDataDisposition {
    notifyDataProtectionOfficer(userContact, "Safe plugin implementation always returns MUST_NOT_DESTROY")
    return MUST_NOT_DESTROY
  }

  private function notifyDataProtectionOfficer(contact : DestructionRootPinnable, message : String) {
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
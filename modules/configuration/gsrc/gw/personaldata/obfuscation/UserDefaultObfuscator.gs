package gw.personaldata.obfuscation

@Export
class UserDefaultObfuscator extends UserContactLinkedObfuscator {

  construct(bean : User) {
    super(bean)
  }

  override function beforeObfuscate() {
    super.beforeObfuscate()
    var user = getOwner() as User
    if (user.Credential.Active) {
      throw new IllegalStateException("An active user cannot be destroyed")
    }
    user.Credential.obfuscate()
    user.Contact.obfuscate()

    // remove array of join entity AttributeUser
    removeUnreferencedNonRetireables(user.Attributes)
    // remove array of join entity UserRegion
    removeUnreferencedNonRetireables(user.Regions)

    if (isOnlySingleOwner(user.UserSettings)) {
      user.UserSettings.remove()
      addCallback(new RemoveRetireableTransactionCallback({user.UserSettings}))
    }
  }

  override property get UserContact(): UserContact {
    return (getOwner() as User).Contact
  }
}
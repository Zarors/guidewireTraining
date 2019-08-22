package gw.personaldata.obfuscation

uses gw.api.database.Query

@Export
class CredentialDefaultObfuscator extends UserContactLinkedObfuscator {

  construct(bean : Credential) {
    super(bean)
  }

  override function beforeObfuscate() {
    super.beforeObfuscate()

    var credential = getOwner() as Credential
    if (credential.Active) {
      throw new IllegalStateException("An active credential cannot be destroyed")
    }
  }

  override property get UserContact() : UserContact {
    var credential = getOwner() as Credential
    var user = Query.make(User).compare(User#Credential, Equals, credential).select().first()
    return user?.Contact
  }
}
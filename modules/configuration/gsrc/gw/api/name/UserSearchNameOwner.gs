package gw.api.name

uses gw.api.locale.DisplayKey
uses java.util.Set

@Export
class UserSearchNameOwner extends NameOwnerBase {

  construct (criteria : ContactSearchCriteria) {
    ContactName = new PLContactSearchNameDelegate(criteria)
    AlwaysShowSeparateFields = true
  }

  override property get RequiredFields() : Set<NameOwnerFieldId> {
    return NameOwnerFieldId.NO_FIELDS
  }

  override property get HiddenFields() : Set<NameOwnerFieldId> {
    return NameOwnerFieldId.HIDDEN_FOR_SEARCH
  }

  override property get ContactNameLabel() : String {
    return DisplayKey.get("Web.ContactCriteria.CompanyName")
  }

  override property get ContactNamePhoneticLabel() : String {
    return DisplayKey.get("Web.ContactCriteria.CompanyNamePhonetic")
  }

  override property get ShowNameSummary() : boolean {
    return false
  }
}
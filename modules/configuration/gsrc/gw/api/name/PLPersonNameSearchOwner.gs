package gw.api.name
uses java.util.Set

@Export
class PLPersonNameSearchOwner extends NameOwnerBase {

  construct (criteria : ContactSearchCriteria) {
    ContactName = new PLContactCriteriaDelegate(criteria)
    AlwaysShowSeparateFields = true
  }

  override property get RequiredFields() : Set<NameOwnerFieldId> {
    return NameOwnerFieldId.NO_FIELDS
  }

  override property get HiddenFields() : Set<NameOwnerFieldId> {
    return NameOwnerFieldId.HIDDEN_FOR_SEARCH
  }

  override property get ShowNameSummary() : boolean {
    return false
  }
}
package gw.api.name

uses gw.api.locale.DisplayKey
uses java.util.Set

@Export
class SearchNameOwner extends NameOwnerBase {

    construct (searchCriteria: ABContactSearchCriteria, visible : boolean) {
      _searchCriteria = searchCriteria
      _contactName = new SearchContactNameDelegate(searchCriteria, visible)
      _personName = new SearchPersonNameDelegate(searchCriteria, visible)
      AlwaysShowSeparateFields = true
    }

    construct (searchCriteria: ABContactSearchCriteria) {
      this(searchCriteria, true)
  }

  var _searchCriteria : ABContactSearchCriteria
  var _contactName : ContactNameFields
  var _personName : PersonNameFields

  override property get ContactName() : ContactNameFields {
    return _contactName
  }

  override property get PersonName() : PersonNameFields {
    return _personName
  }

  override property get RequiredFields() : Set <NameOwnerFieldId> {
    return NameOwnerFieldId.NO_FIELDS
  }

  override property get HiddenFields() : Set <NameOwnerFieldId> {
    return NameOwnerFieldId.HIDDEN_FOR_SEARCH
  }

  override property get ContactNameLabel() : String {
    var rv : String = null
    if (gw.api.util.TypeUtil.isNominallyOrStructurallyAssignable(entity.ABPerson.Type, _searchCriteria.ContactSubtypeType)) {
      rv = DisplayKey.get("Web.AddressBook.Search.LastName")
    } else if (gw.api.util.TypeUtil.isNominallyOrStructurallyAssignable(entity.ABCompany.Type, _searchCriteria.ContactSubtypeType) or gw.api.util.TypeUtil.isNominallyOrStructurallyAssignable(entity.ABPlace.Type, _searchCriteria.ContactSubtypeType)) {
      rv = DisplayKey.get("Web.AddressBook.Search.Name")
    } else {
      rv = DisplayKey.get("Web.AddressBook.Search.ContactName")
    }
    return rv
  }

  override property get ContactNamePhoneticLabel() : String {
    if (gw.api.util.TypeUtil.isNominallyOrStructurallyAssignable(entity.ABCompany.Type, _searchCriteria.ContactSubtypeType) or gw.api.util.TypeUtil.isNominallyOrStructurallyAssignable(entity.ABPlace.Type, _searchCriteria.ContactSubtypeType)) {
      return DisplayKey.get("Web.ContactDetail.Name.OrganizationNamePhonetic")
    }
    return DisplayKey.get("Web.AddressBook.Search.ContactNamePhonetic")
  }

    override property get ShowNameSummary() : boolean {
      return false
    }

}
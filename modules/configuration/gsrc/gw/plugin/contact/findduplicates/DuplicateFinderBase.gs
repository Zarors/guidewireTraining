package gw.plugin.contact.findduplicates

uses gw.api.contact.TooLooseContactDuplicateMatchCriteriaException
uses gw.api.database.Queries
uses gw.api.database.Query
uses gw.entity.IEntityType
uses java.util.ArrayList
uses java.util.List

/**
 * Base class for DuplicateFinder.  DuplicateFinders implement subtype specific behavior
 * for finding matches.
 */
@Export
abstract class DuplicateFinderBase<T extends ABContact> {

  // the contact we're using for the search criteria
  protected var _searchContact : T

  /**
   * Create a new in-memory orbject of the type T.
   */
  final function createNew() : T {
    var constructor = T.Type.TypeInfo.Constructors
      .firstWhere(\ i -> i.Parameters.Count == 0)
    return constructor.Constructor.newInstance({}) as T
  }
  
  abstract function validateMandatoryFields(locale : LocaleType)

  protected function hasNoPrimaryAddress() : boolean {
    return
      _searchContact.PrimaryAddress.AddressLine1 == null and
      _searchContact.PrimaryAddress.City == null and
      _searchContact.PrimaryAddress.State == null and
      _searchContact.PrimaryAddress.PostalCode == null    
  }
  
  protected function hasNoPhoneNumber() : boolean {
    return
      _searchContact.FaxPhone == null and
      _searchContact.HomePhone == null and
      _searchContact.WorkPhone == null
  }
  
  protected function throwException(contact : ABContact, locale : LocaleType, contactSubtypeEvaluated : IEntityType = null) {
    if(contactSubtypeEvaluated == null) {
      contactSubtypeEvaluated = contact.IntrinsicType
    }
    throw new TooLooseContactDuplicateMatchCriteriaException(contactSubtypeEvaluated.SubtypeTypeKey as typekey.ABContact, contact.PrimaryAddress.Country, locale)
  }

  /**
   * Create a new Query of type T.
   */
  final function createQuery() : Query<T> {
    return Queries.createQuery(T as IEntityType)
  }

  function setSearchContact(searchContact : T) {
    _searchContact = searchContact
  }

  /**
   * Generate the queries that will find all exact and potential matches.
   */
  abstract function makeQueries(locale : LocaleType) : List<Query<T>>

  /**
   * Given that resultABContact is at least a potential match, returns whether it's an exact match.
   */
  abstract function isExactMatch(searchContact : T, resultABContact : T, locale : LocaleType) : boolean

  /**
   * returns the set of phone numbers that are present in the search contact.
   */
  function getSearchPhoneNumbers() : String[] {
    var phoneNumbers = new ArrayList<String>()
    if (_searchContact.HomePhone != null) {
      phoneNumbers.add(_searchContact.HomePhoneCountry.Code + _searchContact.HomePhone + _searchContact.HomePhoneExtension)
    }
    if (_searchContact.WorkPhone != null) {
      phoneNumbers.add(_searchContact.WorkPhoneCountry.Code + _searchContact.WorkPhone + _searchContact.WorkPhoneExtension)
    }
    return phoneNumbers.toTypedArray()
  }

  /**
   * Returns true if the search contact has the minimum set of values to query for a potential match
   * on the contact's name.
   */
  abstract function haveName() : boolean

  /**
   * Trims off extra whitespace and turns "" into null.
   */
  function cleanUpString(value : String) : String {
    if (value == null)
      return null
    value = value.trim()
    return value == "" ? null : value
  }

  function addIfNotNull(queries : List<Query<T>>, query : Query<T>) {
    if (query != null)
      queries.add(query)
  }

  ////////////  Helpers

  protected function addressMatches(c : ABContact) : boolean {
    var a1 = _searchContact.PrimaryAddress
    var a2 = c.PrimaryAddress
    if (a1 == null or a2 == null) {
      return false
    }
    return (a1.AddressLine1 == a2.AddressLine1) and
      (a1.City == a2.City) and
      (a1.State == a2.State) and
      (a1.PostalCode == a2.PostalCode)
  }

  reified function equalsAndNotNull<FieldType>(v1 : FieldType, v2 : FieldType) : boolean {
    if (v1 == null) {
      return false
    }
    return v2 typeis String ? (v1 as String).equalsIgnoreCase(v2 as String) : v1 == v2
  }

}

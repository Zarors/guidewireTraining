package gw.plugin.contact.findduplicates
uses java.util.List
uses entity.ABPerson
uses gw.lang.Export
uses gw.plugin.contact.findduplicates.DuplicateFinderBase
uses java.lang.String
uses gw.plugin.contact.findduplicates.querybuilder.PersonQueryBuilder

uses gw.api.database.Query
uses java.util.ArrayList
uses java.util.Date

/**
 * Person subtype helper
 */
@Export
class PersonDuplicateFinder<P extends ABPerson> extends DuplicateFinderBase<P> {

  override function validateMandatoryFields(locale : LocaleType) {
    if (locale == LocaleType.TC_JA_JP) {
      if (_searchContact.LastName == null or
          (hasNoPrimaryAddress() and
              hasNoLicence() and
              hasNoPhoneNumber() and
              _searchContact.DateOfBirth == null))
        throwException(_searchContact, locale, ABPerson)
    } else {
      if (_searchContact.LastName == null or
            (hasNoPrimaryAddress() and
             hasNoLicence() and
             hasNoPhoneNumber() and
             _searchContact.DateOfBirth == null and _searchContact.TaxID == null))
        throwException(_searchContact, locale, ABPerson)
    }
  }
  
  override protected function hasNoPhoneNumber() : boolean {
    return super.hasNoPhoneNumber() and _searchContact.CellPhone == null
  }
  
  protected function hasNoLicence() : boolean {
    return
      _searchContact.LicenseNumber == null and
      _searchContact.LicenseState == null
  }
  
  override function makeQueries(locale : LocaleType) : List<Query<P>> {
    var queries = new ArrayList<Query<P>>()

    if (locale == LocaleType.TC_JA_JP) {

      //Query: Name and PhoneNumber
      if (not hasNoPhoneNumber()) {
        new PersonQueryBuilder<P>(_searchContact)
            .startsWithFirstName()//AND
            .startsWithFirstNameKanji()//AND
            .hasEqualLastName()//AND
            .hasEqualLastNameKanji()//AND
            .hasEqualPhoneNumbers()
            .buildAndAdd(queries)
      }

      //Query: Name and Address
      if (not hasNoPrimaryAddress()) {
        new PersonQueryBuilder<P>(_searchContact)
            .startsWithFirstName()//AND
            .startsWithFirstNameKanji()//AND
            .hasEqualLastName()//AND
            .hasEqualLastNameKanji()//AND
            .hasEqualAddress()
            .hasEqualAddressKanji()
            .buildAndAdd(queries)
      }

      //Query: Name and DateOfBirth
      if (_searchContact.DateOfBirth != null) {
        new PersonQueryBuilder<P>(_searchContact)
            .startsWithFirstName()//AND
            .startsWithFirstNameKanji()//AND
            .hasEqualLastName()//AND
            .hasEqualLastNameKanji()//AND
            .hasEqualBirthDate()
            .buildAndAdd(queries)
      }

      //Query: Name and License
      if (not hasNoLicence()) {
        new PersonQueryBuilder<P>(_searchContact)
            .startsWithFirstName()//AND
            .startsWithFirstNameKanji()//AND
            .hasEqualLastName()//AND
            .hasEqualLastNameKanji()//AND
            .hasEqualLicenseNumber()
            .buildAndAdd(queries)
      }
    } else {
      //Query: Name and TaxID
      if (_searchContact.TaxID != null) {
        new PersonQueryBuilder<P>(_searchContact)
            .hasEqualTaxId()//AND
            .hasEqualLastName()
            .buildAndAdd(queries)
      }

      //Query: Name and PhoneNumber
      if (not hasNoPhoneNumber()) {
        new PersonQueryBuilder<P>(_searchContact)
            .startsWithFirstName()//AND
            .hasEqualLastName()//AND
            .hasEqualPhoneNumbers()
            .buildAndAdd(queries)
      }

      //Query: Name and Address
      if (not hasNoPrimaryAddress()) {
        new PersonQueryBuilder<P>(_searchContact)
            .startsWithFirstName()//AND
            .hasEqualLastName()//AND
            .hasEqualAddress()
            .buildAndAdd(queries)
      }

      //Query: Name and DateOfBirth
      if (_searchContact.DateOfBirth != null) {
        new PersonQueryBuilder<P>(_searchContact)
            .startsWithFirstName()//AND
            .hasEqualLastName()//AND
            .hasEqualBirthDate()
            .buildAndAdd(queries)
      }

      //Query: Name and License
      if (not hasNoLicence()) {
        new PersonQueryBuilder<P>(_searchContact)
            .startsWithFirstName()//AND
            .hasEqualLastName()//AND
            .hasEqualLicenseNumber()
            .buildAndAdd(queries)
      }
    }
    return queries
  }

  override function isExactMatch(
    searchContact : P, resultABContact : P, locale : LocaleType) : boolean {

    if (locale == LocaleType.TC_JA_JP) {
      return false
    } else {
      var exact = (nameMatches(resultABContact) and
          taxIDMatches(resultABContact))

          or
          (nameMatches(resultABContact) and
              dateOfBirthMatches(resultABContact) and
              phoneMatches(resultABContact))

          or
          (nameMatches(resultABContact) and
              dateOfBirthMatches(resultABContact) and
              addressMatches(resultABContact))

      return exact
    }
  }


  override function getSearchPhoneNumbers() : String[] {
    var phoneNumbers = super.getSearchPhoneNumbers().toList()
    if (_searchContact.CellPhone != null) {
      phoneNumbers.add(_searchContact.CellPhoneCountry.Code + _searchContact.CellPhone + _searchContact.CellPhoneExtension)
    }
    return phoneNumbers.toTypedArray()
  }

  override function haveName() : boolean {
    return _searchContact.LastName != null
  }

  protected function nameMatches(resultABContact : P) : boolean {
    // name must always match exactly
    return equalsAndNotNull<String>(_searchContact.FirstName, resultABContact.FirstName) and
           equalsAndNotNull<String>(_searchContact.LastName, resultABContact.LastName)
  }

  protected function dateOfBirthMatches(resultABContact : P) : boolean {
    return equalsAndNotNull<Date>(_searchContact.DateOfBirth, resultABContact.DateOfBirth)
  }

  protected function phoneMatches(resultABContact : P) : boolean {
    // exact if any of the phones match
    var searchPhoneNumbers = getSearchPhoneNumbers()
    var notNullAndContains = \ phone : String ->
      phone != null && searchPhoneNumbers.contains(phone)

    return  notNullAndContains(resultABContact.HomePhoneCountry.Code + resultABContact.HomePhone + resultABContact.HomePhoneExtension) or
            notNullAndContains(resultABContact.WorkPhoneCountry.Code + resultABContact.WorkPhone + resultABContact.WorkPhoneExtension) or
            notNullAndContains(resultABContact.CellPhoneCountry.Code + resultABContact.CellPhone + resultABContact.CellPhoneExtension)
  }

  protected function taxIDMatches(resultABContact : P) : boolean {
    return equalsAndNotNull<String>(_searchContact.TaxID, resultABContact.TaxID)
  }
  
}

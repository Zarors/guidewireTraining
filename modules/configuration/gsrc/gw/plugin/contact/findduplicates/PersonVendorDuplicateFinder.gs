package gw.plugin.contact.findduplicates
uses gw.plugin.contact.findduplicates.PersonDuplicateFinder
uses gw.plugin.contact.findduplicates.querybuilder.PersonQueryBuilder

uses gw.api.database.Query
uses java.util.ArrayList
uses java.util.List

/**
 * PersonVendor subtype helper
 */
@Export
class PersonVendorDuplicateFinder extends PersonDuplicateFinder<ABPersonVendor> {

  override function validateMandatoryFields(locale : LocaleType) {
    if (locale == LocaleType.TC_JA_JP) {
      if (_searchContact.LastName == null or
          (hasNoPrimaryAddress() and
              hasNoPhoneNumber()))
        throwException(_searchContact, locale)
    } else {
      if (_searchContact.LastName == null or
          (hasNoPrimaryAddress() and
              hasNoPhoneNumber() and
              _searchContact.TaxID == null))
        throwException(_searchContact, locale)
    }

  }
  
  override function makeQueries(locale : LocaleType) : List<Query<ABPersonVendor>> {
    var queries = new ArrayList<Query<ABPersonVendor>>()

    if (locale == LocaleType.TC_JA_JP) {

      //Query: Name and PhoneNumber
      if (not hasNoPhoneNumber()) {
        new PersonQueryBuilder<ABPersonVendor>(_searchContact)
            .startsWithFirstName()//AND
            .startsWithFirstNameKanji()//AND
            .hasEqualLastName()//AND
            .hasEqualLastNameKanji()//AND
            .hasEqualPhoneNumbers()
            .buildAndAdd(queries)
      }

      //Query: Name and Address
      if (not hasNoPrimaryAddress()) {
        new PersonQueryBuilder<ABPersonVendor>(_searchContact)
            .startsWithFirstName()//AND
            .startsWithFirstNameKanji()//AND
            .hasEqualLastName()//AND
            .hasEqualLastNameKanji()//AND
            .hasEqualAddress()
            .hasEqualAddressKanji()
            .buildAndAdd(queries)
      }
    } else {
      new PersonQueryBuilder<ABPersonVendor>(_searchContact)
          .hasEqualTaxId()//AND
          .buildAndAdd(queries)

      //Query: Name and PhoneNumber
      if (not hasNoPhoneNumber()) {
        new PersonQueryBuilder<ABPersonVendor>(_searchContact)
            .startsWithFirstName()//AND
            .hasEqualLastName()//AND
            .hasEqualPhoneNumbers()
            .buildAndAdd(queries)
      }

      //Query: Name and Address
      if (not hasNoPrimaryAddress()) {
        new PersonQueryBuilder<ABPersonVendor>(_searchContact)
            .startsWithFirstName()//AND
            .hasEqualLastName()//AND
            .hasEqualAddress()
            .buildAndAdd(queries)
      }
    }

    return queries
  }

  override function isExactMatch(
    searchContact : ABPersonVendor, resultABContact : ABPersonVendor, locale : LocaleType) : boolean {
    if (locale == LocaleType.TC_JA_JP) {
      return false
    } else {
      return equalsAndNotNull<String>(searchContact.FirstName, resultABContact.FirstName) &&
          equalsAndNotNull<String>(searchContact.LastName, resultABContact.LastName) &&
          equalsAndNotNull<String>(searchContact.TaxID, resultABContact.TaxID)
    }

  }

}

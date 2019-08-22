package gw.plugin.contact.findduplicates
uses gw.plugin.contact.findduplicates.querybuilder.CompanyQueryBuilder

uses gw.api.database.IQueryBuilder
uses gw.api.database.Query
uses java.util.ArrayList
uses java.util.List

/**
 * Company subtype helper
 */
@Export
class CompanyDuplicateFinder<C extends ABCompany> extends DuplicateFinderBase<C> {

  override function validateMandatoryFields(locale : LocaleType) {
    if (locale == LocaleType.TC_JA_JP) {
      if (_searchContact.Name == null or
          (hasNoPrimaryAddress() and
              hasNoPhoneNumber()))
        throwException(_searchContact, locale, ABCompany)
    } else {
      if (_searchContact.Name == null or
          (hasNoPrimaryAddress() and
              hasNoPhoneNumber() and
              _searchContact.TaxID == null))
        throwException(_searchContact, locale, ABCompany)
    }
  }
  
  override function isExactMatch(searchContact : C, resultABContact : C, locale : LocaleType) : boolean {
    if (locale == LocaleType.TC_JA_JP) {
      return false
    } else {
      return equalsAndNotNull<String>(searchContact.TaxID, resultABContact.TaxID) &&
          equalsAndNotNull<String>(searchContact.Name, resultABContact.Name)
    }
  }

  override function haveName() : boolean { return true }

  override function makeQueries(locale : LocaleType) : List<Query<C>> {
    var queries = new ArrayList<Query<C>>()

    if (locale == LocaleType.TC_JA_JP) {

      //Query: Name and PhoneNumber
      if (not hasNoPhoneNumber()) {
        new CompanyQueryBuilder<C>(_searchContact)
            .startsWithName()//AND
            .startsWithNameKanji() //AND
            .hasEqualPhoneNumbers()
            .buildAndAdd(queries)
      }

      //Query: Name and Address
      if (not hasNoPrimaryAddress()) {
        new CompanyQueryBuilder<C>(_searchContact)
            .startsWithName()//AND
            .startsWithNameKanji() //AND
            .hasEqualAddress()
            .hasEqualAddressKanji()
            .buildAndAdd(queries)
      }
    } else {
      //Query: TaxID
      new CompanyQueryBuilder<C>(_searchContact)
          .hasEqualTaxId()//AND
          .buildAndAdd(queries)

      //Query: Name and PhoneNumber
      if (not hasNoPhoneNumber()) {
        new CompanyQueryBuilder<C>(_searchContact)
            .startsWithName()//AND
            .hasEqualPhoneNumbers()
            .buildAndAdd(queries)
      }

      //Query: Name and Address
      if (not hasNoPrimaryAddress()) {
        new CompanyQueryBuilder<C>(_searchContact)
            .startsWithName()//AND
            .hasEqualAddress()
            .buildAndAdd(queries)
      }
    }


    
    return queries
  }

}

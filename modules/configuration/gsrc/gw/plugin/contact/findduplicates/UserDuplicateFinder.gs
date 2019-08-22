package gw.plugin.contact.findduplicates
uses gw.plugin.contact.findduplicates.querybuilder.UserContactQueryBuilder
uses gw.plugin.contact.findduplicates.PersonDuplicateFinder

uses gw.api.database.Query
uses java.util.ArrayList
uses java.util.List

/**
 * UserContact subtype helper
 */
@Export
class UserDuplicateFinder extends PersonDuplicateFinder<ABUserContact> {

  override function validateMandatoryFields(locale : LocaleType) {
    if ((_searchContact.FirstName == null or _searchContact.LastName == null) 
               and _searchContact.EmployeeNumber == null)
      throwException(_searchContact, locale)
  }
  
  override function makeQueries(locale : LocaleType) : List<Query<ABUserContact>> {
    var queries = new ArrayList<Query<ABUserContact>>()
    
    //Query: Name
    if (haveName()) {
      new UserContactQueryBuilder<ABUserContact>(_searchContact)
        .startsWithFirstName()//AND
        .hasEqualLastName()
        .buildAndAdd(queries)
    }
    
    //Query: EmployeeNumber
    new UserContactQueryBuilder<ABUserContact>(_searchContact)
      .hasEqualEmployeeNumber()
      .buildAndAdd(queries)

    return queries
  }

  override function isExactMatch(
    searchContact : ABUserContact, resultABContact : ABUserContact, locale : LocaleType) : boolean {

    var searchUserContact = searchContact
    var resultUserContact = resultABContact
    return equalsAndNotNull<String>(searchUserContact.EmployeeNumber, resultUserContact.EmployeeNumber)
  }
}

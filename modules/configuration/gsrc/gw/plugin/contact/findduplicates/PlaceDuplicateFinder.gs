package gw.plugin.contact.findduplicates
uses gw.plugin.contact.findduplicates.querybuilder.PlaceQueryBuilder

uses gw.api.database.Query
uses java.util.ArrayList
uses java.util.List

/**
 * Place subtype helper
 */
@Export
class PlaceDuplicateFinder extends DuplicateFinderBase<ABPlace> {

  override function validateMandatoryFields(locale : LocaleType) {
    if (_searchContact.Name == null and hasNoPrimaryAddress())
      throwException(_searchContact, locale, ABPlace)
  }
  
  override function makeQueries(locale : LocaleType) : List<Query<ABPlace>> {
    var queries = new ArrayList<Query<ABPlace>>()

    if (locale == LocaleType.TC_JA_JP) {
      //Query: Name
      new PlaceQueryBuilder<ABPlace>(_searchContact)
          .startsWithName()
          .startsWithNameKanji()
          .buildAndAdd(queries)

      //Query: Address
      new PlaceQueryBuilder<ABPlace>(_searchContact)
          .hasEqualAddress()
          .hasEqualAddressKanji()
          .buildAndAdd(queries)
    } else {
      //Query: Name
      new PlaceQueryBuilder<ABPlace>(_searchContact)
          .startsWithName()
          .buildAndAdd(queries)

      //Query: Address
      new PlaceQueryBuilder<ABPlace>(_searchContact)
          .hasEqualAddress()
          .buildAndAdd(queries)
    }

    return queries
  }

  override function isExactMatch(searchContact : ABPlace, resultABContact : ABPlace, locale : LocaleType) : boolean {
    if (locale == LocaleType.TC_JA_JP) {
      return false
    } else {
      return equalsAndNotNull<String>(searchContact.Name, resultABContact.Name) &&
          addressMatches(resultABContact)
    }
  }

  override function haveName() : boolean { return true }
}

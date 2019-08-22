package gw.plugin.contact.findduplicates.querybuilder
uses gw.plugin.contact.findduplicates.querybuilder.PersonQueryBuilderBase
uses gw.lang.Export
uses entity.ABPerson

/**
 * A {@link Query} builder offering methods for building {@link ABPerson} queries.
 */
@Export
class PersonQueryBuilder<T extends ABPerson> extends PersonQueryBuilderBase<T, PersonQueryBuilder<T>> {

  construct(aContact : ABPerson) {
    super(aContact)
  }

}

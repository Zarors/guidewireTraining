package gw.plugin.contact.findduplicates.querybuilder
uses gw.lang.Export
uses entity.ABUserContact
uses gw.plugin.contact.findduplicates.querybuilder.PersonQueryBuilderBase
uses gw.plugin.contact.findduplicates.querybuilder.EqualFieldExpression

/**
 * A {@link Query} builder offering methods for building {@link ABUserContact} queries.
 */
@Export
class UserContactQueryBuilder<T extends ABUserContact> extends PersonQueryBuilderBase<T, UserContactQueryBuilder<T>> {

  override property get Contact() : ABUserContact {
    return _contact as ABUserContact
  }
  
  construct(aContact : ABUserContact) {
    super(aContact)
  }

  function hasEqualEmployeeNumber() : UserContactQueryBuilder<T> {
    addExpression(new EqualFieldExpression<T>("EmployeeNumber", Contact.EmployeeNumber))
    return this
  }

}

package gw.plugin.contact.findduplicates.querybuilder
uses entity.ABCompany
uses gw.plugin.contact.findduplicates.querybuilder.ContactQueryBuilder

/**
 * A {@link Query} builder offering methods for building {@link ABCompany} queries.
 */
@Export
class CompanyQueryBuilder<T extends ABCompany> extends ContactQueryBuilder<T, CompanyQueryBuilder<T>> {

  property get Contact() : ABCompany {
    return _contact as ABCompany
  }

  construct(aContact : ABCompany) {
    super(aContact)
  }

}

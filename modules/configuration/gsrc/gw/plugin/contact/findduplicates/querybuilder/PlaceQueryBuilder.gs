package gw.plugin.contact.findduplicates.querybuilder
uses gw.lang.Export
uses entity.ABPlace
uses gw.plugin.contact.findduplicates.querybuilder.ContactQueryBuilder

/**
 * A {@link Query} builder offering methods for building {@link ABPlace} queries.
 */
@Export
class PlaceQueryBuilder<T extends ABPlace> extends ContactQueryBuilder<T, PlaceQueryBuilder<T>> {

  property get Contact() : ABPlace {
    return _contact as ABPlace
  }

  construct(aContact : ABPlace) {
    super(aContact)
  }

}

package gw.plugin.contact.findduplicates.querybuilder
uses gw.plugin.contact.findduplicates.querybuilder.OrCompositeFieldExpression
uses gw.plugin.contact.findduplicates.querybuilder.StartsWithFieldExpression
uses gw.lang.Export
uses gw.plugin.contact.findduplicates.querybuilder.ContactQueryBuilderBase
uses gw.plugin.contact.findduplicates.querybuilder.FieldExpression
uses entity.ABContact
uses java.lang.String
uses gw.plugin.contact.findduplicates.querybuilder.InFieldExpression
uses gw.plugin.contact.findduplicates.querybuilder.EqualFieldExpression
uses java.util.List

/**
 * A {@link Query} builder offering methods for building {@link ABContact} queries.
 */
@Export
class ContactQueryBuilder<T extends ABContact, U extends ContactQueryBuilder<T, U>> extends ContactQueryBuilderBase<T, U> {

  construct(aContact : ABContact) {
    super(aContact)
  }

  function hasEqualTaxId() : U {
    addExpression(new EqualFieldExpression<T>("TaxID", _contact.TaxID))
    return this as U
  }

  function hasEqualPhoneNumbers() : U {
    var numbers = PhoneNumbers
    var phoneOperators : List<FieldExpression<T>> = {
        new InFieldExpression<T>("HomePhone", numbers),
        new InFieldExpression<T>("WorkPhone", numbers),
        new InFieldExpression<T>("FaxPhone", numbers)
    }
    addExpression(new OrCompositeFieldExpression<T>(
      phoneOperators.toTypedArray()
    ))
    return this as U
  }

  function hasEqualAddress() : U {
    addExpression(new AndCompositeFieldExpression<T>({
      new EqualFieldExpression<T>("AddressLine1", "PrimaryAddress", _contact.PrimaryAddress.AddressLine1,false),
      new EqualFieldExpression<T>("State", "PrimaryAddress", _contact.PrimaryAddress.State, false),
      new EqualFieldExpression<T>("City", "PrimaryAddress", _contact.PrimaryAddress.City, false),
      new EqualFieldExpression<T>("PostalCode", "PrimaryAddress", _contact.PrimaryAddress.PostalCode, false)
    }))
    return this as U
  }

  function hasEqualAddressKanji() : U {
    addExpression(new AndCompositeFieldExpression<T>({
      new EqualFieldExpression<T>("AddressLine1Kanji", "PrimaryAddress", (_contact.PrimaryAddress as Address).AddressLine1Kanji,false),
      new EqualFieldExpression<T>("State", "PrimaryAddress", _contact.PrimaryAddress.State, false),
      new EqualFieldExpression<T>("CityKanji", "PrimaryAddress", (_contact.PrimaryAddress as Address).CityKanji, false),
      new EqualFieldExpression<T>("PostalCode", "PrimaryAddress", _contact.PrimaryAddress.PostalCode, false)
    }))
    return this as U
  }

  function startsWithName() : U {
    addExpression(new StartsWithFieldExpression<T>("Name", _contact.Name))
    return this as U
  }

  function startsWithNameKanji() : U {
    addExpression(new StartsWithFieldExpression<T>("NameKanji", (_contact as ABContact).NameKanji))
    return this as U
  }

  private property get PhoneNumbers() : String[] {
    var numbers : List<String> = {}
    addIfNotNull(_contact.HomePhone, numbers)
    addIfNotNull(_contact.WorkPhone, numbers)
    addIfNotNull(_contact.FaxPhone, numbers)
    return numbers.toTypedArray()
  }
  
  protected function addIfNotNull(value : String, values : List<String>) {
    if (value != null) {
      values.add(value)
    }
  }

}

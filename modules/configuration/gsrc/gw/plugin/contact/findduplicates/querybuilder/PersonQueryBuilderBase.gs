package gw.plugin.contact.findduplicates.querybuilder
uses gw.lang.Export
uses gw.plugin.contact.findduplicates.querybuilder.StartsWithFieldExpression
uses java.lang.String
uses java.util.List
uses entity.ABPerson
uses gw.plugin.contact.findduplicates.querybuilder.OrCompositeFieldExpression
uses gw.plugin.contact.findduplicates.querybuilder.InFieldExpression
uses gw.plugin.contact.findduplicates.querybuilder.FieldExpression
uses gw.plugin.contact.findduplicates.querybuilder.EqualFieldExpression
uses gw.plugin.contact.findduplicates.querybuilder.ContactQueryBuilder
uses gw.plugin.contact.findduplicates.querybuilder.AndCompositeFieldExpression

/**
 * A {@link Query} builder offering methods for building {@link ABPerson} queries.
 */
@Export
class PersonQueryBuilderBase<T extends ABPerson, U extends PersonQueryBuilderBase<T, U>> extends ContactQueryBuilder<T, U> {

  property get Contact() : ABPerson {
    return _contact as ABPerson
  }

  construct(aContact : ABPerson) {
    super(aContact)
  }

  function startsWithFirstName() : U {
    addExpression(new StartsWithFieldExpression<T>("FirstName", Contact.FirstName))
    return this as U
  }

  function startsWithFirstNameKanji() : U {
    addExpression(new StartsWithFieldExpression<T>("FirstNameKanji", Contact.FirstNameKanji))
    return this as U
  }

  function hasEqualLastName() : U {
    addExpression(new EqualFieldExpression<T>(
      "LastNameDenorm", Contact.LastName, false))
    return this as U
  }

  function hasEqualLastNameKanji() : U {
    addExpression(new EqualFieldExpression<T>(
      "LastNameKanji", Contact.LastNameKanji, false))
    return this as U
  }

  function hasEqualBirthDate() : U {
    addExpression(new EqualFieldExpression<T>("DateOfBirth", Contact.DateOfBirth))
    return this as U
  }

  function hasEqualLicenseNumber() : U {
    addExpression(new AndCompositeFieldExpression<T>({
      new EqualFieldExpression<T>("LicenseNumber", Contact.LicenseNumber),
      new EqualFieldExpression<T>("LicenseState", Contact.LicenseState)
    }))
    return this as U
  }

  override function hasEqualPhoneNumbers() : U {
    var numbers = PhoneNumbers
    var phoneOperators : List<FieldExpression<T>> = {
        new InFieldExpression<T>("HomePhone", numbers),
        new InFieldExpression<T>("WorkPhone", numbers),
        new InFieldExpression<T>("FaxPhone", numbers),
        new InFieldExpression<T>("CellPhone", numbers)
    }
    addExpression(new OrCompositeFieldExpression<T>(
      phoneOperators.toTypedArray()
    ))
    return this as U
  }

  private property get PhoneNumbers() : String[] {
    var numbers : List<String> = {}
    addIfNotNull(Contact.HomePhone, numbers)
    addIfNotNull(Contact.WorkPhone, numbers)
    addIfNotNull(Contact.CellPhone, numbers)
    return numbers.toTypedArray()
  }

}

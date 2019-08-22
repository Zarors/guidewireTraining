package gw.api.name

uses java.lang.UnsupportedOperationException

@Export
class PLContactCriteriaDelegate implements ContactNameFields, PersonNameFields {
  private var _contactCriteria : ContactSearchCriteria

  construct (contactCriteria : ContactSearchCriteria) {
    _contactCriteria = contactCriteria
  }

  // PersonNameFields
  override property get FirstName() : String {
    return _contactCriteria.FirstName
  }

  override property set FirstName(value : String) {
    _contactCriteria.FirstName = value
  }

  override property get LastName() : String {
    return _contactCriteria.Keyword
  }

  override property set LastName(value : String) {
    _contactCriteria.Keyword = value
  }

  override property get FirstNameKanji() : String {
    return _contactCriteria.FirstNameKanji
  }

  override property set FirstNameKanji(value : String) {
    _contactCriteria.FirstNameKanji = value
  }

  override property get LastNameKanji() : String {
    return _contactCriteria.KeywordKanji
  }

  override property set LastNameKanji(value : String) {
    _contactCriteria.KeywordKanji = value
  }


  // unsupported properties
  override property get MiddleName() : String {
    return null
  }

  override property set MiddleName(value : String) {
    throw notSupported()
  }

  override property get Particle() : String {
    return null
  }

  override property set Particle(value : String) {
    throw notSupported()
  }

  override property get Prefix() : NamePrefix {
    return null
  }

  override property set Prefix(value : NamePrefix) {
    throw notSupported()
  }

  override property get Suffix() : NameSuffix {
    return null
  }

  override property set Suffix(value : NameSuffix) {
    throw notSupported()
  }

  override property get Name() : String {
    return null
  }

  override property set Name(value : String) {
    throw notSupported()
  }

   override property get NameKanji() : String {
     return null
   }

   override property set NameKanji(value : String) {
     throw notSupported()
   }

  private function notSupported() : UnsupportedOperationException {
    return new UnsupportedOperationException("Field is not used for PLContactCriteriaDelegate")
  }

}
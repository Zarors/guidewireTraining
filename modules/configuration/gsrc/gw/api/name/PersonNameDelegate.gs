package gw.api.name
uses java.lang.UnsupportedOperationException

@Export
class PersonNameDelegate implements PersonNameFields {
  private var _person : Person

  construct(person : Person) {
    _person = person
  }
  
  override property get FirstName() : String {
    return _person.FirstName
  }

  override property set FirstName(value : String) {
    _person.FirstName = value
  }

  override property get MiddleName() : String {
    return _person.MiddleName
  }

  override property set MiddleName(value : String) {
    _person.MiddleName = value
  }

  override property get Particle() : String {
    return _person.Particle
  }
  
  override property set Particle(value : String) {
    _person.Particle = value
  }

  override property get LastName() : String {
    return _person.LastName
  }

  override property set LastName(value : String) {
    _person.LastName = value
  }

  override property get Prefix() : NamePrefix {
    return _person.Prefix
  }

  override property set Prefix(value : NamePrefix) {
    _person.Prefix = value
  }

  override property get Suffix() : NameSuffix {
    return _person.Suffix
  }

  override property set Suffix(value : NameSuffix) {
    _person.Suffix = value
  }

  override property get FirstNameKanji() : String {
    return _person.FirstNameKanji
  }

  override property set FirstNameKanji(value : String) {
    _person.FirstNameKanji = value
  }

  override property get LastNameKanji() : String {
    return _person.LastNameKanji
  }

  override property set LastNameKanji(value : String) {
    _person.LastNameKanji = value
  }


  // properties not used for Persons
  override property get Name() : String {
    throw notSupported()
  }

  override property set Name(value : String) {
    throw notSupported()
  }

  override property get NameKanji() : String {
    throw notSupported()
  }

  override property set NameKanji(value : String) {
    throw notSupported()
  }


  private function notSupported() : UnsupportedOperationException {
    return new UnsupportedOperationException("Field is not used for PersonNameDelegate")
  }
}

package gw.api.name

@Export
class PersonNameFieldsImpl implements PersonNameFields{

  var _firstName : String as FirstName
  var _lastName : String as LastName
  var _firstNameKanji : String as FirstNameKanji
  var _lastNameKanji : String as LastNameKanji
  var _middleName : String as MiddleName
  var _particle : String as Particle
  var _prefix : NamePrefix as Prefix
  var _suffix : NameSuffix as Suffix

  // not used for Person entities:
  var _name : String as Name
  var _nameKanji : String as NameKanji

}
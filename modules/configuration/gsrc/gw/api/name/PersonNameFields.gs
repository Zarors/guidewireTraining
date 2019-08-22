package gw.api.name

@Export
interface PersonNameFields extends ContactNameFields {
  
  // name fields used for Persons
  property get FirstName() : String
  property set FirstName(value : String)
  
  property get MiddleName() : String
  property set MiddleName(value : String)

  property get Particle() : String
  property set Particle(value : String)
  
  property get LastName() : String
  property set LastName(value : String)
  
  property get Prefix() : NamePrefix
  property set Prefix(value : NamePrefix)
  
  property get Suffix() : NameSuffix
  property set Suffix(value : NameSuffix)
  
  property get FirstNameKanji() : String
  property set FirstNameKanji(value : String)
  
  property get LastNameKanji() : String
  property set LastNameKanji(value : String)

}

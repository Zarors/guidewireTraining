package gw.api.name

@Export
interface ContactNameFields {
    
  // name fields used for contacts that are not Persons (such as Company, Venue)
  property get Name() : String
  property set Name(value : String)
  
  property get NameKanji() : String
  property set NameKanji(value : String)

}

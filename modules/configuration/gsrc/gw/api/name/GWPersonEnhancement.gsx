package gw.api.name

@Export
enhancement GWPersonEnhancement : entity.Person {

  property get FirstNameDisplayValue() : String {
    return this.FirstNameKanji.HasContent ? this.FirstNameKanji : this.FirstName
  }

  property get LastNameDisplayValue() : String {
    return this.LastNameKanji.HasContent ? this.LastNameKanji : this.LastName
  }
}
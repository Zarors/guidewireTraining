package gw.api.name

@Export
enhancement GWContactEnhancement : entity.Contact {

  property get NameDisplayValue() : String {
    return this.NameKanji.HasContent ? this.NameKanji : this.Name
  }
}
package gw.api.address

@Export
enhancement GWAddressEnhancement : entity.Address {

  property get CityDisplayValue() : String {
    return this.CityKanji.HasContent ? this.CityKanji : this.City
  }

  property get AddressLine1DisplayValue() : String {
    return this.AddressLine1Kanji.HasContent ? this.AddressLine1Kanji : this.AddressLine1
  }

  property get AddressLine2DisplayValue() : String {
    return this.AddressLine2Kanji.HasContent ? this.AddressLine2Kanji : this.AddressLine2
  }
}
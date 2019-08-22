package gw.entity

@Export
enhancement GWAddressEnhancement : entity.Address {

  /**
   * Returns AddressLine1Kanji if it is populated, AddressLine1 otherwise
   */
  public property get DisplayAddressLine1(): String {
    return this.AddressLine1Kanji.HasContent ? this.AddressLine1Kanji : this.AddressLine1
  }

  /**
   * Returns CityKanji if it is populated, City otherwise
   */
  public property get DisplayCity(): String {
    return this.CityKanji.HasContent ? this.CityKanji : this.City
  }
}

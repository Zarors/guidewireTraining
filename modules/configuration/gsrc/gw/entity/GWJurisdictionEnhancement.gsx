package gw.entity

@Export
enhancement GWJurisdictionEnhancement : typekey.Jurisdiction {

  /**
   * If this Jurisdiction's Code matches a State's Code,  returns the StateAbbreviation of that State<br>
   * Otherwise return the Jurisdiction's Name<br>
   *
   * @return Abbreviated form of Jurisdiction, if applicable
   */
  property get AbbreviatedDisplayValue() : String {
    var maybeAbbreviation = State.get(this.Code).Abbreviation.DisplayName
    return maybeAbbreviation ?: this.DisplayName
  }
}

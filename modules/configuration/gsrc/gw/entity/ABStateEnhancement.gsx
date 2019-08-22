package gw.entity

@Export
enhancement ABStateEnhancement : typekey.State {

  /**
   * If this State's Code matches a StateAbbreviation's Code,  returns the StateAbbreviation of that State<br>
   * Otherwise return the State's Display Value<br>
   *
   * @return Abbreviated form of State, if applicable
   */
  property get AbbreviatedDisplayValue() : String {
    var maybeAbbreviation = this.Abbreviation.DisplayName
    return maybeAbbreviation ?: this.DisplayName
  }
}

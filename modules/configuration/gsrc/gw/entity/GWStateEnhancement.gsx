package gw.entity
uses gw.api.util.StateAbbreviationUtil

@Export
enhancement GWStateEnhancement : typekey.State {
  /** Return the denormed code for this state, i.e., the code within
   * this country.
   *
   * @return the code without the country prefix
   */
  property get DenormCode() : String {
    var codeStr = this.Code
    var pos = codeStr.indexOf("_")
    return pos == -1 ? codeStr : codeStr.substring(pos + 1)
  }
  
  /** Return the abbreviation for the state, which may vary based on the current language setting.
   *  Returns null if no abbreviation is defined (for example, for Japanese prefectures)
   * 
   *  @return the abbreviation for the state
   */
  property get Abbreviation() : StateAbbreviation {
    return typekey.StateAbbreviation.get(this.Code)
  }
 
  /** Look up a State using the country and the country-dependent, localized abbreviation.
   *  For example, getState(TC_AU, "WA") returns Western Australia,
   *  while getState(TC_US, "WA") returns Washington.
   * 
   *  @return the State associated with the country for the abbreviation in the current language
   */
  static function getState(country : Country, anAbbreviation : String) : State {
    return StateAbbreviationUtil.getAbbreviation(country, anAbbreviation).State
  }
  
  /** Look up a StateAbbreviation using the country and the country-dependent, localized abbreviation.
   *  For example, getStateAbbreviation(TC_AU, "WA") returns the StateAbbreviation for Western Australia,
   *  while getStateAbbreviation(TC_US, "WA") returns the StateAbbreviation for Washington.
   * 
   *  @return the StateAbbreviation associated with the country for the abbreviation in the current language
   */
  static function getStateAbbreviation(country : Country, anAbbreviation : String) : StateAbbreviation {
    return StateAbbreviationUtil.getAbbreviation(country, anAbbreviation)
  }
}

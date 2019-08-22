package gw.entity

enhancement GWStateAbbreviationEnhancement : typekey.StateAbbreviation {

    /** Returns the State typekey associated with this StateAbbreviation
     *
     * @return the State
     */
    property get State() : State {
      return typekey.State.get(this.Code)
    }

}

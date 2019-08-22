package gw.pl.contact.entity

enhancement GWContactSubtypeEnhancement: entity.Contact {

  @Deprecated("Use instead: ( obj typeis Company ? obj : null )")
  property get Company(): Company {
    return (this typeis Company ? this : null)
  }

  @Deprecated("Use instead: ( obj typeis CompanyVendor ? obj : null )")
  property get CompanyVendor(): CompanyVendor {
    return (this typeis CompanyVendor ? this : null)
  }

  @Deprecated("Use instead: ( obj typeis LegalVenue ? obj : null )")
  property get LegalVenue(): LegalVenue {
    return (this typeis LegalVenue ? this : null)
  }

  @Deprecated("Use instead: ( obj typeis Person ? obj : null )")
  property get Person(): Person {
    return (this typeis Person ? this : null)
  }

  @Deprecated("Use instead: ( obj typeis PersonVendor ? obj : null )")
  property get PersonVendor(): PersonVendor {
    return (this typeis PersonVendor ? this : null)
  }

  @Deprecated("Use instead: ( obj typeis Place ? obj : null )")
  property get Place(): Place {
    return (this typeis Place ? this : null)
  }

  @Deprecated("Use instead: ( obj typeis UserContact ? obj : null )")
  property get UserContact(): UserContact {
    return (this typeis UserContact ? this : null)
  }
}

package gw.api.databuilder

@Export
class ABAttorneyBuilder extends ABPersonVendorBuilderBase<ABAttorney, ABAttorneyBuilder> {

  construct() {
    super(ABAttorney)
  }

  function withAttorneyLicense(attorneyLicense : String) : ABAttorneyBuilder {
    set(ABAttorney.Type.TypeInfo.getProperty("AttorneyLicense"), attorneyLicense)
    return this
  }

  function withAttorneySpecialty(legalSpecialty : LegalSpecialty) : ABAttorneyBuilder {
    set(ABAttorney.Type.TypeInfo.getProperty("AttorneySpecialty"), legalSpecialty)
    return this
  }

}

package gw.api.databuilder

@Export
class ABLawFirmBuilder extends ABCompanyVendorBuilderBase<ABLawFirm, ABLawFirmBuilder> {

  construct() {
    super(ABLawFirm)
  }

  function withLawFirmSpecialty(lawFirmSpecialty : LegalSpecialty ) : ABLawFirmBuilder {
    set(ABLawFirm.Type.TypeInfo.getProperty("LawFirmSpecialty"), lawFirmSpecialty)
    return this
  }
  
}

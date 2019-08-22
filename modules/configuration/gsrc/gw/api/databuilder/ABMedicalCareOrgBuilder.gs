package gw.api.databuilder

@Export
class ABMedicalCareOrgBuilder extends ABCompanyVendorBuilderBase<ABMedicalCareOrg, ABMedicalCareOrgBuilder> {

  construct() {
    super(ABMedicalCareOrg)
  }
  
  function withMedicalOrgSpecialty(specialtyType : SpecialtyType ) : ABMedicalCareOrgBuilder {
    set(ABMedicalCareOrg.Type.TypeInfo.getProperty("MedicalOrgSpecialty"), specialtyType)
    return this
  }
}

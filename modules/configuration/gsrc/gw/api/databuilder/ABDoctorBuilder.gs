package gw.api.databuilder

@Export
class ABDoctorBuilder extends ABPersonVendorBuilderBase<ABDoctor, ABDoctorBuilder> {

  construct() {
    super(ABDoctor)
  }
  
  function withDoctorSpecialty(doctorSpecialty : SpecialtyType) : ABDoctorBuilder {
    set(ABDoctor.Type.TypeInfo.getProperty("DoctorSpecialty"), doctorSpecialty)
    return this
  }

  function withMedicalLicense(medicalLicense : String ) : ABDoctorBuilder {
    set(ABDoctor.Type.TypeInfo.getProperty("MedicalLicense"), medicalLicense)
    return this
  }

}

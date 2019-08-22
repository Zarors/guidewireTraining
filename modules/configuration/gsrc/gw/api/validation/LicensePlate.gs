package gw.api.validation
uses java.util.Map

@Export
class LicensePlate implements IFieldValidator {

  construct() {

  }

  override function validate(p0 : String, p1 : Object, p2 : Map) : IFieldValidationResult {
      var licenseState = p1["State"]
      var licenseCountry = p1["Country"]
      var result = new FieldValidationResult()
      
      
      
      
      switch(licenseState){
        case State.TC_CA:
          validateCALicensePlate(p0 as String, result)
          break
        case State.TC_MI:
          validateMILicensePlate(p0 as String, result)
          break
        default:
          break
      }
      
      return result
  }
  
  function validateCALicensePlate(p0 : String, result: IFieldValidationResult){
    p0.match("")

  }
  
  function validateMILicensePlate(p0 : String, result: IFieldValidationResult){

  }

}

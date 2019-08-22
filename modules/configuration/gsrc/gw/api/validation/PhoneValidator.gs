package gw.api.validation
uses gw.api.locale.DisplayKey
uses java.util.Map
uses gw.api.util.PhoneUtil
uses gw.api.util.phone.GWPhoneValidationResult

@Export
class PhoneValidator extends FieldValidatorBase{

  construct() {

  }


  override function validate(phoneNumber : String, p1 : Object, parameters : Map<Object, Object>) : IFieldValidationResult {
    var countryProperty = parameters.get("phonecountrycodeProperty") as String
    var extensionProperty = parameters.get("extensionProperty") as String
    var result = new FieldValidationResult()
    var phoneNumberOriginal = phoneNumber


    
    var phoneCountry : PhoneCountryCode = null
    var extension : java.lang.String = null
    if (countryProperty != null){ 
      phoneCountry =  p1[countryProperty] as PhoneCountryCode
    }
    if (extensionProperty != null){
      extension = p1[extensionProperty] as java.lang.String
      if (extension != null && !extension.isEmpty()){
        phoneNumber = phoneNumber + " x" + PhoneUtil.convertAlphaCharacters(extension)
      }
    }
    if (phoneCountry != null
    && phoneCountry != PhoneCountryCode.TC_ZZ
    && phoneCountry != PhoneCountryCode.TC_UNPARSEABLE){

      if (!PhoneUtil.isViableNumber(phoneNumberOriginal)){
        result.addError(DisplayKey.get("Validator.Phone.NotViable", phoneNumber))
        return result
      }
      
      var isPossible = PhoneUtil.isPossibleNumberWithReason(phoneNumber, phoneCountry)
      switch (isPossible){
        case GWPhoneValidationResult.INVALID:
          result.addError(DisplayKey.get("Validator.Phone.Invalid", phoneNumber, phoneCountry))
          break
        case GWPhoneValidationResult.INVALID_COUNTRY_CODE:
          result.addError(DisplayKey.get("Validator.Phone.InvalidCountryCode", phoneNumber, phoneCountry))
          break
        case GWPhoneValidationResult.TOO_LONG:
          result.addError(DisplayKey.get("Validator.Phone.TooLong", phoneNumber, phoneCountry))
          break
        case GWPhoneValidationResult.TOO_SHORT:
          result.addError(DisplayKey.get("Validator.Phone.TooShort", phoneNumber, phoneCountry))
          break
        case GWPhoneValidationResult.IS_POSSIBLE:
        default:
          break
        
        
      }
      
    }
    
    
    return result
  }

}

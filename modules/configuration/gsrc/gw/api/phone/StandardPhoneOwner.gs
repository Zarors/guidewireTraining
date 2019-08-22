package gw.api.phone
uses java.util.Set
uses gw.api.util.PhoneUtil

/**
* Most phone widget users should use the StandardPhoneOwner
*/

@Export
class StandardPhoneOwner extends PhoneOwnerBase {

  var _required : boolean

  construct(fields : PhoneFields) {
    super(fields)
    _required = true
  }
  construct(fields : PhoneFields, required : boolean) {
      super(fields)
      _required = required
    }

  construct(fields : PhoneFields, label : String) {
    super(fields, label)
    _required = true
  }

  construct(fields : PhoneFields, label : String, required : boolean){
    super(fields, label)
    _required = required
  }

  override function isRequired(fieldId : PhoneOwnerFieldId) : boolean {
      if(!_required){
        return false
      }

      return PhoneOwnerFieldId.REQUIRED_FIELDS.contains(fieldId)
    }

  override function isRegionCodeRequired() : boolean {
    if(!_required){
        return false
    }
    return super.isRegionCodeRequired()
   }

  override property get HiddenFields() : Set<PhoneOwnerFieldId> {
    return PhoneOwnerFieldId.HIDDEN_FIELDS_NON_BUSINESS
  }

  override function isFieldVisibleReadOnlyMode(fieldId : PhoneOwnerFieldId) : boolean {
    return !PhoneOwnerFieldId.HIDDEN_FIELDS_READONLY.contains(fieldId)
  }

  override function isFieldVisibleEditMode(fieldId : PhoneOwnerFieldId) : boolean {
    var defaultCountry = PhoneUtil.getUserDefaultPhoneCountry()
    var multiRegionMode = PhoneUtil.isMultiRegionMode()

    if (fieldId == PhoneOwnerFieldId.COUNTRY_CODE && !multiRegionMode){
        if (PhoneFields.CountryCode != defaultCountry){
            return !PhoneOwnerFieldId.HIDDEN_FIELDS_NON_BUSINESS.contains(fieldId)
        }else{
            return false
        }
    }

    if (fieldId == PhoneOwnerFieldId.EXTENSION){
      if (PhoneFields.Extension == null || PhoneFields.Extension.Empty){
          return !PhoneOwnerFieldId.HIDDEN_FIELDS_NON_BUSINESS.contains(fieldId)
      }else{
          return true
      }
    }

    return !PhoneOwnerFieldId.HIDDEN_FIELDS_NON_BUSINESS.contains(fieldId)
  }

}

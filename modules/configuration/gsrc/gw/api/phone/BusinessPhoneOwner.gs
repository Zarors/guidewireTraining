package gw.api.phone
uses java.util.Set
uses gw.api.util.PhoneUtil

@Export
class BusinessPhoneOwner extends StandardPhoneOwner{
  construct(fields : PhoneFields) {
    super(fields)
  }
  construct(fields : PhoneFields, label : String) {
    super(fields, label)
  }

  construct(fields : PhoneFields, required : boolean) {
    super(fields, required)
  }


  construct(fields : PhoneFields, label : String, required : boolean){
    super(fields, label, required)
  }



  override property get HiddenFields() : Set<PhoneOwnerFieldId> {
    return PhoneOwnerFieldId.EMPTY_FIELDS
  }

}

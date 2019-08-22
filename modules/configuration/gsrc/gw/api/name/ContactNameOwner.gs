package gw.api.name
uses java.util.Set

/**
 * For use with the Name PCFs and NameFormatter for both Person and non-Person contacts.
 */
@Export
class ContactNameOwner extends NameOwnerBase {

  construct(fields : ContactNameFields) {    
    ContactName = fields
  }
  
  override property get RequiredFields() : Set<NameOwnerFieldId> {
    return NameOwnerFieldId.REQUIRED_NAME_FIELDS
  }

  override property get HiddenFields() : Set<NameOwnerFieldId> {
    return NameOwnerFieldId.NO_FIELDS
  }
  
  override function isHideIfReadOnly(fieldId : NameOwnerFieldId) : boolean {
    return false
  }

}

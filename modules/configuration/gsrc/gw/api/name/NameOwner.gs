package gw.api.name
uses java.util.Set

@Export
interface NameOwner {

  /**
   * Name fields for a non-Person contact
   */
  property get ContactName() : ContactNameFields

  /**
   * Name fields for a Person contact
   */
  property get PersonName() : PersonNameFields

  /**
   * The set of fields that should be required in the UI
   */
  property get RequiredFields() : Set<NameOwnerFieldId>

  /**
   * The set of fields that should be hidden, and not displayed in the UI
   */
  property get HiddenFields() : Set<NameOwnerFieldId>

  /**
   * Used to save the value of the PCF's CurrentLocation.inEditMode
   */
  property get InEditMode() : boolean
  property set InEditMode(inEditMode : boolean)

  /**
   * True if the field is available
   */
  function isAvailable(fieldId : NameOwnerFieldId) : boolean

  /**
   * True if the field is editable
   */
  function isEditable(fieldId : NameOwnerFieldId) : boolean

  /**
   * True if the field is required
   */
  function isRequired(fieldId : NameOwnerFieldId) : boolean

  /**
   * True if the field is visible
   */
  function isVisible(fieldId : NameOwnerFieldId) : boolean

  /**
   * True if the field is hideIfReadOnly
   */
  function isHideIfReadOnly(fieldId : NameOwnerFieldId) : boolean

  /**
   * if true, show the name summary (when not in edit mode)
   */
  property get ShowNameSummary() : boolean

  /**
   * label to use for the name of a non-Person contact
   */
  property get ContactNameLabel() : String

  /**
   * label to use for the phonetic name of a non-Person contact (e.g. for Japan)
   */
  property get ContactNamePhoneticLabel() : String

  /**
   * label to use for the first name of a Person contact
   */
  property get FirstNameLabel() : String

  /**
   * label to use for the phonetic first name of a Person contact
   */
  property get FirstNamePhoneticLabel() : String

  /**
   * label to use for the last name of a Person contact
   */
  property get LastNameLabel() : String

  /**
   * label to use for the phonetic last name of a Person contact
   */
  property get LastNamePhoneticLabel() : String

  /**
   * Clear name fields that are not used with the current regional settings
   */
  function clearNonvisibleFields() : void

}

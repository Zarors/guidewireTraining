package gw.api.name

uses gw.api.locale.DisplayKey

@Export
abstract class NameOwnerBase implements NameOwner {
  var _contactDelegate : ContactNameFields as ContactName

  override property get PersonName() : PersonNameFields {
    return ContactName typeis PersonNameFields ? ContactName : null
  }

  override function isAvailable(fieldId : NameOwnerFieldId) : boolean {
    return true
  }

  override function isEditable(fieldId : NameOwnerFieldId) : boolean {
    return true
  }

  override function isRequired(fieldId : NameOwnerFieldId) : boolean {
    return RequiredFields.contains(fieldId)
  }

  override function isVisible(fieldId : NameOwnerFieldId) : boolean {
    if (not NameLocaleSettings.VisibleFields.contains(fieldId) or HiddenFields.contains(fieldId)) {
      return false
    } else if (AlwaysShowSeparateFields) {
      return true
    } else if (isHideIfReadOnly(fieldId) and not InEditMode)  {
      return false
    }
    return true
  }

  var _inEditMode : boolean as InEditMode

  /**
   * Set this to true for names in search screens.  The name PCFs show separate fields
   * when the PCF is editable and a display name when the PCF is read-only.  Search screens
   * are not considered editable but they should show the individual name fields.
   */
  var _AlwaysShowSeparateFields : boolean as AlwaysShowSeparateFields = false

  override function isHideIfReadOnly(fieldId : NameOwnerFieldId) : boolean {
    return true
  }

  override property get ShowNameSummary() : boolean {
    return not InEditMode
  }

  override property get ContactNameLabel() : String {
    return DisplayKey.get("Web.ContactDetail.Name.OrganizationName")
  }

  override property get ContactNamePhoneticLabel() : String {
    return DisplayKey.get("Web.ContactDetail.Name.OrganizationNamePhonetic")
  }

  override property get FirstNameLabel() : String {
    return DisplayKey.get("Web.ContactDetail.Name.FirstName")
  }

  override property get FirstNamePhoneticLabel() : String {
    return DisplayKey.get("Web.ContactDetail.Name.FirstNamePhonetic")
  }

  override property get LastNameLabel() : String {
    return DisplayKey.get("Web.ContactDetail.Name.LastName")
  }

  override property get LastNamePhoneticLabel() : String {
    return DisplayKey.get("Web.ContactDetail.Name.LastNamePhonetic")
  }

  override function clearNonvisibleFields() {
    if (ContactName != null) {
      var fieldsToClear = ContactName typeis PersonNameFields ? NameOwnerFieldId.ALL_PCF_FIELDS : NameOwnerFieldId.ALL_CONTACT_PCF_FIELDS
      for (field in fieldsToClear) {
        if (not isVisible(field) and ContactName[field.Name] != null) {
        ContactName[field.Name] = null
      }
    }
  }
  }
}

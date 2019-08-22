package gw.api.address
uses gw.api.locale.DisplayKey
uses gw.api.admin.BaseAdminUtil

@Export
abstract class AddressOwnerBase implements AddressOwner {
  public var _delegate : AddressFillableExtension

  override property get AddressDelegate() : AddressFillableExtension {
    if (_delegate == null)
      _delegate = new AddressEntityDelegate(this)
    return _delegate
  }

  var _inEditMode : boolean as InEditMode

  override function isAvailable(fieldId : AddressOwnerFieldId) : boolean {
    return true
  }

  override function isEditable(fieldId : AddressOwnerFieldId) : boolean {
    return true
  }

  override function isRequired(fieldId : AddressOwnerFieldId) : boolean {
    return RequiredFields.contains(fieldId)
  }

  override function isVisible(fieldId : AddressOwnerFieldId) : boolean {
    if (not AddressCountrySettings.getSettings(SelectedCountry).VisibleFields.contains(fieldId) or HiddenFields.contains(fieldId)) {
      return false
    } else if (AlwaysShowSeparateFields) {
      return true
    } else if (isHideIfReadOnly(fieldId) and not InEditMode)  {
      return false
    }
    return true
  }

  override function isHideIfReadOnly(fieldId : AddressOwnerFieldId) : boolean {
    return true
  }

  override property get SelectedCountry() : Country {
    return AddressDelegate.Country != null ? AddressDelegate.Country : BaseAdminUtil.getDefaultCountry()
  }

  override property set SelectedCountry(value : Country) {
    AddressDelegate.Country = value
    clearNonvisibleFields()
    AddressDelegate.State = null
  }
  
  override property get SelectedMode() : String {
    return CountrySettings.PCFMode
  }

  override property get ShowAddressSummary() : boolean {
    return not (InEditMode or AlwaysShowSeparateFields)
  }

  override property get AddressNameLabel() : String {
    return DisplayKey.get("Web.AddressBook.AddressInputSet.AddressSummary")
  }

  override property get AddressLine1Label() : String {
    return DisplayKey.get("Web.AddressBook.AddressInputSet.Address1")
  }

  override property get AddressLine1PhoneticLabel() : String {
    return DisplayKey.get("Web.AddressBook.AddressInputSet.Address1Phonetic")
  }

  /**
   * Set this to true for addresses in search screens.  The address PCFs show separate fields
   * when the PCF is editable and a display name when the PCF is read-only.  Search screens
   * are not considered editable but they should show the individual address fields.
   */
  var _AlwaysShowSeparateFields : boolean as AlwaysShowSeparateFields = false

  var _AutofillEnabled : boolean as AutofillEnabled = true
  
  override property get AutofillIconEnabled() : boolean {
    return AutofillEnabled
  }

  override property get CountrySettings() : AddressCountrySettings { 
    return AddressCountrySettings.getSettings(SelectedCountry)
  }

  override function clearNonvisibleFields() {
    var fieldsForCountry = CountrySettings.VisibleFields
    for (var field in AddressOwnerFieldId.ALL_PCF_FIELDS) {
      if (not fieldsForCountry.contains(field) and AddressDelegate[field.Name] != null) {
        AddressDelegate[field.Name] = null
      }
    }
  }

  protected function setDelegateInternal(aDelegate : Object) {
    _delegate = aDelegate as AddressFillableExtension
  }
}

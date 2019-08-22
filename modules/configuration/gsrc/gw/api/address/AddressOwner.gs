package gw.api.address

uses java.util.Set
uses gw.api.address.AddressFillableExtension

/**
 * Interface for a helper object passed to the standard Address input set. The
 * helper object provides a way to set/get a single address on the enclosing entity
 * (for example to set and get the primary address for a {@link entity.Contact}). It also contains
 * information about which fields should be visible, required etc.
 */
@Export
interface AddressOwner {

  /**
   * Property for the address in the enclosing object. Marked as autocreate so
   * that if the address starts out null then a Gosu expression of the form
   * "owner.Address.State = someState" will automatically create a new address,
   * rather than throwing a null pointer exception
   */
  @Autocreate
  property get Address() : Address
  property set Address(value : Address)
  
  /**
   * Delegate used to access address fields
   */
  property get AddressDelegate() : AddressFillableExtension 

  /**
   * The set of fields that should be required in the UI
   */
  property get RequiredFields() : Set<AddressOwnerFieldId>

  /**
   * The set of fields that should be hidden, and not displayed in the UI
   */
  property get HiddenFields() : Set<AddressOwnerFieldId>

  /**
   * Used to save the value of the PCF's CurrentLocation.inEditMode
   */
  property get InEditMode() : boolean
  property set InEditMode(value : boolean)

  /**
   * True if the field is available
   */
  function isAvailable(fieldId : AddressOwnerFieldId) : boolean
  
  /**
   * True if the field is editable
   */
  function isEditable(fieldId : AddressOwnerFieldId) : boolean
  
  /**
   * True if the field is required
   */
  function isRequired(fieldId : AddressOwnerFieldId) : boolean
  
  /**
   * True if the field is visible
   */
  function isVisible(fieldId : AddressOwnerFieldId) : boolean
  
  /**
   * True if the field is hideIfReadOnly
   */
  function isHideIfReadOnly(fieldId : AddressOwnerFieldId) : boolean

  /**
   * Return the currently selected country; either the actual address country
   * or the default country if the address is null
   */
  property get SelectedCountry() : Country
  
  /**
   * Return the string identifiying the PCF mode used for the SelectedCountry
   */
  property get SelectedMode() : String
  
  /**
   * Set the currently selected country
   */
  property set SelectedCountry(value : Country)

  /**
   * if true, show the address summary (when not in edit mode)
   */
  property get ShowAddressSummary() : boolean

  /**
   * Label to show for the AddressSummary
   */
  property get AddressNameLabel() : String

  /**
   * Label to show for AddressLine1
   */
  property get AddressLine1Label() : String

  /**
   * Label to show for AddressLine1 phonetic
   */
  property get AddressLine1PhoneticLabel() : String

  /**
   * If true, autofill is enabled.  Disable for search screens.
   */
  property get AutofillEnabled() : boolean
  
  /**
   * If true, enable the autofill icons.  Disable for search screens.
   */
  property get AutofillIconEnabled() : boolean
  
  /**
   * Returns country-specific address configuration data
   */
  property get CountrySettings() : AddressCountrySettings
  
  /**
   * Clear address fields that are not used for the SelectedCountry
   */
  function clearNonvisibleFields()
}


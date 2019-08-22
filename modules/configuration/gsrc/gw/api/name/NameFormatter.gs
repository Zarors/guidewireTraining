package gw.api.name
uses java.util.Set
uses java.lang.StringBuffer

@Export
class NameFormatter {
  /**
   * Converts a Contact name to a string. The class abstracts out name display for internationalization.
   * When name columns are changed, this formatter and its usages (which may omit certain fields)
   * should be updated accordingly.
   */
  construct() { }

  /**
   * Format a name as text, including all fields.
   * 
   * @param name           The name to format.
   * @param delimiter      The delimiter used to separate "lines" of the name.  Typical settings are " " and "".
   */
  public function format(name : ContactNameFields, delimiter : String) : String {   
    _filter = \ fieldId : NameOwnerFieldId -> { return true }
    return internalFormat(name, delimiter)
  }

  /**
   * Format a name as text, including only the specified fields.
   * 
   * @param name           The name to format.
   * @param delimiter      The delimiter used to separate "lines" of the name.  Typical settings are " " and "".
   * @param fields         The set of fields to include in the name.
   */
  public function format(name : ContactNameFields, delimiter : String, fields : Set<NameOwnerFieldId>) : String {
    _filter = \ fieldId : NameOwnerFieldId -> { return fields.contains(fieldId) }
    return internalFormat(name, delimiter)
  }

  /**
   * Format a name as text.
   * 
   * @param nameOwner      The nameOwner that specifies name values and what fields to include in the name.
   * @param delimiter      The delimiter used to separate "lines" of the name.  Typical settings are " " and "".
   */
  public function format(nameOwner : NameOwner, delimiter : String) : String {
    _filter = \ fieldId : NameOwnerFieldId -> { return nameOwner.isVisible(fieldId) }
    return internalFormat(nameOwner.PersonName != null ? nameOwner.PersonName : nameOwner.ContactName, delimiter)
  }

  //-------- private methods ---------------
  
  private var _filter : block(fieldId : NameOwnerFieldId) : boolean 
  
  private function isVisible(fieldId : NameOwnerFieldId) : boolean {
    if (fieldId == null) {
      return true
    }
    
    return NameLocaleSettings.VisibleFields.contains(fieldId) and _filter(fieldId)
  }
  
  // If the field is non-empty and visible, append the specfied delimiter if needed and then the value
  private function append (sb : StringBuffer, fieldId : NameOwnerFieldId, delimiter : String, value : String) {
    if (value.HasContent and isVisible(fieldId)) {
      if (sb.length() > 0) {
        sb.append(delimiter)
      }
      sb.append(value)
    }
  }

  // Use value1 if it is non-empty, otherwise value2
  private function firstNonEmpty(value1 : String, value2 : String) : String {
    return value1.HasContent ? value1 : value2
  }

  private function internalFormat(name : ContactNameFields, delimiter : String) : String {
    if (name == null) {
      return null
    }
    
    var fieldId = NameOwnerFieldId
    var sb = new StringBuffer()    
    var mode = NameLocaleSettings.TextFormatMode

    if (not (name typeis PersonNameFields)) {
      return name.NameKanji.HasContent ? name.NameKanji : name.Name
    }
    var pName = name as PersonNameFields
    
    var lastName = firstNonEmpty(pName.LastNameKanji, pName.LastName)
    var firstName = firstNonEmpty(pName.FirstNameKanji, pName.FirstName)
    if (mode == "default") {
      // common case
      append(sb, fieldId.PREFIX, delimiter, pName.Prefix.DisplayName)
      append(sb, fieldId.FIRSTNAME, delimiter, firstName)
      append(sb, fieldId.LASTNAME, delimiter, pName.Particle)
      append(sb, fieldId.LASTNAME, delimiter, lastName)
      append(sb, fieldId.LASTNAME, ", ", pName.Suffix.DisplayName)
    } else if (mode == "France") {
      append(sb, fieldId.PREFIX, delimiter, pName.Prefix.DisplayName)
      append(sb, fieldId.LASTNAME, delimiter, pName.Particle)
      append(sb, fieldId.LASTNAME, delimiter, lastName)
      append(sb, fieldId.FIRSTNAME, delimiter, firstName)
    } if (mode == "Japan") {
      append(sb, fieldId.LASTNAME, delimiter, lastName)
      append(sb, fieldId.FIRSTNAME, delimiter, firstName)
    }
    return sb.toString()
  }

}

package gw.api.address
uses gw.api.locale.DisplayKey
uses java.lang.StringBuffer
uses java.lang.IllegalArgumentException
uses gw.api.admin.BaseAdminUtil
uses java.util.Set
uses gw.api.util.LocaleUtil

/**
 * The address formatter is built to abstract out address display for internationalization.
 * When address columns are changed, this formatter and its usages (which may omit certain fields)
 * should be updated accordingly.
 */
@Export
class AddressFormatter extends AddressFillableExtensionImpl {
  /**
   * The address formatter is built to abstract out address display for internationalization.
   * When address columns are changed, this formatter and its usages (which may omit certain fields)
   * should be updated accordingly.
   */
  construct() { }

  /**
   * Format an address as text, including all fields.  The IncludeCountry and IncludeCounty properties can hide
   * those two fields.
   *
   * @param delimiter      The delimiter used to separate "lines" of the address.  Typical settings are "\n" and ", ".
   */
  public function format(delimiter : String) : String {
    _filter = \ fieldId : AddressOwnerFieldId -> { return true }
    return internalFormat(this, delimiter)
  }

  /**
   * Format an address as text, including all fields.  The IncludeCountry and IncludeCounty properties can hide
   * those two fields.
   * 
   * @param address        The address to format.
   * @param delimiter      The delimiter used to separate "lines" of the address.  Typical settings are "\n" and ", ".
   */
  public function format(address : AddressFillable, delimiter : String) : String {    
    _filter = \ fieldId : AddressOwnerFieldId -> { return true }
    return internalFormat(address, delimiter)
  }

  /**
   * Format an address as text.
   * 
   * @param address        The address to format.
   * @param delimiter      The delimiter used to separate "lines" of the address.  Typical settings are "\n" and ", ".
   * @param fields         The set of fields to include in the address.
   */
  public function format(address : AddressFillable, delimiter : String, fields : Set<AddressOwnerFieldId>) : String {
    _filter = \ fieldId : AddressOwnerFieldId -> { return fields.contains(fieldId) }
    return internalFormat(address, delimiter)
  }

  /**
   * Format an address as text.
   * 
   * @param address        The address to format.
   * @param delimiter      The delimiter used to separate "lines" of the address.  Typical settings are "\n" and ", ".
   * @param addressOwner   The AddressOwner that specifies what fields to include in the address.
   */
  public function format(address : AddressFillable, delimiter : String, addressOwner : AddressOwner) : String {
    _filter = \ fieldId : AddressOwnerFieldId -> { return addressOwner.isVisible(fieldId) }
    return internalFormat(address, delimiter)
  }
  
  /**
   * Format an address as text using fields in AddressFormatter, which the caller should set before calling addressString().
   * 
   * @param delimiter      The address components will be separated by the delimiter.  If the delimiter is a
   *                       comma without any other whitespace, then a space is added after the comma.
   * @param includeCountry If true, then include the country in the string.  If the delimiter is a
   *                       line feed, the country's DisplayName is used, otherwise, the country code is used.
   * @param includeCounty  If true, then include the county in the string.
   */
  @Deprecated("Please use one of the format() methods")
  function addressString(delimiter : String, aIncludeCountry : boolean, aIncludeCounty : boolean) : String {
    IncludeCountry = aIncludeCountry
    IncludeCounty = aIncludeCounty
    if (delimiter == ",") {
      delimiter = ", "
    }
    _filter = \ fieldId : AddressOwnerFieldId -> { return true }
    return internalFormat(this, delimiter)    
  }

  /**
   * If false, do not include the county in the formatted address.
   */
  var _includeCounty : boolean as IncludeCounty = false  

  /**
   * If false, do not include the country in the formatted address.
   */
  var _includeCountry : boolean as IncludeCountry = true
  
  /**
   * The delimiter to use between city and state (defaults to ", ")
   */
  var _cityStateDelimiter : String as CityStateDelimiter = ", "
  
  /**
   * If true, use the Country code instead of the Country's display name.
   * By convention, the country code is the 2 character ISO-standard country code.
   * (defaults to false)
   */
  var _abbreviateCountry : boolean as AbbreviateCountry = false

  /**
   * After calling one of the formatting routines, returns true if the address is empty
   */
  var _empty : boolean as readonly IsEmpty = false
  
  //---------- private methods --------------
  
  private var _filter : block(fieldId : AddressOwnerFieldId) : boolean 
  private var _addrCountry : Country
  
  private function isVisible(fieldId : AddressOwnerFieldId) : boolean {
    if (fieldId == null) {
      return true
    }

    if (  ((not IncludeCounty) and fieldId == AddressOwnerFieldId.COUNTY)
        or (not IncludeCountry) and fieldId == AddressOwnerFieldId.COUNTRY) {
      return false
    }

    return AddressCountrySettings.getSettings(_addrCountry).VisibleFields.contains(fieldId)
      and _filter(fieldId)
  }

  // If the field is non-empty and visible: append the specified delimiter if needed and then the value
  private function append (sb : StringBuffer, fieldId : AddressOwnerFieldId, delimiter : String, value : String) {
    if (value.HasContent and isVisible(fieldId)) {
      if (sb.length() > 0) {
        sb.append(delimiter)
      }
      sb.append(value)
    }
  }

  // Use value1 one if it is non-empty, otherwise value2
  private function firstNonEmpty(value1 : String, value2 : String) : String {
    return value1.HasContent ? value1 : value2
  }

  private function internalFormat(address : AddressFillable, delimiter : String) : String {
    if (address == null)
      return null

    var addr : AddressFillableExtension      
    if (address typeis AddressFillableExtension) {
      addr = address
    } else if (address typeis AddressAutofillable) {
      addr = new AddressAutofillableDelegate(address)
    } else {
      throw new IllegalArgumentException()
    }
    
    var fieldId = AddressOwnerFieldId
    var defaultCountry = BaseAdminUtil.getDefaultCountry()
    _addrCountry = addr.Country != null ? addr.Country : defaultCountry

    var sb = new StringBuffer()
    
    if (_addrCountry == TC_JP) {
      var jpCity = firstNonEmpty(addr.CityKanji, addr.City)
      var jpAddressLine1 = firstNonEmpty(addr.AddressLine1Kanji, addr.AddressLine1)
      var jpAddressLine2 = firstNonEmpty(addr.AddressLine2Kanji, addr.AddressLine2)
      if (LocaleUtil.CurrentLocaleType == LocaleType.TC_JA_JP and delimiter == ", ") {
        delimiter = ""
      }
      
      if (addr.PostalCode.HasContent) {
        append(sb, fieldId.POSTALCODE, "", "〒" + addr.PostalCode)
      }
      if (delimiter == "\n") {
        append(sb, fieldId.STATE, delimiter, addr.State.DisplayName)
        append(sb, fieldId.CITY, "", jpCity)
        append(sb, fieldId.ADDRESSLINE1, "", jpAddressLine1)
        append(sb, fieldId.ADDRESSLINE2, delimiter, jpAddressLine2)
      } else {
        append(sb, fieldId.STATE, " ", addr.State.DisplayName)
        append(sb, fieldId.CITY, delimiter, jpCity)
        append(sb, fieldId.ADDRESSLINE1, delimiter, jpAddressLine1)
        append(sb, fieldId.ADDRESSLINE2, delimiter, jpAddressLine2)
      }
    } else {
      // common case
      append(sb, fieldId.ADDRESSLINE1, delimiter, addr.AddressLine1)
      append(sb, fieldId.ADDRESSLINE2, delimiter, addr.AddressLine2)
      append(sb, fieldId.ADDRESSLINE3, delimiter, addr.AddressLine3)
       
      // city, state, zip line
      var cszBuf = new StringBuffer()
      switch(_addrCountry) {
        case TC_AU:
          append(cszBuf, fieldId.CITY, delimiter, addr.City)
          append(cszBuf, fieldId.STATE, " ", addr.State.Abbreviation.DisplayName)
          append(cszBuf, fieldId.POSTALCODE, " ", addr.PostalCode)
          break

        case TC_CA:
          append(cszBuf, fieldId.CITY, delimiter, addr.City)
          append(cszBuf, fieldId.STATE, CityStateDelimiter, addr.State.Abbreviation.DisplayName)
          append(cszBuf, fieldId.POSTALCODE, "  ", addr.PostalCode)
          break

        case TC_DE:
          append(cszBuf, fieldId.POSTALCODE, delimiter, addr.PostalCode)
          append(cszBuf, fieldId.CITY, " ", addr.City)
          break
    
        case TC_FR:
          append(cszBuf, fieldId.POSTALCODE, delimiter, addr.PostalCode)
          append(cszBuf, fieldId.CITY, " ", addr.City)
          if (addr.CEDEX) {
            append(cszBuf, fieldId.POSTALCODE, " ", "CEDEX")
            append(cszBuf, fieldId.POSTALCODE, " ", addr.CEDEXBureau)
          }
          break

        case TC_GB:
          append(sb, fieldId.CITY, delimiter, addr.City)
          append(cszBuf, fieldId.POSTALCODE, delimiter, addr.PostalCode)
        break

        case TC_US:
          append(cszBuf, fieldId.CITY, delimiter, addr.City)
          append(cszBuf, fieldId.STATE, CityStateDelimiter, addr.State.Abbreviation.DisplayName)
          append(cszBuf, fieldId.POSTALCODE, " ", addr.PostalCode)
          // append county after country
          break

        default:
          append(cszBuf, fieldId.CITY, delimiter, addr.City)
          append(cszBuf, fieldId.POSTALCODE, " ", addr.PostalCode)
          break
      }
      
      if (cszBuf.length() > 0) {
        append(sb, null, delimiter, cszBuf.toString())
      }
    }

    if (_includeCountry and _addrCountry != defaultCountry) {
      var countryValue = AbbreviateCountry ? addr.Country.Code : addr.Country.DisplayName
      append(sb, fieldId.COUNTRY, delimiter, countryValue)
    }
    
    if (_includeCounty and _addrCountry == TC_US ) {
      append(sb, fieldId.COUNTY, delimiter, addr.County)
    }

    var retString = sb.toString()
    _empty = retString.length() == 0
    if (_empty) {
      retString = DisplayKey.get("DisplayName.EmptyAddress")
    }

    return retString
  }
}

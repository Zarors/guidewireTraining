package gw.api.address

uses java.util.Map
uses java.util.HashMap

/**
 *  This class provides utilities for generating the correct tracked history label and
 *  values for Address entities. The labels on the properties in the Address entity can
 *  vary according to the country of the Address.
 *  If you have extended the Address entity you should update this class to handle the
 *  extension properties
 */

@Export
class AddressHistoryFieldUtil {

  /**
   * Returns a map of PropertyName to Label text for the properties of an Address, based on
   * the address passed in. The Country of the address is used for country specific lables.
   *
   * @param address - the address for which we want address property name to label text
   * @returns a Map containing the property name to label text mappings
   */
  public static function getAddressFieldsToTrack(address : entity.Address) : Map<String,String> {

    var addressCountrySettings = gw.api.address.AddressCountrySettings.getSettings(address.Country)

    var fieldsToTrack = new HashMap<String, String>() {
        "AddressLine1" -> "Web.AddressBook.AddressInputSet.Address1",
        "AddressLine2" -> "Web.AddressBook.AddressInputSet.Address2",
        "AddressLine3" -> "Web.AddressBook.AddressInputSet.Address3",
        "City"         -> addressCountrySettings.CityLabel,
        "County"       -> "Web.AddressBook.AddressInputSet.County",
        "State"        -> addressCountrySettings.StateLabel,
        "PostalCode"   -> addressCountrySettings.PostalCodeLabel,
        "Country"      -> "Web.AddressBook.AddressInputSet.Country",
        "CEDEX"   -> "Web.AddressBook.AddressInputSet.CEDEX",
        "CEDEXBureau"      -> "Web.AddressBook.AddressInputSet.CEDEXBureau",
        "AddressType"  -> "Address.Base.AddressType",
        "Description" -> "Web.AddressBook.AddressInputSet.Description", //CTC-3943 2 missing display keys
        "ValidUntil" -> "Address.CA.ValidUntil"
    }


    /**
     * For Japanese addresses, the display keys are different, the Kanji fields get the
     * standard display keys while the standard fields get the Phonetic display keys.
     */
    var fieldsToTrack_JP : HashMap<String,String> = null
    if(address.Country == Country.TC_JP) {
      fieldsToTrack_JP = new HashMap<String, String>() {
          "AddressLine1" -> "Web.AddressBook.AddressInputSet.Address1Phonetic",
          "AddressLine1Kanji" -> "Web.AddressBook.AddressInputSet.Address1",
          "AddressLine2" -> "Web.AddressBook.AddressInputSet.Address2Phonetic",
          "AddressLine2Kanji" -> "Web.AddressBook.AddressInputSet.Address2",
          "City"         -> "Web.AddressBook.AddressInputSet.CityPhonetic",
          "CityKanji"         -> "Web.AddressBook.AddressInputSet.City"
      }
      fieldsToTrack.putAll(fieldsToTrack_JP)
    }
    return fieldsToTrack
  }

  /**
   * Checks an Address entity for any changes to fields that should generate a tracked history.
   *
   * @param address - the address to check for changes
   * @return boolean - true if any of the fields that should generate a tracked history are changed
   */
  public static function hasChangesToTrackableFields(address : entity.Address) : boolean {
    return (address.ChangedFields.contains("AddressLine1")
        or address.ChangedFields.contains("AddressLine2")
        or address.ChangedFields.contains("AddressLine1Kanji")
        or address.ChangedFields.contains("AddressLine2Kanji")
        or address.ChangedFields.contains("AddressLine3")
        or address.ChangedFields.contains("City")
        or address.ChangedFields.contains("CityKanji")
        or address.ChangedFields.contains("County")
        or address.ChangedFields.contains("State")
        or address.ChangedFields.contains("PostalCode")
        or address.ChangedFields.contains("Country")
        or address.ChangedFields.contains("CEDEX")
        or address.ChangedFields.contains("CEDEXBureau")
        or address.ChangedFields.contains("AddressType")
        or address.ChangedFields.contains("ValidUntil")
        or address.ChangedFields.contains("Description"))
  }
}
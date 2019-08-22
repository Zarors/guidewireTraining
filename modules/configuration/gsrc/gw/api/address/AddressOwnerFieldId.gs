package gw.api.address

uses java.util.*
uses java.lang.Throwable
uses java.lang.IllegalStateException

/**
 * Used to provide type safety and defines Field ID constants for Address fields
 */
@Export
class AddressOwnerFieldId {
  var _name : String

  protected construct(aName : String) {
    _name = aName
  }

  property get Name() : String {
    return _name
  }  

  @Deprecated("Replaced by 'Name' property")
  property get Named() : String {
    return _name
  }

  override function equals(obj : Object) : boolean {
    return obj typeis AddressOwnerFieldId and Name == obj.Name
  }

  override function hashCode() : int {
    return _name.hashCode()
  }

  /**
   * Constants for available fields
   */
  public static final var ADDRESSLINE1 : AddressOwnerFieldId = new AddressOwnerFieldId("AddressLine1")
  public static final var ADDRESSLINE2 : AddressOwnerFieldId = new AddressOwnerFieldId("AddressLine2")
  public static final var ADDRESSLINE3 : AddressOwnerFieldId = new AddressOwnerFieldId("AddressLine3")
  public static final var CITY : AddressOwnerFieldId = new AddressOwnerFieldId("City")
  
  public static final var COUNTY : AddressOwnerFieldId = new AddressOwnerFieldId("County")
  public static final var STATE : AddressOwnerFieldId = new AddressOwnerFieldId("State")
  public static final var POSTALCODE : AddressOwnerFieldId = new AddressOwnerFieldId("PostalCode")
  public static final var COUNTRY : AddressOwnerFieldId = new AddressOwnerFieldId("Country")
  public static final var ADDRESSTYPE : AddressOwnerFieldId = new AddressOwnerFieldId("AddressType")

  public static final var ADDRESSLINE1KANJI : AddressOwnerFieldId = new AddressOwnerFieldId("AddressLine1Kanji")
  public static final var ADDRESSLINE2KANJI : AddressOwnerFieldId = new AddressOwnerFieldId("AddressLine2Kanji")
  public static final var CITYKANJI : AddressOwnerFieldId = new AddressOwnerFieldId("CityKanji")
  public static final var CEDEX : AddressOwnerFieldId = new AddressOwnerFieldId("CEDEX")
  public static final var CEDEXBUREAU : AddressOwnerFieldId = new AddressOwnerFieldId("CEDEXBureau")

  // not used by GlobalAddressInputSet
  public static final var DESCRIPTION : AddressOwnerFieldId = new AddressOwnerFieldId("Description")
  public static final var VALIDUNTIL : AddressOwnerFieldId = new AddressOwnerFieldId("ValidUntil")

  /** Empty set of fields */
  public final static var NO_FIELDS : Set<AddressOwnerFieldId>
          = new HashSet<AddressOwnerFieldId>() { }.freeze()

  public final static var ALL_PCF_FIELDS : Set<AddressOwnerFieldId> = new HashSet<AddressOwnerFieldId>()
    { ADDRESSLINE1, ADDRESSLINE2, ADDRESSLINE3, CITY, COUNTY, STATE, POSTALCODE, COUNTRY,
      ADDRESSLINE1KANJI, ADDRESSLINE2KANJI, CITYKANJI, CEDEX, CEDEXBUREAU }.freeze()

  public final static var ADDRESSLINE1_FIELDS : Set<AddressOwnerFieldId> =  new HashSet<AddressOwnerFieldId>()
    { ADDRESSLINE1, ADDRESSLINE1KANJI }.freeze()

  public final static var ADDRESSLINE2_FIELDS : Set<AddressOwnerFieldId> = new HashSet<AddressOwnerFieldId>()
    { ADDRESSLINE2, ADDRESSLINE2KANJI }.freeze()

  public final static var CITY_FIELDS : Set<AddressOwnerFieldId> = new HashSet<AddressOwnerFieldId>()
    { CITY, CITYKANJI }.freeze()

  public final static var POSTALCODE_FIELDS : Set<AddressOwnerFieldId> =  new HashSet<AddressOwnerFieldId>()
    { POSTALCODE, CEDEX, CEDEXBUREAU }.freeze()    

  public final static var CITY_STATE_ZIP : Set<AddressOwnerFieldId> =  new HashSet<AddressOwnerFieldId>()
    { CITY, STATE, POSTALCODE, CEDEX, CEDEXBUREAU }.freeze()
    
  public final static var ADDRESSLINE1_CITY_STATE_ZIP : Set<AddressOwnerFieldId> = new HashSet<AddressOwnerFieldId>()
    { ADDRESSLINE1, CITY, STATE, POSTALCODE, CEDEX, CEDEXBUREAU }.freeze()
    
  public final static var HIDDEN_FOR_SEARCH : Set<AddressOwnerFieldId> = new HashSet<AddressOwnerFieldId>()
  { ADDRESSLINE1, ADDRESSLINE2, ADDRESSLINE3, COUNTY, ADDRESSLINE1KANJI, ADDRESSLINE2KANJI, CEDEX, CEDEXBUREAU }.freeze()

  public final static var HIDDEN_FOR_PROXIMITY_SEARCH : Set<AddressOwnerFieldId> =  new HashSet<AddressOwnerFieldId>()
  { ADDRESSLINE1KANJI, ADDRESSLINE2KANJI, CITYKANJI, CEDEX, CEDEXBUREAU }.freeze()
}

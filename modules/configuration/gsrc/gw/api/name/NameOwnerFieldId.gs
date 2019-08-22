package gw.api.name
uses java.util.*
uses java.lang.Throwable

@Export
class NameOwnerFieldId {
  var _name : String

  protected construct(aName : String) {
    _name = aName
  }

  property get Name() : String {
    return _name
  }  

  override function equals(obj : Object) : boolean {
    return obj typeis NameOwnerFieldId and Name == obj.Name
  }

  override function hashCode() : int {
    return _name.hashCode()
  }

  /**
   * Constants for available fields for person name
   */
  public static final var PREFIX : NameOwnerFieldId = new NameOwnerFieldId("Prefix")
  public static final var FIRSTNAME : NameOwnerFieldId = new NameOwnerFieldId("FirstName")
  public static final var MIDDLENAME : NameOwnerFieldId = new NameOwnerFieldId("MiddleName")
  public static final var PARTICLE : NameOwnerFieldId = new NameOwnerFieldId("Particle")
  public static final var LASTNAME : NameOwnerFieldId = new NameOwnerFieldId("LastName")
  public static final var SUFFIX : NameOwnerFieldId = new NameOwnerFieldId("Suffix")
  public static final var FIRSTNAMEKANJI : NameOwnerFieldId = new NameOwnerFieldId("FirstNameKanji")
  public static final var LASTNAMEKANJI : NameOwnerFieldId = new NameOwnerFieldId("LastNameKanji")

  /**
   * Constants for available fields for non-person name
   */
  public static final var NP_NAME : NameOwnerFieldId = new NameOwnerFieldId("Name")
  public static final var NAMEKANJI : NameOwnerFieldId = new NameOwnerFieldId("NameKanji")


  /** Empty set of fields */
  public final static var NO_FIELDS : Set<NameOwnerFieldId>
          = new HashSet<NameOwnerFieldId>() { }.freeze()

  public final static var ALL_PCF_FIELDS : Set<NameOwnerFieldId> =
    new HashSet<NameOwnerFieldId>() { PREFIX, FIRSTNAME, MIDDLENAME, PARTICLE, LASTNAME, SUFFIX, FIRSTNAMEKANJI, LASTNAMEKANJI, NP_NAME, NAMEKANJI }.freeze()

  /** Fields used for non-Person names */
  public final static var ALL_CONTACT_PCF_FIELDS : Set<NameOwnerFieldId> = new HashSet<NameOwnerFieldId>() { NP_NAME, NAMEKANJI }.freeze()

  /** Required fields (union of fields for both Persons and non-Persons) */
  public final static var REQUIRED_NAME_FIELDS : Set<NameOwnerFieldId> = new HashSet<NameOwnerFieldId>()
    { LASTNAME, NP_NAME }.freeze()

  /** Fields shown in display names */
  public static final var DISPLAY_NAME_FIELDS : Set<NameOwnerFieldId> = new HashSet<NameOwnerFieldId>() {
    FIRSTNAME, PARTICLE, LASTNAME, SUFFIX }.freeze()
          
  /** Fields for simple name */
  public final static var FIRST_LAST_FIELDS : Set<NameOwnerFieldId> = new HashSet<NameOwnerFieldId>()
    { FIRSTNAME, LASTNAME }.freeze()

  public final static var HIDDEN_FOR_SEARCH : Set<NameOwnerFieldId> = new HashSet<NameOwnerFieldId>()
  { PREFIX, MIDDLENAME, PARTICLE, SUFFIX }.freeze()
}

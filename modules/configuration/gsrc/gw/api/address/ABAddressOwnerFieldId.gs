package gw.api.address

uses java.util.*

@Export
class ABAddressOwnerFieldId extends AddressOwnerFieldId {

  private construct(aName:String) {
    super(aName)
  }

  /**
   * Required contact fields for countries that do not have states/provinces
   */
  public final static var COUNTRY_WITHOUT_STATES_PLACE_REQUIRED
          : Set<AddressOwnerFieldId>  = new HashSet<AddressOwnerFieldId>()
            {
              POSTALCODE,
              ADDRESSLINE1,
              CITY,
              COUNTRY
            }.freeze()
  
  /**
   * Required contact fields for countries that have states (such as US, Canada, Australia).
   * Same as PLACE_REQUIRED, but requires State to be present as well.
   */
  public final static var COUNTRY_WITH_STATES_PLACE_REQUIRED
          : Set<AddressOwnerFieldId> =  new HashSet<AddressOwnerFieldId>()
            {
              POSTALCODE,
              ADDRESSLINE1,
              CITY,
              STATE,
              COUNTRY
            }.freeze()

}

package gw.api.contact


// @Export because customer may modify the Address entity.
@Export
class ABAddressUtil
{
  private construct(){}
  
  /**
   * Autofill the search criteria based on address configuration.
   * @param triggerField the field that is the source from which other fields are filled.
   * @param criteria     the criteria whose address will be autofilled.  If the criteria 
   *                     does not have an address currently set, a default address will 
   *                     be created.
   */
  public static function autofillCriteria(criteria : ABContactSearchCriteria , triggerField : String ) {

    // Create a temporary address entity
    var addr = criteria.Address == null ? new Address(criteria) : criteria.Address

    // autofill the address.
    AddressAutocompleteUtil.autofillAddress( addr, triggerField )

    // Copy the results back to the criteria.
    criteria.Address.State = addr.State
    criteria.Address.City = addr.City
    criteria.Address.PostalCode = addr.PostalCode
    criteria.Address.Country = addr.Country
  }
}

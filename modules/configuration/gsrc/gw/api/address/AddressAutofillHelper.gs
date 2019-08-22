package gw.api.address
uses gw.api.contact.AutofillRequest
uses gw.api.contact.AddressAutocompleteHandler
uses java.lang.IllegalArgumentException

@Export 
class AddressAutofillHelper
{
  var requests : java.util.HashMap<AutofillableField, AutofillRequest> = 
  new java.util.HashMap<AutofillableField, AutofillRequest>(4)
  
  var acHandlers : java.util.HashMap<AutofillableField, AddressAutocompleteHandler> = 
  new java.util.HashMap<AutofillableField, AddressAutocompleteHandler>(4)

  var _country : Country 
  
  public construct(country : Country) {
    if (country == TC_US) {
    requests.put(POSTAL_CODE, new AutofillRequest(country, "PostalCode",{"PostalCode","City","State"}))
    requests.put(COUNTY, new AutofillRequest(country, "County",{"County", "PostalCode","City", "State"}))
    requests.put(CITY, new AutofillRequest(country, "City",{"City", "PostalCode"}))
    requests.put(STATE, new AutofillRequest(country, "State",{"State", "PostalCode", "City"}))
    acHandlers.put(CITY, new AddressAutocompleteHandler("city","Country,City,County,State,PostalCode",true))
    acHandlers.put(COUNTY, new AddressAutocompleteHandler("county","Country,City,County,State,PostalCode",true))
    acHandlers.put(POSTAL_CODE, new AddressAutocompleteHandler("postalcode","Country,City,County,State,PostalCode",true))
    } else if (country == TC_CA) {
    requests.put(POSTAL_CODE, new AutofillRequest(country, "PostalCode",{"PostalCode","City","State"}))
    requests.put(CITY, new AutofillRequest(country, "City",{"City", "PostalCode"}))
    requests.put(STATE, new AutofillRequest(country, "State",{"State", "PostalCode", "City"}))

    acHandlers.put(CITY, new AddressAutocompleteHandler("city","Country,City,State,PostalCode",true))
    acHandlers.put(POSTAL_CODE, new AddressAutocompleteHandler("postalcode","Country,City,State,PostalCode",true))
    } else {
      throw new IllegalArgumentException("Country " + country + " is not currently supported.  Please modify AddressAutofillHelper to support this country.")
    }
    
    _country = country
  }

  public function setDoOverride(field : AutofillableField, doOverride : boolean) {
    requests.get(field).DoOverride = doOverride
  }
  
  public function getValue(field : AutofillableField, values : Object[], triggerIndex :int) : Object {
    return requests.get(field).getAutofillValue( values, triggerIndex)
  }
  
  public function getStateValueRange(values : Object[], triggerIndex :int) : Object[] {
    var result = requests.get(State).getValueRange( values, triggerIndex)
    if (result == null) {
      return gw.api.contact.AddressAutocompleteUtil.getStates( _country)
    }
    return result
  }

  public function getAutocompleteHandler(field : AutofillableField) : AddressAutocompleteHandler {
    var handler = acHandlers.get(field)
    if (handler == null) {
      throw new IllegalArgumentException("No handler defined for field " + field)
    }
    return handler
  }
  
  public static function clearAddress(addr: AddressFillable) {
    addr.City = null
    addr.County = null
    addr.State = null
    addr.PostalCode = null
  }  

}

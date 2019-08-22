package gw.api.databuilder

uses gw.transaction.Transaction
uses java.lang.StringBuilder
uses gw.api.database.spatial.SpatialPoint

/**
 * Sample address used for proximity search testing since it contains geocoding result
 */
@Export
class SampleAddress
{
  var _addressLine : String as readonly AddressLine
  var _postalCode : String as readonly PostalCode
  var _city : String as readonly City
  var _state : State as readonly State
  var _country : Country as readonly Country 
  
  var _geocodeStatus : GeocodeStatus as readonly GeocodeStatus
  var _spatialPoint : SpatialPoint as readonly SpatialPoint

  construct(address: Address)
  {
    _postalCode = address.PostalCode
    _city = address.City
    _state = address.State
    if (address.Country == null) { _country = TC_US } 
      else { _country = address.Country }
    _addressLine = address.AddressLine1
    _geocodeStatus = address.GeocodeStatus
    _spatialPoint = address.SpatialPoint
  }


  construct(postalCode1:String, city1:String, state1:State)
  {
    this(postalCode1, city1, state1, null)
  }
  
  construct(postalCode1:String, city1:String, state1:State, address1:String) {
    _postalCode = postalCode1
    _city = city1
    _state = state1
    _country = TC_US
    _addressLine = address1
  }
  
  public function withGeocode(status:GeocodeStatus, spatialPointWKT:String) : SampleAddress {
    _geocodeStatus = status
    _spatialPoint = spatialPointWKT == null ? null : SpatialPoint.parse(spatialPointWKT)
    return this
  }
  
  function createAddressGeocoded() : Address {
      var address = create()
      address.SpatialPoint = _spatialPoint
      address.GeocodeStatus = _geocodeStatus
      return address
  }
  
  function create() : Address {
    var address = new Address()
      if (_addressLine != null) {
          address.AddressLine1 = _addressLine
      }
      if (_city != null) {
          address.City = _city
      }
      if (_state != null) {
          address.State = _state
      }
      if (_postalCode != null) {
          address.PostalCode = _postalCode
      }
      address.Country = _country
      return address
  }

  
  function updateAddressAndCommit(user:User) {
    Transaction.runWithNewBundle( \ bundle -> {
      bundle.add( user)
      updateAddress(user)
    } )
  }
  
  function updateAddress(user:User) {
    var address = user.Contact.PrimaryAddress
    address.AddressLine1 = AddressLine
    address.City = City
    address.State = State
    address.PostalCode = PostalCode
    address.Country = Country
    address.setGeocodeFieldsFromSpatialPoint( SpatialPoint )
    address.GeocodeStatus = GeocodeStatus
  }
  
  static property get Pasadena() : SampleAddress {
    return new SampleAddress("91101", "Pasadena", State.TC_CA).withGeocode(TC_POSTALCODE, new SpatialPoint(-118.1324, 34.1425).WellKnownText)}
  static property get Pasadena_LakeAve() : SampleAddress {
    return new SampleAddress("91101-3009", "Pasadena", State.TC_CA, "225 S. LAKE AVE, STE 300").withGeocode(TC_EXACT, new SpatialPoint(-118.1324, 34.1425).WellKnownText)}
  static property get SanDiego() : SampleAddress {
    return new SampleAddress(null, "San Diego", State.TC_CA).withGeocode(TC_CITY, new SpatialPoint(-117.0999, 32.7823).WellKnownText)}
  static property get SF_BealeSt() : SampleAddress {
    return new SampleAddress("94104", "San Francisco", State.TC_CA, "3220 Beale St").withGeocode(TC_EXACT, new SpatialPoint(-122.3972, 37.7925).WellKnownText)}
  static property get SanJose() : SampleAddress {
    return new SampleAddress("95126", "San Jose", State.TC_CA, null).withGeocode(TC_EXACT, new SpatialPoint(-121.8991, 37.3254).WellKnownText)  }
  static property get PheonixAZ_Perf() : SampleAddress {
    return new SampleAddress("85012", "PHOENIX", State.TC_AZ, "4000 N. CENTRAL AVE.").withGeocode(TC_EXACT, new SpatialPoint(-112.0738, 33.4939).WellKnownText)}
  static property get FailureAddress() : SampleAddress {
    return new SampleAddress("99999", null, null, null).withGeocode(TC_FAILURE, null)}

  public function getInternalString() : String {
    var sb = new StringBuilder()
    var s = _addressLine
    if (s != null && s.trim().length() > 0) {
        sb.append(s)
    }
    s = _city
    if (s != null && s.trim().length() > 0) {
        if (sb.length() > 0) {
            sb.append(", ")
        }
        sb.append(s)
    }
    var st = _state
    if (st != null) {
        s = st.Code
        if (s != null && s.trim().length() > 0) {
            if (sb.length() > 0) {
                sb.append(", ")
            }
            sb.append(s)
        }
    }
    s = _postalCode
    if (s != null && s.trim().length() > 0) {
        if (sb.length() > 0) {
            sb.append(" ")
        }
        sb.append(s)
    }
    var c = _country
    if (c != null) {
        s = c.Code
        if (s != null && s.trim().length() > 0) {
            if (sb.length() > 0) {
                sb.append(", ")
            }
            sb.append(s)
        }
    }
    return sb.toString()
  }
}


package gw.api.address

/*
 * AddressFillable delegate for an Address entity.  This class uses the idiom _ao.Address.XXX to trigger
 * autocreate for the Address.
 */
@Export
class AddressEntityDelegate implements AddressFillableExtension {
  private var _ao : AddressOwner

  construct(ao : AddressOwner) {
    _ao = ao
  }
  
  override property get AddressLine1() : String {
    return _ao.Address.AddressLine1
  }

  override property set AddressLine1(value : String) {
    _ao.Address.AddressLine1 = value
  }

  override property get AddressLine2() : String {
    return _ao.Address.AddressLine2
  }

  override property set AddressLine2(value : String) {
    _ao.Address.AddressLine2 = value
  }

  override property get AddressLine3() : String {
    return _ao.Address.AddressLine3
  }

  override property set AddressLine3(value : String) {
    _ao.Address.AddressLine3 = value
  }

  override property get City() : String {
    return _ao.Address.City
  }

  override property set City(value : String) {
    _ao.Address.City = value
  }

  override property get Country() : Country {
    return _ao.Address.Country
  }

  override property set Country(value : Country) {
    _ao.Address.Country = value
  }

  override property get County() : String {
    return _ao.Address.County
  }

  override property set County(value : String) {
    _ao.Address.County = value
  }

  override property get PostalCode() : String {
    return _ao.Address.PostalCode
  }

  override property set PostalCode(value : String) {
    _ao.Address.PostalCode = value
  }

  override property get State() : State {
    return _ao.Address.State
  }

  override property set State(value : State) {
    _ao.Address.State = value
  }

  override property get AddressLine1Kanji() : String {
    return _ao.Address.AddressLine1Kanji
  }

  override property set AddressLine1Kanji(value : String) {
    _ao.Address.AddressLine1Kanji = value
  }

  override property get AddressLine2Kanji() : String {
    return _ao.Address.AddressLine2Kanji
  }

  override property set AddressLine2Kanji(value : String) {
    _ao.Address.AddressLine2Kanji = value
  }

  override property get CityKanji() : String {
    return _ao.Address.CityKanji
  }

  override property set CityKanji(value : String) {
    _ao.Address.CityKanji = value
  }

  override property get CEDEX() : Boolean {
    return _ao.Address.CEDEX
  }

  override property set CEDEX(value : Boolean) {
    _ao.Address.CEDEX = value
  }

  override property get CEDEXBureau() : String {
    return _ao.Address.CEDEXBureau
  }

  override property set CEDEXBureau(value : String) {
    _ao.Address.CEDEXBureau = value
  }
}

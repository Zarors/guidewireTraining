package gw.api.address

/*
* Define property setters/getters here for fields added to AddressAutofillable.eti that are not defined in AddressFillable.
*/
@Export
class AddressAutofillableDelegate implements AddressFillableExtension {
  delegate _af : AddressAutofillable represents AddressFillable

  construct(af : AddressAutofillable) {
     _af = af
  }

  override property set CEDEX(value : Boolean) { _af.CEDEX = value }
  override property get CEDEX() : Boolean { return _af.CEDEX }

  override property set CEDEXBureau(value : String) { _af.CEDEXBureau = value }
  override property get CEDEXBureau() : String { return _af.CEDEXBureau }

  override property set CityKanji(value : String) { _af.CityKanji = value }
  override property get CityKanji() : String { return _af.CityKanji }

  override property set AddressLine1Kanji(value : String) { _af.AddressLine1Kanji = value }
  override property get AddressLine1Kanji() : String { return _af.AddressLine1Kanji }

  override property set AddressLine2Kanji(value : String) { _af.AddressLine2Kanji = value }
  override property get AddressLine2Kanji() : String { return _af.AddressLine2Kanji }
}

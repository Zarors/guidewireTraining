package gw.api.address

/*
* Define properties here for fields added to AddressAutofillable.eti that are not defined in AddressFillable.
*
*/
@Export
interface AddressFillableExtension extends AddressFillable {

  property get AddressLine1Kanji() : String
  property set AddressLine1Kanji(value : String)

  property get AddressLine2Kanji() : String
  property set AddressLine2Kanji(value : String)

  property get CityKanji() : String
  property set CityKanji(value : String)

  property get CEDEX() : Boolean
  property set CEDEX(value : Boolean)

  property get CEDEXBureau() : String
  property set CEDEXBureau(value : String)

}

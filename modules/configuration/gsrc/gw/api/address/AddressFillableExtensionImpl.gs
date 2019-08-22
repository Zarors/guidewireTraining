package gw.api.address

@Export
class AddressFillableExtensionImpl implements AddressFillableExtension {

  var _AddressLine1 : String as AddressLine1
  var _AddressLine2 : String as AddressLine2
  var _AddressLine3 : String as AddressLine3
  var _City : String as City
  var _County : String as County
  var _State : State as State
  var _PostalCode : String as PostalCode
  var _Country : Country as Country
  
  var _AddressLine1Kanij : String as AddressLine1Kanji
  var _AddressLine2Kanij : String as AddressLine2Kanji  
  var _CityKanji : String as CityKanji
  var _CEDEX : Boolean as CEDEX
  var _CEDEXBureau : String as CEDEXBureau
}

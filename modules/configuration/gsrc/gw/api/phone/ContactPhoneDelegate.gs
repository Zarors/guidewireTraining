package gw.api.phone

uses gw.api.util.PhoneUtil
uses gw.lang.reflect.features.PropertyReference
uses gw.lang.reflect.features.BoundPropertyReference
uses gw.lang.reflect.IPropertyInfo

/**
* This is phone delegate is specially designed to work with Contact entities. It will automatically set the primary phone type
*/
@Export
class ContactPhoneDelegate extends PhoneDelegateBase {
  var _type: PhoneType
  /**
   * @deprecated
   * @see ContactPhoneDelegate#init(Object, PropertyReference)
  */
  construct(value: Object, aType: PhoneType) {
    var propRef = toBuiltInColumnReference(aType)
    initialize(value, propRef.PropertyInfo)
    _type = aType
  }


  construct(value: Object, propRef: PropertyReference ) {
    initialize(value, propRef.PropertyInfo)
    _type = fromPropInfoToPhoneType(propRef.PropertyInfo)
  }

  construct(value: Object, boundPropRef: BoundPropertyReference){
    initialize(value, boundPropRef.PropertyInfo)
    _type = fromPropInfoToPhoneType(boundPropRef.PropertyInfo)
  }

  override property set NationalSubscriberNumber(value: String) {
    super.NationalSubscriberNumber = value
    setPrimaryPhoneType(value)
  }

  function setPrimaryPhoneType(value: String) {
    if (Bean["PrimaryPhone"] != null){
      return
    }
    var phoneNums = {Bean["WorkPhone"], Bean["HomePhone"]}
    if (Bean typeis Person){
      phoneNums.add(Bean["CellPhone"] as String)
    }
    phoneNums.removeWhere(\s -> s == null)
    if (phoneNums.Count == 1 and PhoneUtil.normalize(phoneNums.single() as String) == PhoneUtil.normalize(value)) {
      Bean["PrimaryPhone"] = toPrimaryPhoneType(Type)
    }
  }
  
  final function toBuiltInColumnReference(t: PhoneType) : PropertyReference {
    switch(t){
      case PhoneType.TC_CELL:
        return Person#CellPhone
      case PhoneType.TC_FAX:
        return Contact#FaxPhone
      case PhoneType.TC_HOME:
        return Contact#HomePhone
      case PhoneType.TC_WORK:
        return Contact#WorkPhone
    }
    return null
  }

  final function fromPropInfoToPhoneType(info : IPropertyInfo) : PhoneType {
    switch(info.Name){
      case "FaxPhone":
        return PhoneType.TC_FAX
      case "HomePhone":
        return PhoneType.TC_HOME
      case "CellPhone":
        return PhoneType.TC_CELL
      case "WorkPhone":
        return PhoneType.TC_WORK
    }
    return PhoneType.TC_GENERIC
  }

  function toPrimaryPhoneType(t: PhoneType): PrimaryPhoneType {
    switch (t) {
      case PhoneType.TC_CELL:
          return PrimaryPhoneType.TC_MOBILE
      case PhoneType.TC_HOME:
          return PrimaryPhoneType.TC_HOME
      case PhoneType.TC_WORK:
          return PrimaryPhoneType.TC_WORK
    }
    return null
  }

  override property get Type(): PhoneType {
    return _type
  }

  override property set Type(type: PhoneType) {
    _type = type
  }
}

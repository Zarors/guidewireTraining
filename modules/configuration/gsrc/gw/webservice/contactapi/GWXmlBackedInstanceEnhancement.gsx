package gw.webservice.contactapi

uses gw.api.util.PhoneUtil
uses gw.webservice.contactapi.beanmodel.XmlBackedInstance
uses gw.webservice.contactapi.beanmodel.anonymous.elements.XmlBackedInstance_Array
uses gw.webservice.contactapi.beanmodel.anonymous.elements.XmlBackedInstance_Fk

/**
 * Enhancement methods for XmlBackedInstance.
 */
@Export
enhancement GWXmlBackedInstanceEnhancement : XmlBackedInstance {
  
  property get ExternalUpdateUser() : String {
    return this.External_UpdateUser
  }
  
  property get ExternalUpdateApp() : String {
    return this.External_UpdateApp
  }
  
  property get PublicID() : String {
    return this.fieldValue("PublicID")
  }

  function nonNullArrayByName(arrayName : String) : XmlBackedInstance_Array {
    var instanceArray = this.arrayByName(arrayName)
    if (instanceArray == null) {
      instanceArray = new XmlBackedInstance_Array()
      instanceArray.Name = arrayName
      this.Array.add(instanceArray)
    }
    return instanceArray
  }
  
  function nonNullForeignKeyByName(fkName : String, fkEntityType : String) : XmlBackedInstance_Fk {
    var instanceFk = this.foreignKeyByName(fkName)
    if (instanceFk == null) {
      instanceFk = new XmlBackedInstance_Fk()
      this.Fk.add(instanceFk)
      instanceFk.Name = fkName
      instanceFk.XmlBackedInstance = new XmlBackedInstance()
      instanceFk.XmlBackedInstance.EntityType = fkEntityType
    }
    return instanceFk
  }
  
  function phoneFieldValue(fieldName : String) : String {
    return PhoneUtil.normalize(this.fieldByName(fieldName).Value)
  }
  
  function origValue(fieldName : String) : String {
    return this.fieldByName(fieldName).OrigValue
  }
  
  public function hasChangedPrimaryAddress() : boolean {
    if(this.PrimaryAddress==null and this.PrimaryAddressForeignKey.OrigValue==null) {
      return false
    } else {
      return this.PrimaryAddressForeignKey.OrigValue!=this.PrimaryAddress.LinkID or
      this.PrimaryAddress.Field.firstWhere(\ field -> {
        return field.OrigValue!=field.Value
      }) != null
    }
  }
  
}
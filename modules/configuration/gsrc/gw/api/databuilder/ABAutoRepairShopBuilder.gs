package gw.api.databuilder

@Export
class ABAutoRepairShopBuilder extends ABCompanyVendorBuilderBase<ABAutoRepairShop, ABAutoRepairShopBuilder> {

  construct() {
    super(ABAutoRepairShop)
  }

  function withAutoRepairLicense(autoRepairLicense : String) : ABAutoRepairShopBuilder {
    set(ABAutoRepairShop.Type.TypeInfo.getProperty("AutoRepairLicense"), autoRepairLicense)
    return this
  }

}

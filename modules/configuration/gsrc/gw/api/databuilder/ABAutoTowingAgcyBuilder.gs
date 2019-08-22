package gw.api.databuilder

@Export
class ABAutoTowingAgcyBuilder extends ABCompanyVendorBuilderBase<ABAutoTowingAgcy, ABAutoTowingAgcyBuilder> {

  construct() {
    super(ABAutoTowingAgcy)
  }

  function withAutoTowingLicense(autoTowingLicense : String) : ABAutoTowingAgcyBuilder {
    set(ABAutoTowingAgcy.Type.TypeInfo.getProperty("AutoTowingLicense"), autoTowingLicense)
    return this
  }

}

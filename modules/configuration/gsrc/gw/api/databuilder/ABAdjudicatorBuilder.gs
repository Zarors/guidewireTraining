package gw.api.databuilder

@Export
class ABAdjudicatorBuilder extends ABPersonBuilderBase<ABAdjudicator, ABAdjudicatorBuilder> {

  construct() {
    super(ABAdjudicator)
  }
  
  function withAdjudicativeDomain(adjudicativeDomain : AdjudicativeDomain ) : ABAdjudicatorBuilder {
    set(ABAdjudicator.Type.TypeInfo.getProperty("AdjudicativeDomain"), adjudicativeDomain)
    return this
  }

  function withAdjudicatorLicense(adjudicatorLicense : String ) : ABAdjudicatorBuilder {
    set(ABAdjudicator.Type.TypeInfo.getProperty("AdjudicatorLicense"), adjudicatorLicense)
    return this
  }

}

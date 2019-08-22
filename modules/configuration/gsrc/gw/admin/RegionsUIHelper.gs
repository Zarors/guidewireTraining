package gw.admin

uses gw.api.database.Query

@Export
class RegionsUIHelper {
  // Change this value and the pagesize value on RegionSearchResultsLV at the same time
  static var numberOfResultSearchPanelVisibilityThreshold = gw.api.system.PLConfigParameters.ListViewPageSizeDefault.Value

  static enum SearchOn {
    ALWAYS, NEVER, AUTO
  }

  static property get isSearchOn(): SearchOn {
    return SearchOn.AUTO
  }

  property get allRegionsCount(): int {
    return Query.make(Region).select().Count
  }

  function searchPanelVisible(): boolean {
    return isSearchOn == SearchOn.ALWAYS or
        (isSearchOn == SearchOn.AUTO and allRegionsCount > numberOfResultSearchPanelVisibilityThreshold)
  }
}
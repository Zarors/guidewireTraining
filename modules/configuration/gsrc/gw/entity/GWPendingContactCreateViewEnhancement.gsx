package gw.entity
uses gw.api.database.Query
uses gw.api.database.Relop

/**
 * Enhancement that provides a String description of the tags on an ABContact.
 */
@Export
enhancement GWPendingContactCreateViewEnhancement : entity.PendingContactCreateView {

/**
 * Returns a string description of the tags on an ABContact or an empty string
 * if no tags exist.
 * The string description is the list of ContactTagType DisplayName properties
 * sorted and comma separated.
 * 
 * @return the string description.
 */
  property get ABContactTagsDescription() : String {
    var tags = Query.make(ABContactTag).compare("ABContact", Relop.Equals, this.ABContactID).select().toTypedArray()
    return tags.sortBy(\ c -> c.Type.DisplayName).sortBy(\ c -> c.Type.Priority).map(\ c -> c.Type.DisplayName).join(", ")
  }
  
}

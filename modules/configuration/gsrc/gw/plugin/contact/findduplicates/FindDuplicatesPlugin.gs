package gw.plugin.contact.findduplicates

uses gw.api.database.IQuery
uses gw.api.database.IQueryBuilder
uses gw.api.database.Query
uses gw.api.system.ABLoggerCategory
uses gw.api.webservice.addressbook.contactapi.ABContactAPISearchResultHelper
uses gw.api.webservice.addressbook.contactapi.ABContactAPISearchSpec
uses gw.api.webservice.addressbook.contactapi.ABContactSearchExecutor
uses gw.api.webservice.addressbook.contactapi.ABContactSearchResult
uses gw.api.webservice.addressbook.contactapi.ABContactSearchSpec
uses gw.plugin.contact.ABContactSubtypeLogic
uses java.util.List
uses java.util.Map


/**
 * This class implements the out of the box implementation of IFindDuplicatesPlugin.
 * findDuplicates() is implemented as follows:
 *   - A DuplicateFinder is used to get subtype specific behavior.
 *   - Generate a set of queries which will return all the exact or potential matches.
 *   - Execute the union of those queries.
 *   - Loop through the results and see if it's a potential or exact match.
 */
@Export
class FindDuplicatesPlugin implements gw.plugin.contact.IFindDuplicatesPlugin {
  private static var _logger = ABLoggerCategory.SEARCH_FINDDUPLICATES

  private static final var WIDE_MAP : Map<typekey.ABContact, Type<DuplicateFinderBase>> = { 
    typekey.ABContact.TC_ABCOMPANY       -> CompanyDuplicateFinder<ABCompany>,
    typekey.ABContact.TC_ABPERSON        -> PersonDuplicateFinder<ABPerson>,
    typekey.ABContact.TC_ABPLACE         -> PlaceDuplicateFinder
  }
  
  private static final var DEFAULT_MAP : Map<typekey.ABContact, Type<DuplicateFinderBase>> = {
    typekey.ABContact.TC_ABCOMPANYVENDOR -> CompanyDuplicateFinder<ABCompanyVendor>,
    typekey.ABContact.TC_ABCOMPANY       -> CompanyDuplicateFinder<ABCompany>,
    typekey.ABContact.TC_ABPERSONVENDOR  -> PersonVendorDuplicateFinder,
    typekey.ABContact.TC_ABUSERCONTACT   -> UserDuplicateFinder,
    typekey.ABContact.TC_ABPERSON        -> PersonDuplicateFinder<ABPerson>,
    typekey.ABContact.TC_ABPLACE         -> PlaceDuplicateFinder
  }
  
  /**
   * Finds contacts that match the specified contact.
   * @param contact the contact for which to find potential matches
   * @param searchSpec the searchSpec
   * @return The matches
   */
  @Deprecated("(Since 8.0.0) Use the other findDuplicates method that takes a ABContactSearchSpec and returns a ABContactSearchResult.")
  override function findDuplicates(searchContact : ABContact, searchSpec : ABContactAPISearchSpec) 
    : ABContactAPISearchResultHelper {
    return findDuplicates(searchContact, searchSpec.toABContactSearchSpec())
      .toABContactAPISearchResultHelper()
  }
  
  /**
   * Finds contacts that match the specified contact.
   * @param contact the contact for which to find potential matches
   * @param searchSpec the searchSpec
   * @return The matches
   */
  override function findDuplicates(searchContact : ABContact, searchSpec : ABContactSearchSpec) : 
  ABContactSearchResult {
    _logger.trace("FindDuplicatesPlugin.findDuplicates " + searchContact)
    
    //prevent pending contacts from trying to link with existing contacts
    if (searchContact.CreateStatus == ContactCreationApprovalStatus.TC_PENDING_APPROVAL and !searchSpec.IncludePendingCreates)
      return null
      
    var finder  = createDuplicateFinder(searchContact, searchSpec.WideSearch)
    finder.validateMandatoryFields(searchSpec.Locale)
    var queries = finder.makeQueries(searchSpec.Locale)
    var resultHelper = createResultHelper(queries, searchSpec)

    if (resultHelper.Results != null) {
      resultHelper.ResultsExact = new boolean[resultHelper.Results.Count]
      for (i in 0..|resultHelper.Results.Count) {
        resultHelper.ResultsExact[i] = finder.isExactMatch(searchContact, resultHelper.Results[i], searchSpec.Locale)
      }
    }
    return resultHelper
  }


  //
  // PRIVATE SUPPORT METHODS
  //
  
  private function createResultHelper(queries : List<Query<ABContact>>, searchSpec : ABContactSearchSpec) 
    : ABContactSearchResult {
    var resultHelper = new ABContactSearchResult() {
      :Results = new ABContact[0],
      :ResultsExact = new boolean[0],
      :TotalResults = 0
    }

    if (not queries.Empty) {
      
      if (searchSpec.SubtypeFilter != null) {
        for (query in queries) {
          // TODO:ddm decide what to do with this: (See CTC-460)
          // SubtypeFilter.Instance.addSubtypeRestriction(query, searchSpec)
          addSubtypeRestriction(query, searchSpec)
        }
      }
      
      if (searchSpec.TagMatcher != null) {
        for (query in queries) {
          addTagRestriction(query, searchSpec)
        }
      }
      
      //remove pending creates from find duplicates
      if (!searchSpec.IncludePendingCreates) {
        for (query in queries) {
          query.compare("CreateStatus", NotEquals, ContactCreationApprovalStatus.TC_PENDING_APPROVAL)
        }
      }

      var unionQuery : IQuery<ABContact> = queries[0]
      for (i in 0..|queries.Count - 1) {
        unionQuery = unionQuery.union(queries[i + 1])
      }
      var results = unionQuery.select()

      // This takes care of sorting, paging
      resultHelper =  ABContactSearchExecutor.convert(results, searchSpec)
    }
    return resultHelper
  }
  
  private function addSubtypeRestriction(query : IQueryBuilder, searchSpec : ABContactSearchSpec)  {
    var filter = searchSpec.SubtypeFilter
    if (filter == null || filter.Subtypes.IsEmpty) {
      return
    }

    query.compareNotIn("Subtype", filter.Subtypes)
  }

  private function addTagRestriction(query : IQueryBuilder, searchSpec : ABContactSearchSpec)  {
    var matcher = searchSpec.TagMatcher
    if (matcher == null || matcher.Tags.IsEmpty) {
      return
    }
    if (matcher.MatchAllTags) {
      for(tag in matcher.Tags) {
        query.subselect("ID", CompareIn, ABContactTag, "ABContact").compare("Type", Equals, tag)
      }
      query.subselect("ID", CompareNotIn, ABContactTag, "ABContact").compareNotIn("Type", matcher.Tags)
    }
    else {
      query.subselect("ID", CompareIn, ABContactTag, "ABContact").compareIn("Type", matcher.Tags)
    }
  }
  
  private function createDuplicateFinder(searchContact : ABContact, isWideSearch : boolean) : DuplicateFinderBase {
    var map = isWideSearch ? WIDE_MAP : DEFAULT_MAP
    var duplicateFinder = ABContactSubtypeLogic.createInstanceForSubtype(searchContact.Subtype, map)
    if (duplicateFinder == null) {
      throw "unhandled subtype: " + searchContact.Subtype
    }

    duplicateFinder.setSearchContact(searchContact)
    return duplicateFinder
  }
}

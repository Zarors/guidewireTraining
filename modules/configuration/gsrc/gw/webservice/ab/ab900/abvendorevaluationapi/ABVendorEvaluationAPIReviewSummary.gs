package gw.webservice.ab.ab900.abvendorevaluationapi

uses gw.api.system.ABLoggerCategory
uses gw.transaction.Transaction
uses gw.pl.persistence.core.Bundle
uses java.lang.Exception
uses java.lang.IllegalStateException
uses java.util.Date

@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/ab/ws/gw/webservice/ab/ab900/abvendorevaluationapi/ABVendorEvaluationAPIReviewSummary" )
final class ABVendorEvaluationAPIReviewSummary {

  public var name : String
  public var linkID : String
  public var serviceType : typekey.ReviewServiceType
  public var serviceDate : Date
  public var subContact : String             /* linkID of contact related to the review, e.g. repair person at vendor */
  public var reviewedBy : String             /* display name of CC user who entered review */
  public var claimNumber : String            /* claim number that review is related to */
  public var relatedTo : String              
  public var associatedContact: String       /* linkID of vendor the review pertains to */
  public var comments : String
  public var description : String
  public var reviewCategories : typekey.ReviewCategory[]
  public var categoryScores : int []
  public var claimCenterUID : String
  public var reviewType: String
  public var score : int

  private static final var _logger = ABLoggerCategory.AB
  /*
  * For updating old review summary with new review summary information
  * @param reviewInfo The new review summary information
  * @param ccuid The ClaimCenterUID for the review summary
  */

  function toReviewSummary(ccuid : String) : ReviewSummary {
    var rs = findReviewSummaryByClaimCenterUID(ccuid)
    var contact = findABContactByLinkID(this.associatedContact)
    try {
      Transaction.runWithNewBundle(\ bundle -> {
        rs = bundle.add(rs)
        rs.ABContact = contact
        rs.Name = this.name
        rs.RelatedTo = this.relatedTo
        rs.ClaimNumber = this.claimNumber
        rs.ReviewType = this.reviewType
        if (this.score >= 0) {
          rs.Score = this.score
        }
        rs.Tallied = false;
        rs.ReviewedBy = this.reviewedBy
        rs.Subcontact = this.subContact
        rs.ServiceDate = this.serviceDate
        rs.ServiceType = this.serviceType
        rs.Comments = this.comments
        rs.ClaimCenterUID = this.claimCenterUID
        for (i in rs.CategoryScores) {
          for (j in 0..this.reviewCategories.length-1){
            if (i.ReviewCategory == this.reviewCategories[j]){
              i.Score = this.categoryScores[j]
              break
            }
          }
        }
      })
      return rs
    } catch (e : Exception) {
      _logger.error("Error updating ReviewSummary:" +e.toString(), e)
      throw(e)
    }
  }

  /*
  * For creating new review summary with the passed in review summary information
  * @param reviewInfo The new review summary information
  * @param bundle The bundle that review summary information is added to
  */
  function toReviewSummary(bundle : Bundle) : ReviewSummary {

    var contact = findABContactByLinkID(this.associatedContact);
    var rs : ReviewSummary
    try {
      rs = new ReviewSummary(bundle)
      rs.ABContact = contact
      rs.Name = this.name
      rs.RelatedTo = this.relatedTo
      rs.ClaimNumber = this.claimNumber
      rs.ReviewType = this.reviewType
      rs.LinkID = this.linkID
      if (this.score >= 0) {
        rs.Score = this.score
      }
      rs.Tallied = false;
      rs.ReviewedBy = this.reviewedBy
      rs.Subcontact = this.subContact
      rs.ServiceDate = this.serviceDate
      rs.ServiceType = this.serviceType
      rs.Comments = this.comments
      rs.ClaimCenterUID = this.claimCenterUID
      for (var i in 0..this.categoryScores.length-1) {
        var reviewCategory = this.reviewCategories[i]
        var categoryScore = this.categoryScores[i]
        rs.addNewCategoryScore(reviewCategory, categoryScore)
      }
      if (contact.UpdateScore == null || contact.UpdateScore == false) {
        contact.UpdateScore = true
      }
      return rs
    } catch (e : Exception) {
      _logger.error("Error creating new reviewSummary for ABContact "+ contact + ":" +e.toString(), e)
      throw(e)
    }
  }

  /*
  * Convert a review summary into an ABVendorEvaluationAPIReviewSummary
  * @param rs The ReviewSummary that needs to be converted
  */
  function toABVendorEvaluationAPIReviewSummary(rs : ReviewSummary) : ABVendorEvaluationAPIReviewSummary{
    var review = new ABVendorEvaluationAPIReviewSummary() {
        :associatedContact = rs.ABContact.LinkID,
        :claimCenterUID = rs.ClaimCenterUID,
        :claimNumber = rs.ClaimNumber,
        :comments = rs.Comments,
        :description = rs.Description,
        :linkID = rs.LinkID,
        :name = rs.Name,
        :relatedTo = rs.RelatedTo,
        :reviewedBy = rs.ReviewedBy,
        :reviewType = rs.ReviewType,
        :score = rs.Score,
        :serviceDate = rs.ServiceDate,
        :serviceType = rs.ServiceType,
        :subContact = rs.Subcontact
    }

    var categoryScore = new int[rs.CategoryScores.length]
    var category = new ReviewCategory[rs.CategoryScores.length]
    for (i in 0..rs.CategoryScores.length-1){
      categoryScore[i] = rs.CategoryScores[i].Score
      category[i] = rs.CategoryScores[i].ReviewCategory
    }
    review.categoryScores = categoryScore
    review.reviewCategories = category

    return review
  }

  private function findReviewSummaryByClaimCenterUID(ccUID : String) : ReviewSummary {
    var summaries = gw.api.database.Query.make(entity.ReviewSummary).compare("ClaimCenterUID", Equals, ccUID).select();
    if (summaries.getCount() == 0) {
      _logger.info("findReviewSummaryByClaimCenterUID(): no results for '"+ccUID+"', creating a new ReviewSummary.");
      return null;
    }
    if (summaries.getCount() > 1) {
      _logger.info("findReviewSummaryByClaimCenterUID(): WARNING "+summaries.getCount()+" results found, should be either 0 or 1.");
    }
    var rs = summaries.getAtMostOneRow();
    _logger.info("findReviewSummaryByClaimCenterUID(): found summary '"+rs.PublicID+"' for ccuid '"+ccUID+"'.");
    return rs;
  }

  private function findABContactByLinkID(addressBookUID : String) : ABContact {
    var contacts = gw.api.database.Query.make(entity.ABContact).compare("LinkID", Equals, addressBookUID).select();
    if (contacts.getCount() > 1) {
      _logger.info("findABContactByLinkID(): nonunique abUID("+addressBookUID+") - duplicates: "+contacts.getCount());
      throw new IllegalStateException("findABContactByLinkID(): nonunique abUID("+addressBookUID+") - duplicates: "+contacts.getCount());
    }
    if (contacts.getCount() == 0) {
      _logger.info("findABContactByLinkID(): nonexistant abUID("+addressBookUID+")");
      throw new IllegalStateException("findABContactByLinkID(): nonexistant abUID("+addressBookUID+")");
    }
    var contact = contacts.getAtMostOneRow();
    _logger.info("findABContactByLinkID(): found: "+ contact +"("+addressBookUID+")");
    return contact;
  }
}

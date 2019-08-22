package gw.webservice.ab.ab1000.abvendorevaluationapi

uses entity.ABContact
uses gw.api.server.AvailabilityLevel
uses gw.api.system.ABLoggerCategory
uses gw.api.util.TransactionIdUtil
uses gw.pl.persistence.core.Bundle
uses gw.transaction.Transaction
uses gw.xml.ws.annotation.WsiCheckDuplicateExternalTransaction
uses gw.xml.ws.annotation.WsiExposeEnumAsString


@Export
@gw.xml.ws.annotation.WsiWebService( "http://guidewire.com/ab/ws/gw/webservice/ab/ab1000/abvendorevaluationapi/ABVendorEvaluationAPI" )
@gw.xml.ws.annotation.WsiAvailability(AvailabilityLevel.MAINTENANCE)
@gw.xml.ws.annotation.WsiPermissions({SystemPermissionType.TC_CLIENTAPP})
@WsiExposeEnumAsString(typekey.ReviewCategory)
@WsiExposeEnumAsString(typekey.ReviewServiceType)
class ABVendorEvaluationAPI {
  private static final var _logger = ABLoggerCategory.AB
 
  construct() {
  }

  /**
   * Adds a new review summary based on the ABVendorEvaluationAPIReviewSummary object passed in.
   * @param reviewInfo the new review summary, must not have a LinkID set
   * @result the created review summary, complete with LinkID
   *
   * The caller must set the transaction id in the soap request headers.  This can be done using
   * ContactAPIUtil.setTransactionId().
   */
  @Throws(IllegalStateException, "If LinkID requirements are not met")
  @WsiCheckDuplicateExternalTransaction
  function addNewReviewSummary(reviewInfo : ABVendorEvaluationAPIReviewSummary) : ABVendorEvaluationAPIReviewSummary {
    TransactionIdUtil.checkTransactionId()
    if (reviewInfo.linkID != null) {
      _logger.info("ABVendorEvaluationReviewSummary contains LinkID, skipping.")
      throw new IllegalStateException("ABVendorEvaluationReviewSummary contains LinkID");
    }

    var rs = findReviewSummaryByClaimCenterUID(reviewInfo.claimCenterUID);
    if (rs != null) {
      _logger.info("Duplicate ReviewSummary detected, skipping.");
      return reviewInfo.toABVendorEvaluationAPIReviewSummary(rs);
    }

    Transaction.runWithNewBundle(\ bundle -> {
      rs = reviewInfo.toReviewSummary(bundle)
    })

    return reviewInfo.toABVendorEvaluationAPIReviewSummary(rs)
  }

  /**
   * Deletes the review summary with the passed in LinkID
   *
   * The caller must set the transaction id in the soap request headers.  This can be done using
   * ContactAPIUtil.setTransactionId().
   */
  @Throws(IllegalStateException, "If LinkID requirements are not met")
  @WsiCheckDuplicateExternalTransaction
  function deleteReviewSummary(linkID : String) : Boolean {
    TransactionIdUtil.checkTransactionId()
    var rss = gw.api.database.Query.make(entity.ReviewSummary).compare("LinkID", Equals, linkID).select();
    if (rss.getCount() > 1) {
      _logger.info("deleteReviewSummary(): nonunique abUID("+linkID+") - duplicates: "+rss.getCount());
      throw new IllegalStateException("deleteReviewSummary(): nonunique abUID("+linkID+") - duplicates: "+rss.getCount());
    }
    if (rss.getCount() == 0) {
      _logger.info("deleteReviewSummary(): nonexistant abUID("+linkID+")");
      throw new IllegalStateException("deleteReviewSummary(): nonexistant abUID("+linkID+")");
    }
    var summary = rss.getAtMostOneRow();
    var cc = summary.ABContact;
    _logger.info("deleteReviewSummary(): found: "+ ReviewSummary +"("+linkID+")");
    try {
    Transaction.runWithNewBundle( \ bundle : Bundle -> {
      bundle.add( summary );
      if (cc.UpdateScore == null || cc.UpdateScore == false) {
        bundle.add(cc);
        cc.UpdateScore = true;
      }
      summary.remove();
    });
    } catch (e : Exception) {
      _logger.error("Error deleting review "+linkID + " for contact " + cc + ":" +e.toString(), e);
      throw(e);
    }
    return true;
  }

  /**
   * Update the scores for all the reviews for the contact whose LinkID is passed in.
   *
   * The caller must set the transaction id in the soap request headers.  This can be done using
   * ContactAPIUtil.setTransactionId().
   */
  @WsiCheckDuplicateExternalTransaction
  function updateReviewScoresForContact(linkID : String) : int {
    TransactionIdUtil.checkTransactionId()
    var contact = findABContactByLinkID(linkID);

    Transaction.runWithNewBundle(\ bundle -> {
      contact = bundle.add(contact)
      contact.updateScores()
    })
    return contact.Score
  }

  /**
   * Updates the review summary.
   * @param the review summary to be updated, must have a LinkID specified
   * @return the updated review summary
   */
  @Throws(IllegalStateException, "If LinkID requirements are not met")
  function updateReviewSummary(reviewSummaryInfo : ABVendorEvaluationAPIReviewSummary) : ABVendorEvaluationAPIReviewSummary {
    if (reviewSummaryInfo.linkID == null) {
      _logger.info("ABVendorEvaluationReviewSummary did not contain LinkID, skipping.")
      throw new IllegalStateException("ABVendorEvaluationReviewSummary did not contain LinkID");
    }
    var rs : ReviewSummary
    
    rs = reviewSummaryInfo.toReviewSummary(reviewSummaryInfo.claimCenterUID)
    
    return reviewSummaryInfo.toABVendorEvaluationAPIReviewSummary(rs)
  }
  
  private function findReviewSummaryByClaimCenterUID(claimCenterUID : String) : ReviewSummary {
    var summaries = gw.api.database.Query.make(entity.ReviewSummary).compare("ClaimCenterUID", Equals, claimCenterUID).select();
    if (summaries.getCount() == 0) {
      _logger.info("findReviewSummaryByClaimCenterUID(): no results for '"+claimCenterUID+"', creating a new ReviewSummary.");
      return null;
    }  
    if (summaries.getCount() > 1) {
      _logger.info("findReviewSummaryByClaimCenterUID(): WARNING "+summaries.getCount()+" results found, should be either 0 or 1.");     
    }
    var rs = summaries.getAtMostOneRow();
    _logger.info("findReviewSummaryByClaimCenterUID(): found summary '"+rs.PublicID+"' for ccuid '"+claimCenterUID+"'.");
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

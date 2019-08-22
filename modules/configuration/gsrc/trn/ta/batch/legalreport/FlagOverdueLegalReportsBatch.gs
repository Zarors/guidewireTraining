package trn.ta.batch.legalreport

uses gw.api.database.Relop
uses gw.processes.BatchProcessBase
uses gw.processes.TerminatedException
uses gw.transaction.Transaction
uses gw.api.database.Query
uses java.util.concurrent.TimeUnit

class FlagOverdueLegalReportsBatch extends BatchProcessBase {
  construct() {
    super( BatchProcessType.TC_FLAGOVERDUELEGALREPORTS )
  }

  override function requestTermination() : boolean {
    super.requestTermination()  // Call super to set TerminateRequested
    return true   // This process supports termination
  }

  override function checkInitialConditions() : boolean {
    // Add a condition check
    return true
  }

  override function doWork() {
    TimeUnit.SECONDS.sleep(15) // Added to test termination request
    if (TerminateRequested) {
      throw new TerminatedException("Process terminated")
    }
    // Any batch process that modifies data must manually create a bundle.
    Transaction.runWithNewBundle(\bundle -> {
      print("Starting Flag Overdue Legal Reports batch process")
      var numberOfContactsWithOverdueReports = 0
      // Query for legal report messages.
      var messageQuery = Query.make(Message)
      messageQuery.compare(Message#DestinationID, Relop.Equals, 15)
      var resultsObj = messageQuery.select()
      for (currentMessage in resultsObj) {
        if (TerminateRequested) {
          throw new TerminatedException("Process terminated")
        }
        var relatedContact = (currentMessage.MessageRoot as ABContact)
        // Do not flag a contact if it is already flagged for an overdue legal report.
        if (!relatedContact.FlagEntries.hasMatch(\currentEntry ->
            currentEntry.Reason == FlagEntryReason.TC_OVERDUE_LEGAL_REPORT)) {
          // relatedContact was queried for, and therefore is in a read-only bundle.
          // Copy the object into the current, writeable bundle.
          relatedContact = bundle.add(relatedContact)
          var newEntry = new FlagEntry()
          newEntry.FlagDate = gw.api.util.DateUtil.currentDate()
          newEntry.Reason = FlagEntryReason.TC_OVERDUE_LEGAL_REPORT
          relatedContact.addToFlagEntries(newEntry)
          numberOfContactsWithOverdueReports++
        }
      }
      // runWithNewBundle() executes an implicit commit. No manual commit of
      // the bundle is required.
      print("Completed Flag Overdue Legal Reports batch process")
      print("Number of contacts flagged: " + numberOfContactsWithOverdueReports)
    }, "su")
    // identifies the user to use when committing changes, required
    // for batch processes that are scheduled and have no inherent user
    this.incrementOperationsCompleted()
  }
}
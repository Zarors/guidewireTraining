package trainingapp.base
uses gw.api.locale.DisplayKey
uses gw.api.util.DisplayableException
uses gw.api.database.Query
uses gw.transaction.Transaction
uses gw.api.util.LocationUtil
uses trainingapp.demo.gosu.MiscellaneousExamples
class SampleDataUtil {

  static function loadTrainingAppSampleData () : void {
    try {
      // load sample data
      new gw.command.ImportSampleData().import()

      // delete orphan messages in sample data
      SampleDataUtil.deleteOrphanMessages()
      trainingapp.demo.gosu.MiscellaneousExamples.waitForXSeconds(20, false)
      LocationUtil.addRequestScopedInfoMessage(DisplayKey.get("Training.TrainingAppSampleDataLoaded"))
    } catch (e : java.lang.Exception) {
        throw new DisplayableException (DisplayKey.get("Training.TrainingAppSampleDataNOTLoaded"))
    }
  }


/* There are four messages in the sample data related to the email destination.
   Like all messages, these messages should have related parent entities, but
   because they are loaded sample data, they do not. These messages throw
   exceptions when rendered in the Message Table screen or MessageHistory Table
   screen. Because these messages do not look like real data and cannot be viewed
   or acted upon like real data, this method removes these messages from the database.
   Use this method any time you reload the sample data and wish to work with the
   MessageTable or MessageHistory table screen.
*/ 
      public static function deleteOrphanMessages () : void {
        
        var messageQuery = Query.make(Message)
        messageQuery.compare("DestinationID", Equals, 65)
        var resultSet = messageQuery.select()

        var messageToRemove : Message
       
        for (currentMessage in resultSet) {
          Transaction.runWithNewBundle( \ newBundle -> {
            print ("Removing Message " + currentMessage.ID)
            messageToRemove = newBundle.add(currentMessage)
            messageToRemove.remove()
          } )
        }
           
        var messageHistoryQuery = Query.make(MessageHistory)
        messageHistoryQuery.compare("DestinationID", Equals, 65)
        var resultSet2 = messageHistoryQuery.select()

        var messageHistoryToRemove : MessageHistory
       
        for (currentMessageHistory in resultSet2) {
          gw.transaction.Transaction.runWithNewBundle( \ newBundle -> {
            print ("Removing MessageHistory " + currentMessageHistory.ID)
            messageHistoryToRemove = newBundle.add(currentMessageHistory)
            messageHistoryToRemove.remove()
          } )
        }
        
      } // end deleteOrphanMessages

}

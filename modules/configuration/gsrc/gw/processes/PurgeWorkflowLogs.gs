/**
This is batch process that clears out completed workflow logs.  It expects upto
two parameters the days for successful processes, the batch size.

Things to note:
This will throw an exception out of the plugin if the args are not correct
That doWork does not have a bundle so it uses Transaction.runWithBundle to obtain a bundle
It uses the default check initial conditions
*/
package gw.processes

uses gw.api.database.IQueryBeanResult
uses gw.api.database.InOperation
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.api.system.PLConfigParameters
uses gw.api.util.DateUtil

@Export
class PurgeWorkflowLogs extends PurgeProcessBase
{
  construct() {
    this({PLConfigParameters.WorkflowLogPurgeDaysOld.Value})
  }

  construct(daysOld : int, batchSize : int) {
    this({daysOld, batchSize})
  }
  
  private construct(arguments : Object[]) {
    super(TC_PURGEWORKFLOWLOGS, arguments)
  }

  override function getQueryToRetrieveOldEntries( daysOld : int ) : IQueryBeanResult<KeyableBean> {
    return Query.make(WorkflowLogEntry).and(\r -> {
      r.compare("LogDate", Relop.LessThan, DateUtil.currentDate().addDays(- daysOld))
      r.subselect("Workflow", InOperation.CompareIn, Query.make(Workflow), "ID").compare("State", Relop.Equals, WorkflowState.TC_COMPLETED)
    }).select()
  }

}

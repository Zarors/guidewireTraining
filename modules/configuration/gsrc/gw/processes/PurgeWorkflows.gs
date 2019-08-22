/**
This is batch process that clears out completed workflow logs.  It expects upto
two parameters the days for successful processes, the batch size.

Things to note:
This will throw an exception out of the plugin if the args are not correct
That doWork does not have a bundle so it uses Transaction.runWithBundle to obtain a bundle
It uses the default check initial conditions
*/
package gw.processes

uses gw.processes.BatchProcessBase
uses java.lang.Integer
uses gw.api.system.PLConfigParameters
uses gw.api.admin.WorkflowUtil
uses gw.api.upgrade.Coercions

@Export
class PurgeWorkflows extends BatchProcessBase
{
  var _succDays = PLConfigParameters.WorkflowPurgeDaysOld.Value

  construct() {
    this(null)
  }
  
  construct(arguments : Object[]) {
    super(TC_PURGEWORKFLOWS)
    if (arguments != null) {
      _succDays = arguments[1] != null ? (Coercions.makeIntFrom(arguments[1])) : _succDays
    }
  }

  override property get Description() : String {
    return "purge(daysOld=${_succDays})"
  }

  override function doWork() : void {
    WorkflowUtil.deleteOldWorkflowsFromDatabase( _succDays )
  }
}

package gw.processes

uses com.guidewire.pl.system.database.query.DeleteBuilder
uses gw.api.database.Relop
uses gw.api.system.PLConfigParameters
uses gw.api.system.server.ServerUtil
uses gw.api.upgrade.Coercions

@Export
class WorkItemSetPurge extends BatchProcessBase {
  private var _daysOld : int

  construct() {
    this({ PLConfigParameters.BatchProcessHistoryPurgeDaysOld.Value })
  }

  construct(daysOld : int) {
    this({ daysOld })
  }

  private construct(arguments : Object[]) {
    super(TC_WORKITEMSETPURGE)

    if (arguments != null) {
      if ((arguments.length > 0) && (arguments[0] != null)) {
        _daysOld = Coercions.makeIntFrom(arguments[0])
      }
    }
  }

  override property get Description() : String {
    return "purge(daysOld=${_daysOld})"
  }

  override final function doWork() : void {
    OperationsCompleted = 0
    var date = ServerUtil.systemDateTime().addBusinessDays(-_daysOld)
    OperationsCompleted += deleteWorkItemSets(date)
  }

  function deleteWorkItemSets(date: Date): int {
    var db = new DeleteBuilder(WorkItemSet.Type)
    db.Query.compare(WorkItemSet.ENDTIME_PROP.get(), Relop.LessThan, date)
    return db.execute()
  }
}

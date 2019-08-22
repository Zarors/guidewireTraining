package gw.processes

uses com.guidewire.pl.system.database.query.DeleteBuilder
uses gw.api.database.Relop
uses gw.api.system.PLConfigParameters
uses gw.api.system.server.ServerUtil
uses gw.api.upgrade.Coercions

@Export
class WorkQueueInstrumentationPurge extends BatchProcessBase {
  private var _daysOld : int
  private var _batchSize = 1024

  construct() {
    this({ PLConfigParameters.InstrumentedWorkerInfoPurgeDaysOld.Value })
  }

  construct(daysOld : int) {
    this({ daysOld })
  }

  private construct(arguments : Object[]) {
    super(TC_WORKQUEUEINSTRUMENTATIONPURGE)

    if (arguments != null) {
      if ((arguments.length > 0) && (arguments[0] != null)) {
        _daysOld = Coercions.makeIntFrom(arguments[0])
      }
    }
  }

  override property get Description() : String {
    return "purge(daysOld=${_daysOld}, batchSize=${_batchSize})"
  }

  override final function doWork() : void {
    OperationsCompleted = 0
    var date = ServerUtil.systemDateTime().addBusinessDays(-_daysOld)
    OperationsCompleted += deleteExecutors(date)
    OperationsCompleted += deleteTasks(date)
  }

  function deleteExecutors(date: Date): int {
    var db = new DeleteBuilder(InstrumentedWorkExecutor.Type)
    db.Query.compare(InstrumentedWorkExecutor.ENDTIME_PROP.get(), Relop.LessThan, date)
    return db.execute()
  }

  function deleteTasks(date: Date): int {
    var db = new DeleteBuilder(InstrumentedWorkerTask.Type)
    db.Query.compare(InstrumentedWorkerTask.ENDTIME_PROP.get(), Relop.LessThan, date)
    return db.execute()
  }
}

package gw.processes

uses gw.api.database.IQueryBeanResult
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.api.system.PLConfigParameters
uses gw.api.system.server.ServerUtil

@Export
class ProcessHistoryPurge extends PurgeProcessBase {

  construct() {
    this({PLConfigParameters.BatchProcessHistoryPurgeDaysOld.Value})
  }

  construct(daysOld : int, batchSize : int) {
    this({daysOld, batchSize})
  }
  
  private construct(arguments : Object[]) {
    super(TC_PROCESSHISTORYPURGE, arguments)
  }

  override function getQueryToRetrieveOldEntries( daysOld : int ) : IQueryBeanResult<KeyableBean> {
    return Query.make(entity.ProcessHistory).compare(ProcessHistory.COMPLETEDATE_PROP.get(), Relop.LessThan, ServerUtil.systemDateTime().addDays(-daysOld)).select()
  }
}

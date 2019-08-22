package gw.processes

uses gw.api.database.IQueryBeanResult
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.api.system.PLConfigParameters
uses gw.api.system.server.ServerUtil

uses java.math.BigDecimal

@Export
class PurgeClusterMembers extends PurgeProcessBase {
  construct() {
    this({PLConfigParameters.ClusterMemberPurgeDaysOld.Value})
  }

  construct(daysOld : String, batchSize : String) {
    this({daysOld, batchSize})
  }
  
  private construct(arguments : Object[]) {
    super(TC_PURGECLUSTERMEMBERS, arguments)
  }

  override function getQueryToRetrieveOldEntries( daysOld : int ) : IQueryBeanResult<KeyableBean> {
    if (daysOld <= 0) {
      throw new IllegalArgumentException("'daysOld' argument must be positive.")
    }
    return Query.make(ClusterMemberData).compare(ClusterMemberData.LASTUPDATE_PROP.get(), Relop.LessThan,
        BigDecimal.valueOf(ServerUtil.systemDateTime().addDays(- daysOld).Time)).select()
  }
}

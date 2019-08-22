/**
   This is the base batch process to clear out "old" data. It expects two optional parameters: 
   the number of days before data is considered old and the batch size. 

   Things to note:
   This will throw an exception out of the plugin if the args are not correct
   That doWork does not have a bundle so it uses Transaction.runWithBundle to obtain a bundle
   It uses the default check initial conditions
 */
package gw.processes

uses gw.api.database.IQueryBeanResult
uses gw.api.upgrade.Coercions
uses gw.transaction.Transaction

@Export
abstract class PurgeProcessBase extends BatchProcessBase
{
  private var _daysOld : int
  private var _batchSize = 1024

  construct(batchProcessType : BatchProcessType, daysOld : int, batchSize : int) {
    this(batchProcessType, {daysOld, batchSize})
  }
  
  construct(batchProcessType : BatchProcessType, arguments : Object[]) {
    super(batchProcessType)
    if (arguments != null) {
      if ((arguments.length > 0) && (arguments[0] != null)) {
        _daysOld = Coercions.makeIntFrom(arguments[0])
      }
      if ((arguments.length > 1) && (arguments[1] != null)) {
        _batchSize = Coercions.makeIntFrom(arguments[1])
      }
    }
  }

  override final function doWork() : void { 
    var query = getQueryToRetrieveOldEntries(_daysOld)
    setChunkingById(query, _batchSize)
    OperationsExpected = query.getCount()
    var itr = query.iterator() 
    while (itr.hasNext() and not TerminateRequested) {
      Transaction.runWithNewBundle( \ b -> {
        var cnt = 0
        while (itr.hasNext() and cnt < _batchSize and not TerminateRequested) {
          cnt = cnt + 1
          incrementOperationsCompleted()
          b.delete( itr.next() )
      }
      }, "su")
    }
  }

  override property get Description() : String {
    return "purge(daysOld=${_daysOld}, batchSize=${_batchSize})"
  }

  protected abstract function getQueryToRetrieveOldEntries(daysOld : int) : IQueryBeanResult<KeyableBean>
}

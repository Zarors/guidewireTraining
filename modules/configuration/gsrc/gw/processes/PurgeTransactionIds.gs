/**
This is batch process that clears out irrelevant transaction ids.  It can be run with an
optional parameter to override the age.
*/
package gw.processes

uses java.lang.Integer
uses gw.api.system.PLConfigParameters
uses com.guidewire.pl.domain.transaction.impl.TransactionIdImpl
uses gw.api.upgrade.Coercions

@Export
class PurgeTransactionIds extends BatchProcessBase
{
  var _succDays = PLConfigParameters.TransactionIdPurgeDaysOld.Value

  construct() {
    this(null)
  }
  
  construct(arguments : Object[]) {
    super(TC_PURGETRANSACTIONIDS)
    if (arguments != null) {
      _succDays = arguments[1] != null ? (Coercions.makeIntFrom(arguments[1])) : _succDays
    }
  }

  override property get Description() : String {
    return "purge(daysOld=${_succDays})"
  }

  override function doWork() : void {
    TransactionIdImpl.deleteOld( Coercions.makeDateFrom(_succDays) )
  }
}

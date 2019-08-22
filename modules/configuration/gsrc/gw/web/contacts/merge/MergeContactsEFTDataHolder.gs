package gw.web.contacts.merge
uses java.util.Collection

@Export
@Deprecated("Since 8.0.0.  Please use the gw.web.merge package.")
class MergeContactsEFTDataHolder {

  var _keptContactEFTData : DataSelection[] as KeptContactData
  var _retiredContactEFTData : DataSelection[] as RetiredContactData
  
  construct(contact : ABContact, retiredContact : ABContact) {
    var keptData : Collection<DataSelection> = {}
    var retiredData : Collection<DataSelection> = {}
    contact.EFTRecords.each(\ eft -> {
      keptData.add(new DataSelection(eft, true, eft.IsPrimary))
    })
    retiredContact.EFTRecords.each(\ eft -> {
      retiredData.add(new DataSelection(eft, false, false))
    })
    _keptContactEFTData = keptData.toArray(new DataSelection[keptData.Count])
    _retiredContactEFTData = retiredData.toArray(new DataSelection[retiredData.Count])
  }

  function hasMoreThanOnePrimary() : boolean {
    var count = _keptContactEFTData.countWhere(isPrimaryBlock()) + _retiredContactEFTData.countWhere(isPrimaryBlock())
    return count > 1
  }
  
  private function isPrimaryBlock() : block(data : DataSelection) : boolean {
    return \ d -> d.Included and d.Data.IsPrimary
  }
  
  public class DataSelection {
    var _primary : boolean as Primary
    var _included : boolean as Included
    var _eftData : EFTData as Data
    
    construct(eftData : EFTData, isIncluded : boolean, isPrimary : boolean) {
      _eftData = eftData
      _included = isIncluded
      _primary = isPrimary
    }
    
    function isInvalid() : boolean {
      return outer.hasMoreThanOnePrimary()
    }
  }
}

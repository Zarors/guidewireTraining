package gw.plugin.contact.pendingchange
uses gw.api.bean.compare.ui.EntityDiffDisplay
uses gw.api.bean.compare.EntityDiff
uses gw.api.bean.compare.ui.DiffDisplay
uses gw.api.bean.compare.ui.PropertyDiffDisplay
uses gw.api.contact.pendingchanges.DiffDisplays


/**
 * This class provides a hook for common, customizable behavior for EntityDiffDisplays. The recommended pattern is to use this class
 * as a base for all custom EntityDiffDisplay types so that they can all pick up any common behavior defined in this class.
 */
@Export
class KeyableBeanDiffDisplay<T extends KeyableBean> extends EntityDiffDisplay<T> {

  construct(theDiff : EntityDiff<T>, theType : DiffDisplay.Type) {
    super(theDiff, theType)
  }

  override function isChildVisible (child : DiffDisplay) : boolean {
    if (not DiffDisplays.hasDeepChanges(child))
        return false
    if (child typeis PropertyDiffDisplay and (this.Type==ADDED or this.Type==REMOVED))
        return false
    // hide properties that we are not likely to care about
    if (child typeis PropertyDiffDisplay and 
        (child.Diff.PropertyInfo.Name.equalsIgnoreCase("AddressBookUID") or
         child.Diff.PropertyInfo.Name.equalsIgnoreCase("PolicySystemID")))
        return false
    if (child typeis KeyableBeanDiffDisplay and child.Diff.EntityType.equals(ABContactTag)) {
        return false
    }
    return super.isChildVisible(child)
  }
  
  override function toString() : String {
    return  this.Class.Name + '<'+super.Diff.EntityType.DisplayName+'>'
  }
}

package gw.plugin.contact.pendingchange

uses gw.api.bean.compare.EntityDiff
uses gw.api.bean.compare.ui.DiffDisplay
uses gw.api.locale.DisplayKey

@Export
class ABContactAddressDiffDisplay extends KeyableBeanDiffDisplay<ABContactAddress> {

  private final var _diff : EntityDiff<ABContactAddress>

  construct(theDiff : EntityDiff<ABContactAddress>, theType : DiffDisplay.Type) {
    super(theDiff, theType)
    _diff = theDiff
  }

  override property get Label() : String {
    return DisplayKey.get("Web.Contacts.PendingChanges.DiffDisplay.ABContactAddress.Name")
  }

  override property get OldValue() : String {
    var value = _diff.SourceValue.Address
    return value == null ? "" : value.DisplayName
  }

  override property get NewValue() : String {
    var value = _diff.CompareValue.Address
    return value == null ? "" : value.DisplayName
  }

  override function isChildVisible (child : DiffDisplay) : boolean {
    // don't display the child Address FK in the diff display
    return false
  }

}
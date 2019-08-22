package gw.plugin.contact.pendingchange

uses gw.plugin.contact.PendingContactChangeConfigurationPlugin
uses java.util.Set
uses gw.lang.reflect.IPropertyInfo
uses gw.api.graph.Tree
uses gw.entity.IEntityType
uses java.util.Map
uses java.lang.Class
uses gw.api.bean.compare.ui.DiffDisplay
uses gw.api.bean.compare.EntityMatcher
uses gw.api.contact.pendingchanges.LinkIDMatcher

/**
 * Basic implementation of the PendingContactChangeConfigurationPlugin.
 * Configuration for the graph traversal behavior of the pending changes web UI.
 */
@Export
class PendingContactChangeConfigurationPluginImpl implements PendingContactChangeConfigurationPlugin {

  construct() {
  }

  override property get DiffDisplayTypes() : Map<IEntityType, Class<DiffDisplay>> {
    return {
        KeyableBean ->KeyableBeanDiffDisplay,
        ABContact->KeyableBeanDiffDisplay,
        ABContactContact->ABContactContactDiffDisplay,
        ABContactAddress->ABContactAddressDiffDisplay
    }
  }

  override property get DisplayTree() : Tree<IEntityType> {
    var tree = new Tree<IEntityType>(ABContact.Type)
    var contactRoot = tree.Root

    tree.addOneToOne(ABContact#PrimaryAddress)
    tree.addOneToMany(ABContact#ContactAddresses)
//    tree.addOneToOne(ABContactAddress#Address)
    tree.addOneToMany(ABContact, "TargetRelatedContacts", ABContactContact)
    tree.addOneToOne(ABContactContact, "RelatedContact", ABContact)

    return tree

  }

  override property get EntityPropertiesToIgnoreForComparison() : Set<IPropertyInfo> {
    return {

    }
  }

  override property get MatcherTypes() : Map<IEntityType, Class<EntityMatcher<KeyableBean>>> {
    return {
        KeyableBean -> LinkIDMatcher,
        Address -> LinkIDMatcher,
        ABContact -> LinkIDMatcher,
        ABContactContact -> LinkIDMatcher,
        EFTData -> LinkIDMatcher
    }
  }
}

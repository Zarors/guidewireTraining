package gw.plugin.upgrade

uses java.util.List


/**
 *  This plugin is used to upgrade customer tables that have been made ABLinkable.  It will add the
 *  and populate the LinkID column.  To use this plugin, do the following:
 *    1. Set IDatamodelUpgrade.gwp to use this class.
 *    2. Make sure IDatamodelUpgrade.gwp enabled.
 *    3. Implement CustomerMinorVersion below to the  the version value in extensions.properties
 *    4. Implement TableNames below to the table(s) to be upgraded.
 */
@Export
class AddLinkIDDatamodelUpgradePlugin extends AddLinkIDDatamodelUpgradePluginBase {

  /**
   *  This should match the value in extension.properties
   */
  override property get CustomerMinorVersion() : int {
    throw "implement me"

    // for example:
    // return 45
  }


  /**
   *  List of table names that need to be updated.
   */
  override property get TableNames() : List<String> {
    throw "implement me"

    // for example:
    // return { "abx_CustomerTable1", "abx_CustomerTable2" }
  }


}

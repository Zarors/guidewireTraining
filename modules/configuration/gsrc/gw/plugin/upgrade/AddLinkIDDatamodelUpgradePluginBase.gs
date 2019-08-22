package gw.plugin.upgrade

uses gw.api.database.Relop
uses gw.api.database.upgrade.DatamodelChangeWithoutArchivedDocumentChange
uses gw.api.database.upgrade.after.AfterUpgradeVersionTrigger
uses gw.api.database.upgrade.before.BeforeUpgradeVersionTrigger
uses gw.api.datamodel.upgrade.CustomerDatamodelUpgrade
uses gw.api.datamodel.upgrade.IDatamodelChange
uses gw.api.system.ABLoggerCategory
uses java.util.ArrayList
uses java.util.Collections
uses java.util.List


/**
 *  This is the abstract base class for the plugin is used to upgrade customer tables that have
 *  been made ABLinkable.  See AddLinkIDDatamodelUpgradePlugin.
 */
@Export
abstract class AddLinkIDDatamodelUpgradePluginBase extends CustomerDatamodelUpgrade implements IDatamodelUpgrade {
  private static var _logger = ABLoggerCategory.SERVER_DATABASE_UPGRADE

  /**
   *  This should match the value in extension.properties
   */
  abstract property get CustomerMinorVersion() : int


  /**
   *  List of table names that need to be updated.
   */
  abstract property get TableNames() : List<String>


  construct() {}

  override property get AfterUpgradeDatamodelChanges() : List<IDatamodelChange<AfterUpgradeVersionTrigger>> {
    return Collections.emptyList()
  }

  override property get BeforeUpgradeDatamodelChanges() : List<IDatamodelChange<BeforeUpgradeVersionTrigger>> {
    var triggerList = new ArrayList<IDatamodelChange<BeforeUpgradeVersionTrigger>>()

    triggerList.add(DatamodelChangeWithoutArchivedDocumentChange.make(
        new AddLinkIDIfNecessaryTrigger(this.CustomerMinorVersion, this.TableNames)))
    return triggerList
  }

  public static class AddLinkIDIfNecessaryTrigger extends BeforeUpgradeVersionTrigger {
    private static final var RESERVED = "GW_RESERVED"
    private var _tableNames : List<String>

    construct(customerMinorVersion : int, tableNames : List<String>) {
      super(customerMinorVersion)
      _tableNames = tableNames
    }

    override property get Description() : String {
      return "Adds LinkID column to tables that have been changed to ABLinkable without a db upgrade"
    }

    override function execute() {
      for(tableName in _tableNames) {
        final var table = getTable(tableName);
        if (table.exists()) {
          var linkIdColumn = table.getColumn("LinkID")
          var publicIdColumn = table.getColumn("PublicID")
          var queryColumnValue = linkIdColumn.exists() ? RESERVED : null

          if(!linkIdColumn.exists()) {
            _logger.info("Added LinkID column to ${tableName}")
            linkIdColumn.create()
          }

          var update = table.update();
          update.set(linkIdColumn, update.getColumnRef(publicIdColumn));
          update.getRestriction().compare(linkIdColumn, Relop.Equals, queryColumnValue);
          var numRows = update.execute();
          _logger.info("Upgraded ${numRows} for table ${tableName}")
        }

        else {
          _logger.warn("Table doesn't exist: ${tableName}")
        }
      }
    }

    override function hasVersionCheck() : boolean {
      return false
    }
  }
}

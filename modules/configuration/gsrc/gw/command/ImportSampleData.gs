package gw.command

uses gw.api.locale.DisplayKey
uses gw.api.util.DataImportTestUtil
uses gw.api.util.SampleDataGenerator
uses gw.api.data.BatchDuplicateDataSetHelper

@Export
@DefaultMethod("import")
class ImportSampleData extends BaseCommand {
  function import() : String {
    SampleDataGenerator.generateDefaultSampleData()
    DataImportTestUtil.importZoneData()
    return DisplayKey.get("Web.ABSampleData.Imported")
  }

  function importDuplicateContacts() : String {
    //Put call to Duplicate Contact Generator Here
    BatchDuplicateDataSetHelper.insertDuplicateContacts()
    return DisplayKey.get("Web.ABDuplicateContactSampleData.Imported")
  }
}

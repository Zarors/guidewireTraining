package gw.command

uses gw.api.data.CCIntegrationTestDataLoader

// TODO(kmd) fix location of this. Should all sample data be in ab-test?
@Export
@DefaultMethod("withDefault")
class ImportCCIntegrationTestData extends BaseCommand {

  construct() {
    super()
  }

  function withDefault() : String {
    CCIntegrationTestDataLoader.createSampleData(null)
    return "CC Integration Test Data Imported"
  }

}

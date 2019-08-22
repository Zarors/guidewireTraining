package gw.suites

uses gw.api.test.ABServerTestClassBase
uses gw.api.test.SuiteBuilder
uses junit.framework.Test

@Export
class ABExampleServerSuite {

  public static final var NAME : String = "ABExampleServerSuite"

  public static function suite() : Test {
    return new SuiteBuilder(ABServerTestClassBase)
        .withSuiteName(NAME)
        .build()
  }

}

package gw.servertest.enhancements

uses com.guidewire.testharness.assertion.AssertionHelperFactory
uses gw.api.test.ABServerTestClassBase
uses gw.testharness.v3.PLAssertions
uses org.fest.assertions.*

@Export
enhancement ABServerTestClassBaseBaseEnhancement : ABServerTestClassBase {

  protected function assertThat(actual: Object): ObjectAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual: String): StringAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual: Object[]): ObjectArrayAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual: Collection<Object>): CollectionAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual: Boolean): BooleanAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual: int): IntAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual: long): LongAssert {
    return PLAssertions.assertThat(actual)
  }

}
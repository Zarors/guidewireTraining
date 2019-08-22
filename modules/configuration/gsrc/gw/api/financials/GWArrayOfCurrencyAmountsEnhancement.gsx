package gw.api.financials

uses com.google.common.collect.ImmutableList

enhancement GWArrayOfCurrencyAmountsEnhancement : CurrencyAmount[]
{

  /**
   * Returns a CurrencyAmount whose amount corresponds to the sum of
   * all CurrencyAmounts contained in this list. Returns null if the list is empty. The currency of the sum amount is
   * inferred from the array, i.e. the array is assumed to hold amounts in a single (common) currency. Hence, attempting
   * to call this method on an array of CurrencyAmounts having mixed currencies would result in an exception.
   *
   * @throws IllegalStateException if all the CurrencyAmounts do not conform to the same Currency
   */
  function sum() : CurrencyAmount {
    return ImmutableList.copyOf(this).sum()
  }
}

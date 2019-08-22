package gw.api.financials

uses java.lang.Iterable
uses java.math.RoundingMode
uses java.math.BigDecimal
uses com.google.common.base.Preconditions
uses java.lang.IllegalStateException

enhancement GWIterableOfCurrencyAmountEnhancement : Iterable<CurrencyAmount> {

  /**
   * Returns a CurrencyAmount whose amount corresponds to the sum of
   * all CurrencyAmounts contained in this list. Returns null if the list is empty. The currency of the sum amount is
   * inferred from the list, i.e. the list is assumed to hold amounts in a single (common) currency. Hence, attempting
   * to call this method on a list of CurrencyAmounts having mixed currencies would result in an exception.
   *
   * @throws IllegalStateException if all the CurrencyAmounts do not conform to the same Currency
   */
  function sum() : CurrencyAmount {
    var sum : CurrencyAmount = null

    this.each( \ currencyAmount -> {
      if(sum == null) {
        sum = new CurrencyAmount(BigDecimal.ZERO, currencyAmount.Currency)
      } else if(sum.Currency != currencyAmount.Currency) {
        // Not using a displaykey, since this is not expected to be triggered by any runtime operations that a customer performs
        throw new IllegalStateException("Cannot sum Currency Amounts in mixed currencies, without first specifying a target currency.")
      }

      sum = sum.add(currencyAmount)
    })

    return sum
  }

  /**
   * Returns a CurrencyAmount in the specified currency and rounding mode, and whose amount corresponds to the sum of
   * all CurrencyAmounts contained in this list (or to zero if the list is empty). The specified rounding mode is
   * also used while converting any CurrencyAmounts present in the list that are not in the specified currency.
   */
  function sum(toCurrency : Currency, roundingMode : RoundingMode) : CurrencyAmount {
    Preconditions.checkNotNull(toCurrency);
    Preconditions.checkNotNull(roundingMode);

    var sum = new CurrencyAmount(BigDecimal.ZERO, toCurrency)

    this.each( \ currencyAmount -> {
      sum = sum.add(currencyAmount.convert(toCurrency, roundingMode))
    })

    return sum.setScaleToCurrency(roundingMode)
  }

}

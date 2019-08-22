package gw.currency

uses java.lang.IllegalArgumentException
uses gw.api.util.CurrencyUtil
uses gw.pl.currency.MonetaryAmount

/**
 *  Copyright 2012 Guidewire Software, Inc.
 */
@Export
enhancement GWIterableOfMonetaryAmountEnhancement : java.lang.Iterable<MonetaryAmount> {

  /**
   * Return the average of the MonetaryAmount elements,
   *   which must all be of the default currency.
   *
   * Delete this method if you are running Multi-Currency mode!
   */
  function average() : MonetaryAmount {
    return this.average( \ amt -> amt )
  }

  /**
   * Sums up the MonetaryAmount elements,
   *   which must all be of the default currency.
   *
   * Delete this method if you are running Multi-Currency mode!
   */
  function sum() : MonetaryAmount {
    return this.sum(CurrencyUtil.getDefaultCurrency())
  }

}
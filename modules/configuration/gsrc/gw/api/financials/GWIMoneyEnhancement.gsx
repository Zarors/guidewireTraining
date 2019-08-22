package gw.api.financials

enhancement GWIMoneyEnhancement : gw.api.financials.IMoney {
  
  /**
   * Converts this IMoney into a CurrencyAmount. Returns null
   * if this IMoney's Amount is null. Otherwise, returns a
   * CurrencyAmount whose amount and currency are equal to
   * this IMoney's.
   */
  function toCurrencyAmount() : CurrencyAmount {
    return CurrencyAmount.valueOf(this)
  }
}

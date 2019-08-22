package gw.api.financials
uses gw.api.util.CurrencyUtil
uses java.math.RoundingMode
uses com.google.common.base.Preconditions

enhancement GWCurrencyAmountEnhancement : gw.api.financials.CurrencyAmount {

  /**
   * Returns a CurrencyAmount with the same amount as this one, but with scale set to the appropriate value for the
   * currency. No rounding is allowed.
   */
  public function setScaleToCurrency() : CurrencyAmount {
    // implicitly uses RoundingMode.UNNECESSARY
    return new CurrencyAmount( this.Amount.setScale( CurrencyUtil.getStorageScale(this.Currency) ), this.Currency)
  }
  
  /**
   * Returns a CurrencyAmount with the same amount as this one, but with scale set to the appropriate value for the
   * currency. The amount is rounded according to the given rounding mode.
   */
  public function setScaleToCurrency( roundingMode : RoundingMode) : CurrencyAmount {
    Preconditions.checkNotNull(roundingMode);
    return new CurrencyAmount( this.Amount.setScale( CurrencyUtil.getStorageScale(this.Currency), roundingMode ), this.Currency)
  }
}

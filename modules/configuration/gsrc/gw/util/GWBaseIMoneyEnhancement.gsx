package gw.util

uses gw.api.util.LocaleUtil

enhancement GWBaseIMoneyEnhancement : gw.api.financials.IMoney {

  /**
   * Converts the IMoney to a localized string.
   **/
  property get DisplayValue() : String {
    return this != null ? LocaleUtil.CurrentLocale.getCurrencyFormat(this.Currency.Code).render(this.Amount, false) : null
  }
}
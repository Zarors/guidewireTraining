package gw.currency.fxrate.impl

uses gw.api.util.FXRateUtil
uses gw.currency.fxrate.FXRate
uses gw.currency.fxrate.FXRateContext
uses java.math.BigDecimal
uses java.util.Date

/**
 * Bare bones implementation of <code>FXRate</code>
 */
@Export
class FXRateImpl implements FXRate {

  var _rate : BigDecimal
  var _marketTime : Date
  var _retrievedAt : Date
  var _context : FXRateContext

  construct(fxRateContextArg : FXRateContext, rateArg : BigDecimal, marketTimeArg : Date, retrievedAtArg : Date) {
    _rate = rateArg
    _marketTime = marketTimeArg
    _retrievedAt = retrievedAtArg
    _context = FXRateUtil.makeContextBuilder(fxRateContextArg.getFromCurrency(), fxRateContextArg.getToCurrency())
      .withMarket(fxRateContextArg.getMarket())
      .withMarketTime(fxRateContextArg.getMarketTime())
      .buildContext()
  }

  override property get FromCurrency() : Currency {
    return _context.FromCurrency
  }

  override property get Market() : FXRateMarket {
    return _context.Market
  }

  override property get MarketTime() : Date {
    return _marketTime // not the MarketTime of the FXRateContext
  }

  override property get ToCurrency() : Currency {
    return _context.ToCurrency
  }

  override property get Rate() : BigDecimal {
    return _rate
  }

  override property get RetrievedAt() : Date {
    return _retrievedAt
  }
}
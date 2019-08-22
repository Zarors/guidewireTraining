package gw.currency.fxrate.impl 

uses gw.api.locale.DisplayKey
uses gw.api.util.DateUtil
uses gw.api.util.FXRateUtil
uses gw.currency.fxrate.FXRate
uses gw.currency.fxrate.FXRateContext
uses gw.currency.fxrate.FXRateService
uses gw.util.Pair
uses java.lang.IllegalStateException
uses java.math.BigDecimal
uses java.util.Date
uses java.util.Map
uses java.util.Set

/**
 * The bare bones implementation of the Guidewire Exchange Rate Service (GERS)
 */
@Export
class FXRateServiceImpl implements FXRateService {
  
  static final var _defaultMarket = FXRateMarket.TC_STATIC_TABLE // TODO:  getDefaultMarket() should come from http://wiki/index.php/Exchange_Rates_Refactoring_Phase_1#Define_App-Specific_Look-Up_Layer

  construct() {}
  
  override function getFXRate(requestContext : FXRateContext) : FXRate {
    var market = requestContext.Market ?: _defaultMarket
    var marketTime = requestContext.MarketTime ?: Date.CurrentDate

    if (market != FXRateMarket.TC_STATIC_TABLE) {
      throw new IllegalStateException("Market " + requestContext.Market.getDisplayName()  + " is not yet implemented.")
    }

    /**
     * Get the rate here
     */    
    final var rate = getRateFromStaticTable(requestContext.FromCurrency, requestContext.ToCurrency)

    if (rate == null) {
      throw new IllegalStateException(DisplayKey.get("Java.FXRate.FXRateService.RateNotFound", requestContext.getFromCurrency(), requestContext.getToCurrency(), requestContext.getMarket().getDisplayName()))
    }
    
    /**
     * Make a defensive copy of the FXRateContext for use in the FXRateImpl constructor below
     * The values for FXRateMarket and MarketTime may differ from the FXRateContext that was passed in
     */
    final var obtainedContext = FXRateUtil.makeContextBuilder(requestContext.FromCurrency, requestContext.ToCurrency)
      .withMarket(market)
      .withMarketTime(marketTime)
      .buildContext()

    return new FXRateImpl(obtainedContext, rate, getMarketTime(), getRetrievalDate())
  }

  override function findAvailableConversions(market : FXRateMarket, currency : Currency): Set<Pair<Currency, Currency>> {
    return findAvailableConversions(market).where( \ pair -> pair.First == currency or pair.Second == currency).toSet()
  }

  override function canConvert(fromCurrency : Currency, toCurrency : Currency) : boolean {
    var conversion = Pair.make(fromCurrency, toCurrency)
    return allConfiguredMarkets().hasMatch( \ market -> findAvailableConversions(market).contains(conversion))
  }

  override function findAvailableMarkets(fromCurrency : Currency, toCurrency : Currency):Set<FXRateMarket> {
    var conversion = Pair.make(fromCurrency, toCurrency)
    return allConfiguredMarkets().where( \ market -> findAvailableConversions(market).contains(conversion)).toSet()
  }

  override function allConfiguredCurrencies():Set<Currency> {
    return findConfiguredCurrencies(_defaultMarket)
  }

  override function findConfiguredCurrencies(market : FXRateMarket):Set<Currency> {
    var currencies : Set<Currency> = {}
    findAvailableConversions(market).each( \ pair -> { currencies.add(pair.First)
                                                       currencies.add(pair.Second) })
    return currencies
  }

  override function allConfiguredMarkets():Set<FXRateMarket> {
    return {_defaultMarket}
  }

  override function findEarliestAvailableRateDate(market : FXRateMarket):Date {
    return getMarketTime()
  }

  override function findLatestAvailableRateDate(market : FXRateMarket):Date {
    return getMarketTime()
  }

  override function getMarketDescription(market : FXRateMarket):String {
    return market.DisplayName
  }

  override function getMarketName(market : FXRateMarket):String {
    return market.Description
  }

  override function findMarketTime(fromCurrency : Currency, toCurrency : Currency, market : FXRateMarket, date : Date):Date {
    return getMarketTime()
  }

  override function findNextMarketUpdateTime(fromCurrency : Currency, toCurrency : Currency, market : FXRateMarket, date : Date):Date {
    return DateUtil.trimToMidnight(DateUtil.currentDate())
  }

  /**
   * Map of one-way foreign exchange rates keyed by the pair of FromCurrency and ToCurrency
   */
  static final var STATIC_TABLE : Map<Pair<Currency, Currency>, BigDecimal> =
  
  {
    // From EUR
    new Pair<Currency, Currency>(TC_EUR, TC_USD) -> 1.2475bd,
    new Pair<Currency, Currency>(TC_EUR, TC_GBP) -> 0.7996bd,
    new Pair<Currency, Currency>(TC_EUR, TC_RUB) -> 41.22bd,
    new Pair<Currency, Currency>(TC_EUR, TC_AUD) -> 1.2432bd,
    new Pair<Currency, Currency>(TC_EUR, TC_CAD) -> 1.2824bd,
    new Pair<Currency, Currency>(TC_EUR, TC_JPY) -> 98.97bd,

    // From USD
    new Pair<Currency, Currency>(TC_USD, TC_GBP) -> 0.640961924bd,
    new Pair<Currency, Currency>(TC_USD, TC_RUB) -> 33.04208417bd,
    new Pair<Currency, Currency>(TC_USD, TC_AUD) -> 0.996553106bd,
    new Pair<Currency, Currency>(TC_USD, TC_CAD) -> 1.027975952bd,
    new Pair<Currency, Currency>(TC_USD, TC_JPY) -> 79.33466934bd,
    new Pair<Currency, Currency>(TC_USD, TC_EUR) -> 0.801603206bd,

    // To EUR
    new Pair<Currency, Currency>(TC_GBP, TC_EUR) -> 1.250625313bd,
    new Pair<Currency, Currency>(TC_RUB, TC_EUR) -> 0.024260068bd,
    new Pair<Currency, Currency>(TC_AUD, TC_EUR) -> 0.804375804bd,
    new Pair<Currency, Currency>(TC_CAD, TC_EUR) -> 0.779787898bd,
    new Pair<Currency, Currency>(TC_JPY, TC_EUR) -> 0.010104072bd,

    // To USD
    new Pair<Currency, Currency>(TC_GBP, TC_USD) -> 1.560155078bd,
    new Pair<Currency, Currency>(TC_RUB, TC_USD) -> 0.030264435bd,
    new Pair<Currency, Currency>(TC_AUD, TC_USD) -> 1.003458816bd,
    new Pair<Currency, Currency>(TC_CAD, TC_USD) -> 0.972785402bd,
    new Pair<Currency, Currency>(TC_JPY, TC_USD) -> 0.01260483bd

  }

  protected function staticTable() : Map<Pair<Currency, Currency>, BigDecimal> {
    return STATIC_TABLE
  }

  // A default implementation of a utility method
  private function findAvailableConversions(market : FXRateMarket): Set<Pair<Currency, Currency>> {
    if (market == _defaultMarket) {
      return staticTable().Keys // a market knows how to get its available conversions
    }
    else {
      return {}
    }
  }

  private static function getRateFromStaticTable(fromCurrency : Currency, toCurrency : Currency) : BigDecimal {
    if (fromCurrency == toCurrency) {
      return 1.0bd 
    } 
    return STATIC_TABLE.get(new Pair<Currency, Currency>(fromCurrency, toCurrency))
  }
  
  private static function getRetrievalDate() : Date {
    return yesterdayAt(13) // Yesterday at 1 pm
  }

  private static function getMarketTime() : Date {
    return yesterdayAt(12) // Yesterday at noon
  }

  private static function yesterdayAt(hours: int) : Date {
    var d = DateUtil.trimToMidnight(DateUtil.currentDate()).addDays(-1);
    d.setHours(hours)
    return d
  }

}

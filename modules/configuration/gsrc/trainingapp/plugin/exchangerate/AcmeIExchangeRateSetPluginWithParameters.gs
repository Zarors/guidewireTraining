package trainingapp.plugin.exchangerate

uses gw.plugin.exchangerate.IExchangeRateSetPlugin
uses gw.api.system.database.SequenceUtil
uses gw.plugin.InitializablePlugin
uses java.util.Map

// This plugin is identical to AcmeIExchangeRateSetPlugin, except that it also
// reads in plugin parameters from the plugin registry and prints the values to
// the console the first time the plugin is used.

class AcmeIExchangeRateSetPluginWithParameters implements IExchangeRateSetPlugin, InitializablePlugin {
  public override function createExchangeRateSet(): ExchangeRateSet {
    // Create and initialize new exchange rate set
    var erSet = new ExchangeRateSet()
    erSet.Name = "Demo Exchange Rate Set " + SequenceUtil.next(1, "ERname")
    erSet.Description = "From AcmeIExchangeRateSetPluginWithParameters"
    erSet.MarketRates = true
    erSet.EffectiveDate = gw.api.util.DateUtil.currentDate()
    // Assume US dollars is default currency
    var defaultCurrency = typekey.Currency.TC_USD
    // Set exchange rate for all non-default currencies to a sequential value starting
    // with 1 and increasing by 1 per execution of the plugin
    var sequentialExchangeRateValue = SequenceUtil.next(1, "ERrate")
    for (currentCurrency in typekey.Currency.getTypeKeys(false)) {
      if (currentCurrency != defaultCurrency) {
        var newExchangeRate = new ExchangeRate()
        newExchangeRate.BaseCurrency = currentCurrency
        newExchangeRate.PriceCurrency = defaultCurrency
        newExchangeRate.Rate = sequentialExchangeRateValue
        erSet.addToExchangeRates(newExchangeRate)
      }
    }
    // For demo purposes only, print exchange rate set to the console
    for (currentER in erSet.ExchangeRates index i) {
      print(i + ": From " + currentER.BaseCurrency + " to " + currentER.PriceCurrency + " >>> " + currentER.Rate)
    }
    return erSet
  }

  override property set Parameters(parameters: Map <Object, Object>) {
    var userName = parameters.get("username")
    var password = parameters.get("password")
    print("Retrieving currency rates as " + userName + " with password " + password)
  }
}

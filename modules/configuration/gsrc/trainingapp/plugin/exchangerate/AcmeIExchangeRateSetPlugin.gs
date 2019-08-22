package trainingapp.plugin.exchangerate

uses gw.plugin.exchangerate.IExchangeRateSetPlugin

class AcmeIExchangeRateSetPlugin implements IExchangeRateSetPlugin {
  public override function createExchangeRateSet(): ExchangeRateSet {
    // START THE CUT-AND-PASTE HERE
        var erSet = new ExchangeRateSet()
        return erSet
    // END THE CUT-AND-PASTE HERE
  }
}

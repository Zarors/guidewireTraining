package trainingapp.demo

uses gw.api.startable.IStartablePlugin
uses gw.api.startable.StartablePluginState
uses gw.api.startable.StartablePluginCallbackHandler

class ExampleIStartablePlugin implements IStartablePlugin {


  var _state = StartablePluginState.Stopped
  var _callback : StartablePluginCallbackHandler

  construct() {
  }

  override property get State() : StartablePluginState  {
    return _state
  }

  override function start(callback : StartablePluginCallbackHandler, mode : boolean) {
//    _callback = callback
//    _callback.log( "ExampleStartablePluginImpl - Start method called" )
//    _state = Started
  }

  override function stop(mode : boolean) {
//    _callback.log( "ExampleStartablePluginImpl - Stop method called" )
//    _callback = null
//    _state = Stopped
  }

}


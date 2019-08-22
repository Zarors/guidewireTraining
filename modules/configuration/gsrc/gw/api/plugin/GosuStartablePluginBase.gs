package gw.api.plugin

uses gw.api.locale.DisplayKey
uses gw.api.startable.IStartablePlugin
uses gw.api.startable.StartablePluginCallbackHandler
uses gw.api.startable.StartablePluginState

/**
 * This class may be used as the base class for Gosu distributed or singleton plugins. It provides all the common
 * code for starting and stopping a plugin. For distributed plugins (annotated with @Distributed), an instance of the
 * plugin runs in every server instance in the cluster. For singleton plugins (not annotated with @Distributed), only one
 * instance of the plugin runs on a server with the appropriate role in the cluster.
 */
@Export
abstract public class GosuStartablePluginBase implements IStartablePlugin {
  var _pluginCallbackHandler: StartablePluginCallbackHandler
  var _state = StartablePluginState.Stopped

  private property set State(state: StartablePluginState) {
    StartablePluginBase.persistState(_pluginCallbackHandler, state);
    _state = state;
  }

  /**
   * Should only be called from the <code>start(StartablePluginCallbackHandler pluginCallbackHandler, boolean serverStarting)</code> method.
   *
   * @param pluginCallbackHandler Implementation of StartablePluginCallbackHandler that executes as the system user.
   * @param serverStarting        true if the request comes from the fact that the server is starting, false if it comes from the UI
   * @param startBlock            the customer initialization code that should be run at startup
   * @throws IllegalArgumentException if pluginCallbackHandler cannot be initialized
   */
  protected function innerStart(pluginCallbackHandler: StartablePluginCallbackHandler, serverStarting: boolean, startBlock: block()) {
    if (pluginCallbackHandler == null) {
      if (_pluginCallbackHandler == null) {
        throw new IllegalArgumentException(DisplayKey.get("PluginHandler.MayNotBeNull", PluginName))
      }
    } else {
      _pluginCallbackHandler = pluginCallbackHandler
    }
    var tempState = (serverStarting) ? _pluginCallbackHandler.getState(StartablePluginState.Started) : StartablePluginState.Started
    if (tempState == StartablePluginState.Started) {
      if (startBlock != null) {
        startBlock()
      }
      _pluginCallbackHandler.logStart(PluginName)
    } else {
      _pluginCallbackHandler.logStop(PluginName)
    }
    if (serverStarting) {
      _state = tempState
    } else {
      State = tempState
    }
    _pluginCallbackHandler.log(DisplayKey.get("PluginHandler.StateOfPlugin", PluginName, _state))
  }

  /**
   * Called during server startup or runlevel change and from the UI. If subclasses have any initialization code that needs to be run,
   * they should override this method so that it:
   * <p>
   * 1.) includes that initialization code in a lambda expression assigned to the startBlock variable
   * 2.) calls innerStart.
   * <p>
   * The call to innerStart will execute the initialization code within the appropriate context.
   *
   * @param pluginCallbackHandler Implementation of StartablePluginCallbackHandler that executes as the system user.
   * @param serverStarting        true if the request comes from the fact that the server is starting, false if it comes from the UI
   */
  override public function start(pluginCallbackHandler: StartablePluginCallbackHandler, serverStarting: boolean) {
    var startupBlock: block() = null
    innerStart(pluginCallbackHandler, serverStarting, startupBlock)
  }

  /**
   * Should only be called from the <code>stop(boolean serverShuttingDown)</code> method.
   *
   * @param serverShuttingDown true if the request comes from the fact that the server is stopping, false if it comes from the UI
   * @param stopBlock          the customer shutdown code that should be run at shutdown (should be idempotent -- able to be called multiple times)
   */
  protected function innerStop(serverShuttingDown: boolean, stopBlock: block()) {
    if (_pluginCallbackHandler != null) {
      if (stopBlock != null) {
        stopBlock()
      }
      _pluginCallbackHandler.logStop(PluginName)
      if (serverShuttingDown) {
        _state = StartablePluginState.Stopped
      } else {
        State = StartablePluginState.Stopped
      }
      _pluginCallbackHandler.log(DisplayKey.get("PluginHandler.StateOfPlugin", PluginName, _state))
    }
  }

  /**
   * Called during server shutdown or runlevel change and from the UI. If subclasses have any shutdown code that needs to be run,
   * they should override this method so that it:
   * <p>
   * 1.) includes that initialization code in a lambda expression assigned to the stopBlock variable
   * 2.) calls innerStop.
   * <p>
   * The call to innerStop will execute the initialization code within the appropriate context.
   *
   * @param serverShuttingDown true if the request comes from the fact that the server is shutting down, false if it comes from the UI
   */
  override public function stop(serverShuttingDown: boolean) {
    var stopBlock: block() = null
    innerStop(serverShuttingDown, stopBlock)
  }

  /**
   * @return the State of this plugin
   */
  override public property get State(): StartablePluginState {
    return _state
  }

  protected property get PluginName(): String {
    return this.Class.Name
  }

  protected property get CallbackHandler(): StartablePluginCallbackHandler {
    return _pluginCallbackHandler
  }

  protected function log(message: String) {
    _pluginCallbackHandler.log(message)
  }
}

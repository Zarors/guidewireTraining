package gw.command

uses com.guidewire.pl.system.dependency.PLDependencies
uses com.guidewire.pl.system.integration.plugins.PluginDefMock
uses gw.api.util.DisplayableException
uses gw.plugin.ClientSystemPlugin
uses gw.plugin.Plugins
uses gw.plugin.integration.StandAloneClientSystemPlugin
uses java.util.Map

@Export
@DefaultMethod("wPolicySystem")
class Plugin extends BaseCommand {
  
  private static final var _pluginConfig = PLDependencies.getPluginConfig()
  private static final var _pc900Plugin = new PluginDefMock("PolicySystemPlugin", ClientSystemPlugin, new gw.plugin.policy.pc900.PCPolicySystemPlugin())
  private static final var _pc1000Plugin = new PluginDefMock("PolicySystemPlugin", ClientSystemPlugin, new gw.plugin.policy.pc1000.PCPolicySystemPlugin())
  private static final var _pcStandAlonePlugin = new PluginDefMock("PolicySystemPlugin", ClientSystemPlugin, new StandAloneClientSystemPlugin())
  protected static final var _live : String = "live"
  protected static final var _pc900 : String = "pc900"
  protected static final var _pc1000 : String = "pc1000"
  protected static final var _standalone : String  = "standalone"
  protected static final var _reset : String  = "reset"
  protected static final var _default : String = "default"
  private static final var _pcPluginMap : Map<String, PluginDefMock> = {
    _live -> _pc900Plugin,
    _pc1000 -> _pc1000Plugin,
    _pc900 -> _pc900Plugin,
    _default -> _pcStandAlonePlugin,
    _standalone -> _pcStandAlonePlugin,
    _reset -> _pcStandAlonePlugin
  }

  @Argument("impl", {Plugin._live, Plugin._standalone, Plugin._pc1000, Plugin._pc900, Plugin._reset})
  function wPolicySystem() : String {
    var arg = getArgumentAsString("impl")
    if (arg == null) {
      arg = _default
    }
    var impl = _pcPluginMap.get(arg)
    if (impl == null) {
      throw new DisplayableException("Unrecognized plugin type: ${arg}")
    }
    _pluginConfig.addPluginDef(impl)
    var plugin = Plugins.get("PolicySystemPlugin")
    return "Using ${plugin}"
  }
}

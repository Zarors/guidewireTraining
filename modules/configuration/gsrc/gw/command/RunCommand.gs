package gw.command

uses gw.lang.reflect.IMethodInfo
uses pcf.api.Location


@Export
class RunCommand extends RunCommandBase {

  construct(name : String) {
    super(name)
  }

  override function openCommandPopup(command : BaseCommand, methodInfo : IMethodInfo) : Location {
    return pcf.RunCommandPopup.push( command, methodInfo )
  }
}
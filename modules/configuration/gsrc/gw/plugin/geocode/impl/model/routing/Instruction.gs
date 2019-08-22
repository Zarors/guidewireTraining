package gw.plugin.geocode.impl.model.routing

/**
 * Single routing step text instruction deserialization class
 */
@Export
class Instruction {
  private var _text : String as Text
  private var _maneuverType : String as ManeuverType
  private var _formattedText : String as FormattedText
}
package trainingapp.classes

uses gw.api.system.PLLoggerCategory
uses gw.api.util.DisplayableException
uses org.slf4j.Logger

class Rectangle {
  construct() {
  }
  protected var logger : Logger= PLLoggerCategory.CONFIG
  private var _width: int
  private var _height: int
  private var _label: String
  property get Width(): int {
    return _width
  }

  property set Width(w: int) {
    _width = w
  }

  property get Height(): int {
    return _height
  }

  property set Height(h: int) {
    _height = h
  }

  property get Label(): String {
    return _label
  }

  property set Label(l: String) {
    _label = l
  }

  function calculateArea(): int {
    return (_width * _height)
  }

  function addToWidth(valueToAdd: int): void {
    this._width = this._width + valueToAdd
  }

  function addToHeight(valueToAdd: int): void {
    this._height = this._height + valueToAdd
  }

  @Param("factor", "Enlarge shape by this value.")
  @Returns("A string that compare the original and current areas.")
  @Throws(DisplayableException, "Displayable exception if the factor is <= 0.")
  @Deprecated("Don't use Rectangle.enlarge(). Instead, use Shape.enlargeByFactor()")
  function enlarge(factor: int): String {
     if (factor <= 0) {
      logger.info("Rectangel.enlarge() invalid factor " + factor)
      throw new DisplayableException("Requires a factor greater than 0")
    }
    var originalArea = calculateArea()
    _width = _width * factor
    _height = _height * factor
    return String.format("Area of rectangle increased from %s to %s", {originalArea, calculateArea()})
  }
}


package trainingapp.classes

interface ILineAndFill {

  var _lineColor : String  = ""
  var _fillColor : String  = ""
  
  property get LineColor() : String
  property set LineColor(color : String)

  function setBackgroundToComplimentaryColor()

}



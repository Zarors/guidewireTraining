package trainingapp.classes

class Square extends Rectangle implements ILineAndFill  {

  construct() {
    super()
  }

  // Methods specified in the ILineAndFill interface.
  // You must implement all methods inherited from an interface
  // (using the key word "override").
  override property get LineColor() : String {
    return null //## todo: Implement me
  }

  override property set LineColor(color : String) {
    //## todo: Implement me
  }

  override function setBackgroundToComplimentaryColor() {
    //## todo: Implement me
  }

  // Methods inherited from the Rectangle superclass that
  // the sublcass overrides. You are not required to override
  // any methods inherited from an superclass.
  override function calculateArea() : int {
    // This overrides Rectangle's
    // calculateArea() method
    return (Width * Width)
  }

  // Method declared in the Square class. (It is not inherited from anywhere.)
  function calculatePerimeter() : int {
    // This method is unique to the
    // Square class
    return (4 * Width)
  }


}





package trainingapp.demo.gosu

uses java.lang.Integer

enum ColorSequenceable   
  implements gw.lang.reflect.interval.ISequenceable<ColorSequenceable,
      Integer, java.lang.Void>  {
    
  // enumeration values....  
  red, orange, yellow, green, blue, indigo, violet
 
  // required methods in ISequenceable interface...
  override function nextInSequence( stp : Integer, unit : java.lang.Void ) :
      ColorSequenceable {
    return ColorSequenceable.AllValues[this.Ordinal + stp]
  }
 
  override function nextNthInSequence( stp : Integer, unit : java.lang.Void,  
     iIndex  : int) : ColorSequenceable {
    return ColorSequenceable.AllValues[this.Ordinal + stp * iIndex]
  }
   
  override function previousInSequence( stp : Integer, unit : java.lang.Void ) : 
      ColorSequenceable {
    return ColorSequenceable.AllValues[this.Ordinal - stp]
  }
   
  override function previousNthInSequence( stp : Integer, unit : java.lang.Void, 
    iIndex : int) : ColorSequenceable {
    return ColorSequenceable.AllValues[this.Ordinal - stp * iIndex]
  } 
  
}



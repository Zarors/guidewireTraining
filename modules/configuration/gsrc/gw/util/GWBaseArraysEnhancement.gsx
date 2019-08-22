package gw.util

uses gw.api.upgrade.Coercions

enhancement GWBaseArraysEnhancement : Arrays
{  
  /**
   * Creates a new array of the given size, where every value in the
   * array is initialized to the given initVal.
   */
  static reified function makeArray<T>( initVal : T, size : int ) : T[]{
    var arr = Coercions.cast<T[]>(T.Type.makeArrayInstance( size ))
    //noinspection UnusedLoopVariable
    for(ignored in arr index j ) {
      arr[j] = initVal
    }
    return arr
  }
  
}

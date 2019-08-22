package gw.util

uses java.lang.Integer
uses gw.util.IntegerRange

enhancement GWBaseIntegerEnhancement : Integer {
 
  /**
  * Get a range of integers [start,end]
  */
  @Deprecated("Since 8.0.2.  Please use Gosu intervals instead e.g., 0..10")
  static function range( start : Integer, end : Integer ) : IntegerRange
  {
    return new IntegerRange(start, end)
  }

  /**
  * Get a range of integers [start,end] with increments between of size step
  * Start is inclusive, end is not.
  * Note that start is guaranteed to be in the range, but because of step, end might not be
  */
  @Deprecated("Since 8.0.2.  Please use Gosu intervals instead e.g., (0..10).step( 2 )")
  static function range( start : Integer, end : Integer, step : Integer) : IntegerRange
  {
    return new IntegerRange(start, end, step)
  }
}

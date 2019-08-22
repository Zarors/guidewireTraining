package gw.util

enhancement GWBaseCollectionEnhancement<T> : java.util.Collection<T> {
  
  /**
   * Returns the count of elements in this array that match the given condition
   *
   * @deprecated - use countWhere( condition(elt: T) ) instead
   */
  reified function countMatches( condition(elt : T):Boolean ) : int
  {
    return this.countWhere( condition )
  }

  /**
   * Returns the same value as .Count
   * 
   * @deprecated - use Count instead
   */
  @ShortCircuitingProperty
  reified property get size() : int
  {
    return this.Count
  }

  /**
   * Returns the same value as .count()
   * 
   * @deprecated - use Count instead
   */
  @ShortCircuitingProperty
  reified property get length() : int
  {
    return this.Count
  }


}

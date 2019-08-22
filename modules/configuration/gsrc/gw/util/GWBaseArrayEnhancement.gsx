package gw.util

enhancement GWBaseArrayEnhancement<T> : T[] {
 
  /**
   * @deprecated - use this.firstWhere() instead
   */
  reified function findFirst( condition(elt : T):Boolean ) : T {
    return this.firstWhere( condition )
  }

  /**
   * @deprecated - use this.where() instead   
   */
  reified function findAll( condition(elt : T):Boolean ) : T[] {
    return this.where( condition )
  }

  /**
   * @deprecated - use whereTypeIs()
   */
  reified function findByType<Q>( t : Type<Q> ) : Q[] {
    return this.whereTypeIs( t )
  }

  /**
   * @deprecated - use countWhere()
   */
  reified function countMatches( condition( elt : T ):Boolean ) : int {
    return this.countWhere( condition )
  }

   /**
    * @deprecated - use not arr.HasElements instead, which will
    *  handle the null case more effectively
    */
   function isEmpty() : boolean {
     return this.length == 0
   }

   /**
    * @deprecated - use toList().shuffle()
    */
   function shuffle() : T[] {
     var newList = this.toList().shuffle()
     newList.eachWithIndex( \ t, i -> { this[i] = t } )
     return this
   }

  /**
   * @deprecated - use Count
   */
  @ShortCircuitingProperty
  property get size() : int
  {
    return this.length
  }

}

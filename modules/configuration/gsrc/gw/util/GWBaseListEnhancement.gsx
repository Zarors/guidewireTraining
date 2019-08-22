package gw.util

uses java.util.List

enhancement GWBaseListEnhancement<T> : List<T> {

  /**
   * @deprecated - use firstWhere( cond(elt:T):boolean ) instead
   */
  reified function findFirst( condition(elt : T):Boolean ) : T {
    return this.firstWhere( condition )
  }

  /**
   * @deprecated - use where() instead
   */
  reified function findAll( condition(elt : T):Boolean ) : List<T> {
    return this.where( condition ).toList()
  }
  
  /**
   * @deprecated - use whereTypeIs() instead
   */
  reified function findByType<Q>( t : Type<Q> ) : List<Q> {
    return this.whereTypeIs( t )
  }

  /**
   * Removes all elements in this list that match the given closure and
   * returns the modified list
   * 
   * @deprecated - use removeWhere() instead
   */
  function removeMatches( shouldRemove(elt : T):Boolean ) : List<T> {
    var iter = this.iterator()
    while(iter.hasNext()) {
      var next = iter.next()
      if( shouldRemove( next ) ) {
        iter.remove()
      }
    }
    return this
  }
  
  /**
   * Removes all elements in this list that do not match the given closure and
   * returns the modified list
   * 
   * @deprecated - use retainWhere() instead
   */
  function keepMatches( shouldKeep(elt : T):Boolean ) : List<T> {
    var iter = this.iterator()
    while(iter.hasNext()) {
      var next = iter.next()
      if( not shouldKeep( next ) ) {
        iter.remove()
      }
    }
    return this
  }
  
}

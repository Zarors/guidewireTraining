package gw.util

uses java.util.Set

enhancement GWCoreSetEnhancement<T> : Set<T>
{

  
  /**
   * Removes all elements in this set that match the given closure and
   * returns the modified set
   * 
   * @deprecated - use removeWhere() instead
   */
  function removeMatches( shouldRemove(elt : T):Boolean ) : Set<T> {
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
   * Removes all elements in this set that do not match the given closure and
   * returns the modified set
   * 
   * @deprecated - use retainWhere() instead
   */
  function keepMatches( shouldKeep(elt : T):Boolean ) : Set<T> {
    var iter = this.iterator()
    while(iter.hasNext()) {
      var next = iter.next()
      if( not shouldKeep( next ) ) {
        iter.remove()
      }
    }
    return this
  }
  
  /**
   * @deprecated - use where( condition(elt:T):Boolean ) instead
   */
  reified function findAll( condition(elt : T):Boolean ) : Set<T>
  {
    return this.where( condition ).toSet()
  }
  
  /**
   * @deprecated - use whereTypeIs() instead
   */
  reified function findByType<Q>( t : Type<Q> ) : Set<Q>
  {
    return this.whereTypeIs(t).toSet()
  }
}

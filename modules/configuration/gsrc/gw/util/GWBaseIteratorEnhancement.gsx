package gw.util
uses java.util.Map
uses java.util.List

enhancement GWBaseIteratorEnhancement<T> : java.util.Iterator<T>
{
  /**
   * @deprecated - use toList().each()
   */
  public function each( operation(elt : T) )
  {
    this.toList().each( operation )
  }
 
  /**
   * @deprecated - use toList().each()
   */
  public function eachWithIndex( operation(elt : T, index : int) )
  {
    this.toList().eachWithIndex( operation )
  }
 
  /**
   * @deprecated - use toList().map()
   */
  public function map<Q>( mapper(elt : T):Q ) : List<Q>
  {
    return this.toList().map( mapper )
  }

  /**
   * @deprecated - use toList().reduce()
   */
  public function reduce<Q>( initialValue : Q, reducer(value : Q, elt : T):Q ) : Q
  {
    return this.toList().reduce( initialValue, reducer )
  }

  /**
   * @deprecated - use toList().toLookup()
   */
  reified function partition<Q>( partitioner(elt : T):Q ) : Map< Q, List<T> >
  {
    return this.toList().partition( partitioner  )
  }

  /**
   * @deprecated - use toList().partitionUniquely()
   */
  reified function partitionUniquely<Q>( partitioner(elt : T):Q ) : Map<Q, T>
  {
    return this.toList().partitionUniquely( partitioner )
  }

  /**
   * @deprecated - use toList().firstWhere()
   */
  reified function findFirst( condition(elt : T):Boolean ) : T
  {
    return this.toList().firstWhere( condition )
  }

  /**
   * @deprecated - use toList().hasMatch()
   */
  reified function hasMatch( condition(elt : T):Boolean ) : boolean
  {
    return this.toList().hasMatch( condition  )
  }

  /**
   * @deprecated - use toList().where()
   */
  reified function findAll( condition(elt : T):Boolean ) : List<T>
  {
    return this.toList().where( condition  )    
  }  

  /**
   * @deprecated - use toList().toTypedArray()
   */
  reified function toArray() : T[]
  {
    return this.toList().toTypedArray()
  }
   
  /**
   * Returns all the elements of the iterator as an array. This method is very expensive and should be avoided if
   * possible.
   *
   * @deprecated - use toList().toTypedArray()
   */
  public function toArray<Q>( seed : Q[] ) : Q[]
  {
    var lst = this.toList()
    return lst.toArray( seed )
  }
}

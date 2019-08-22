package gw.util
uses java.util.Comparator
uses java.lang.Comparable

@Export
enhancement GWBaseComparatorEnhancement<T extends Comparable> : Comparator<T> {
  
  /**
   * wraps this comparator using the provided mapper to create a new Comparator on Q
   */
  reified function map<Q extends Comparable>(mapper : block(q : Q) : T) : Comparator<Q> {
    return \ q1, q2 -> {
      return this.compare(mapper(q1),mapper(q2))
    }
  }

}

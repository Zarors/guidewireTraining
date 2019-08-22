package gw.api.domain

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses java.util.Map
uses java.lang.Iterable
uses java.util.List

enhancement GWEffDatedVersionListIterableEnhancement<T extends EffDatedVersionList> : Iterable<T> {
  reified function allVersions<V extends EffDated>(filterZeroWidth : boolean) : Map<T, List<V>> {
    var result : Map<T, List<V>> = {}
    var resultUntyped = VLLoader.allVersions(this.toList(), filterZeroWidth).mapValues(\ vs -> vs.toList().cast(V))
    resultUntyped.eachKey(\ VL -> {result[VL as T] = resultUntyped[VL]})
    return result
  }

  reified function allVersionsFlat<V extends EffDated>() : List<V> {
    return VLLoader.allVersionsFlat<V>(this.toList())
  }

  reified function arrays<C extends EffDatedVersionList>(arrayProp : String) : List<C> {
    return VLLoader.arrays<T, C>(this.toList(), arrayProp)
  }
}

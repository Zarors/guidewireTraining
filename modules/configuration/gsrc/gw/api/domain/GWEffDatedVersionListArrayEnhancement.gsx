package gw.api.domain

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses java.util.Map
uses java.util.List

enhancement GWEffDatedVersionListArrayEnhancement<T extends EffDatedVersionList> : T[] {
  reified function allVersions<V extends EffDated>(filterZeroWidth : boolean) : Map<T, List<V>> {
    return this.toList().allVersions<V>(filterZeroWidth)
  }

  reified function allVersionsFlat<V extends EffDated>() : List<V> {
    return this.toList().allVersionsFlat<V>()
  }

  reified function arrays<C extends EffDatedVersionList>(arrayProp : String) : List<C> {
    return this.toList().arrays<C>(arrayProp)
  }
}

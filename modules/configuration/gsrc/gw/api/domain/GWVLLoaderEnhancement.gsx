package gw.api.domain

uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses gw.api.database.PropertyResolver
uses gw.entity.IArrayPropertyInfo
uses java.util.List

enhancement GWVLLoaderEnhancement : gw.api.domain.VLLoader {
  static reified function allVersionsFlat<T extends EffDated>(VLs : List<EffDatedVersionList>) : List<T> {
    return VLLoader.allVersions(VLs, true).Values.flatten().toList().cast(T)
  }
  
  static reified function arrays<P extends EffDatedVersionList, C extends EffDatedVersionList>(VLs : List<P>, arrayProp : String) : List<C> {
    if (VLs.HasElements) {
      var arrayPropInfo = PropertyResolver.getProperty(VLs.first().Key.FixedId.Type, arrayProp) as IArrayPropertyInfo
      return VLLoader.loadArrays(VLs, arrayPropInfo).cast(C)
    }
    return {}
  }
}

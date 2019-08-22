package gw.api.domain

uses gw.api.database.PropertyResolver
uses gw.entity.IArrayPropertyInfo
uses java.util.List

enhancement GWBeanLoaderEnhancement : gw.api.domain.BeanLoader {
  static reified function arrays<P extends KeyableBean, C extends KeyableBean>(parentKeys : List<P>, arrayProp : String) : List<C> {
    if (parentKeys.HasElements) {
      var arrayPropInfo = PropertyResolver.getProperty(parentKeys.first().IntrinsicType, arrayProp) as IArrayPropertyInfo
      return BeanLoader.loadArrays(parentKeys, arrayPropInfo).cast(C)
    }
    return {}
  }
}

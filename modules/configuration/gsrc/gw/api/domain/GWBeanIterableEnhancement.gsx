package gw.api.domain

uses java.lang.Iterable
uses java.util.List

enhancement GWBeanIterableEnhancement<T extends KeyableBean> : Iterable<T> {
  reified function arrays<C extends KeyableBean>(arrayProp : String) : List<C> {
    return BeanLoader.arrays<T, C>(this.toList(), arrayProp)
  }
}

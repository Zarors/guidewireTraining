package gw.api.domain

enhancement GWBeanArrayEnhancement<T extends KeyableBean> : T[] {
  reified function arrays<C extends KeyableBean>(arrayProp : String) : List<C> {
    return this.toList().arrays<C>(arrayProp)
  }

}

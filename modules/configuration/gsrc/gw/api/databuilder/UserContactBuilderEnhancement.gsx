package gw.api.databuilder

@Export
enhancement UserContactBuilderEnhancement : UserContactBuilder {
  public function withDoNotDestroy(doNotPurge: boolean) : UserContactBuilder {
    this.set(UserContact#DoNotDestroy, doNotPurge);
    return this
  }
}
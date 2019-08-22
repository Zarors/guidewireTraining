package gw.api.databuilder

@Export
enhancement ContactBuilderEnhancement<T extends entity.Contact, B extends ContactBuilder<T, B>>: ContactBuilder<T, B> {

  reified function withContactCategoryScore(catBuilder: ContactCategoryScoreBuilder): B{
      this.addArrayElement(Contact#CategoryScores, catBuilder)
      return this as B
  }

}

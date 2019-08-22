package gw.entity

enhancement GWRootInfoEnhancement : entity.RootInfo {
  /**
   * Returns the public ID of the root.
   *
   * @return public ID of the root.
   */
  property get RootPublicID() : String {
    return this.PublicIDOfRoot
  }

  /**
   * Sets the root public ID to the passed value.
   *
   * @param value value for the root public ID.
   */
  property set RootPublicID(value : String) {
    this.PublicIDOfRoot = value
  }
}
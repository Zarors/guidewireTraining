package gw.entity

@Export
enhancement GWContactHistoryEnhancement: ContactHistory {

  property get UpdateUserName(): String {
    if (this.ExternalUpdateApp != null and this.ExternalUpdateUser != null) {
      return this.ExternalUpdateUser + " (" + this.ExternalUpdateApp.toUpperCase() + ")"

    } else if (this.ExternalUpdateUser != null) {
      return this.ExternalUpdateUser

    } else {
      return this.User.Credential.DisplayName
    }
  }

  property get ReviewerName(): String {
    if (this.ExternalUpdateUser != null and this.User != null)
      return this.User.DisplayName
    else
      return ""
  }
}

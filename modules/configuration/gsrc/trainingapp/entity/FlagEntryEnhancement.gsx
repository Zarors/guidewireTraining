package trainingapp.entity

uses gw.api.util.DateUtil

enhancement FlagEntryEnhancement: entity.FlagEntry {
  /* FlagEntry is editable if:
       1) Resolution is open (IsOpen is true), and
       2) User has ResolveFlags permission
  */

  property get IsEditable(): boolean {
    return ((this.IsOpen) and perm.System.flagentryresolve)
  }

  // end of property


  /* This function is called when a FlagEntry's resolution field
     is set. This function sets the UnflagDate and UnflagUser
     fields. This serves the role of a "FlagEntry Pre-Update"
     rule set.
  */

  function setFieldsOnResolution(): void {
    this.UnflagDate = DateUtil.currentDate()
    this.UnflagUser = User.util.getCurrentUser()
  }

  // end of function


  /* This function is called when the flag entry popup is closed on data commit.
     It closes any open flag entry with an unflagged date.
  */

  function closeEntry(): void {
    if (this.IsOpen and this.UnflagDate != null) {
      this.IsOpen = false
    }
  }

  // end of function


}

// end FlagEntryEnhancement enhancement


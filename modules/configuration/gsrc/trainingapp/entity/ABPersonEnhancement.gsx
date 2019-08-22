package trainingapp.entity

uses gw.api.util.DateUtil
uses gw.api.util.Math


enhancement ABPersonEnhancement: entity.ABPerson {
  /* Concatenates first name, middle name (if any), and last name.
  */

  property get FullName(): String {
    if (this.MiddleName == null) {
      return this.FirstName + " " + this.LastName
    } else {
      return this.FirstName + " " + this.MiddleName + " " + this.LastName
    }
  }

  // end of property

  /* Calculates age as string if date of birth is known.
     Calls math floor function to round to year. Otherwise,
     returns "Unknown".
  */

  property get Age(): String {
    if (this.DateOfBirth == null) {
      return "Unknown"
    } else {
      var today = DateUtil.currentDate()
      var ageInDays = DateUtil.daysBetween(this.DateOfBirth, today)
      var ageInYears = Math.roundDown(ageInDays / 365)
      return ageInYears as java.lang.String
    }
  }

  // end of property


  /* Sets whichever phone is primary phone to given new phone number.
  */

  property set NewPrimaryPhone(newPhoneNumber: String) {
    if (this.PrimaryPhone == typekey.PrimaryPhoneType.TC_HOME) {
      this.HomePhone = newPhoneNumber
    }
    if (this.PrimaryPhone == typekey.PrimaryPhoneType.TC_WORK) {
      this.WorkPhone = newPhoneNumber
    }
    if (this.PrimaryPhone == typekey.PrimaryPhoneType.TC_MOBILE) {
      this.CellPhone = newPhoneNumber
    }
  }

  // end of property


  /* Generates occupation if occupation is not set. Results are either
     "Attorney", "Doctor", "Employee of <employer name>", or "Unknown".
     Not created as a setter because it doesn't receive a value to use
     when determining how to set the Occupation field.
  */

  function assignDefaultOccupation(): void {
    if (this.Occupation == null) {
      if (this.Subtype == typekey.ABContact.TC_ABATTORNEY) {
        this.Occupation = "Attorney"
      } else {
        if (this.Subtype == typekey.ABContact.TC_ABDOCTOR) {
          this.Occupation = "Doctor"
        } else {
          if (this.Employer != null) {
            this.Occupation = "Employee of " + this.Employer.Name
          } else {
            this.Occupation = "Unknown"
          }
        }
      }
    }
    // end null check
  }

  // end of function

}

// end ABPersonEnhancement enhancement


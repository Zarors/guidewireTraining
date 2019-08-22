package trainingapp.entity

uses java.math.BigDecimal
uses java.math.MathContext


enhancement ABPolicyPersonEnhancement: entity.ABPolicyPerson {
  /* Returns the HeightInMeters field in inches. This getter is intended to
     be used in code that needs to work with the height in inches.
  */

  property get HeightInInches(): BigDecimal {
    // Inches * 0.0254 = Meters (value is rounded to nearest whole inch)
    if (this.HeightInMeters != null) {
      return (this.HeightInMeters / 0.0254).round(MathContext.DECIMAL32) as double
    } else {
      return 0.0
    }
  }

  // end of getter


  /* Sets the HeightInMeters field using a converted measure that is initially
     provided in inches. This setter is intended to be used in code that needs
     to work with the height in inches.
  */

  property set HeightInInches(height: BigDecimal) {
    // Inches * 0.0254 = Meters
    if (this.HeightInMeters != null) {
      this.HeightInMeters = (height * 0.0254) as double
    } else {
      this.HeightInMeters = 0
    }
  }

  // end of setter


  /* Returns the HeightInMeters field either in inches or in meters, based on the user's
     preference. This getter is intended to be used in the user interface.
  */

  property get HeightBasedOnUserPreferences(): BigDecimal {
    if (User.util.getCurrentUser().MeasurementSystemPreference == typekey.MeasurementSystem.TC_US_CUSTOMARY) {
      return this.HeightInInches
    } else {
      return this.HeightInMeters
    }
  }

  // end of getter


  /* Sets the HeightInMeters field either in inches or in meters, based on
     the user's preference. This setter not used in the user interface.
  */

  property set HeightBasedOnUserPreferences(height: BigDecimal) {
    if (User.util.getCurrentUser().MeasurementSystemPreference == typekey.MeasurementSystem.TC_US_CUSTOMARY) {
      this.HeightInInches = height
    } else {
      this.HeightInMeters = height
    }
  }

  // end of setter
}

// end ABPolicyPersonEnhancement enhancement






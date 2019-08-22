package trainingapp.scriptparameter

enhancement ScriptParametersEnhancement: ScriptParameters {

  static property get RecordInHistory_UserViewsOfContacts() : Boolean {
    return ScriptParameters.getParameterValue("RecordInHistory_UserViewsOfContacts") as Boolean
  }

  static property get RecordInHistory_ContactFlags() : Boolean {
    return ScriptParameters.getParameterValue("RecordInHistory_ContactFlags") as Boolean
  }

  static property get RecordInHistory_ChangesToAssignedUser() : Boolean {
    return ScriptParameters.getParameterValue("RecordInHistory_ChangesToAssignedUser") as Boolean
  }

  static property get RequiredCollateralMinimum() : Integer {
    return ScriptParameters.getParameterValue("RequiredCollateralMinimum") as Integer
  }

  static property get MaximumViewedContacts() : Integer {
    return ScriptParameters.getParameterValue("MaximumViewedContacts") as Integer
  }

  static property get ShowUSSpecificFields() : Boolean {
    return ScriptParameters.getParameterValue("ShowUSSpecificFields") as Boolean
  }

  static property get MaxRetriesForRetryableMessage() : Integer {
    return ScriptParameters.getParameterValue("MaxRetriesForRetryableMessage") as Integer
  }

}

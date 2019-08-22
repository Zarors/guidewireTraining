package trainingapp.base

uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.pl.persistence.core.Key
uses gw.api.database.*
uses java.lang.Integer
uses java.lang.NumberFormatException

class QueryUtil {

  /** Returns the ABContact with the given ID/public ID. If the query
   * string is an integer, then the method assumes it is an ID. Otherwise,
   * the method assumes it is a public ID. If an ABContact with that ID
   * or public ID cannot be found, it returns null. This method is used
   * primarily in examples where a given contact is needed and the code
   * that retrieves it needs to be as short as possible.
  */
  static function findContact(queryID: String): ABContact {
    var queryObj = Query.make(ABContact)

    // use the Java parseInt method to check if queryID is an integer
    try {
      Integer.parseInt(queryID)
      // If no exception was thrown, the query ID is an integer.
      // Therefore, restrict the query by ID.
      var queryKey = new Key(ABContact, Long.parseLong(queryID))
      queryObj.compare(ABContact#ID, Relop.Equals, queryKey)
    } catch (e: NumberFormatException) {
      // If an exception was thrown, the queryID is not an integer.
      // Therefore, assume queryID is a public ID and restrict the
      // query by public ID.            
      queryObj.compare(ABContact#PublicID, Relop.Equals, queryID)
    }
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.getAtMostOneRow()
    } else {
      return null
    }
  }

  // end findContact


  // ========================================================
  // ================    ABCompany branch    ================
  // ========================================================


  /** The ABCompany version of findContact(). <br>
   * <br>
   * Returns the ABCompany with the given ID/public ID. If the query
   * string is an integer, then the method assumes it is an ID. Otherwise,
   * the method assumes it is a public ID. If an ABCompany with that ID
   * or public ID cannot be found, it returns null. This method is used
   * primarily in examples where a given contact is needed and the code
   * that retrieves it needs to be as short as possible.
   */
  static function findCompany(queryID: String): ABCompany {
    var queryObj = Query.make(ABCompany)
    // use the Java parseInt method to check if queryID is an integer
    try {
      Integer.parseInt(queryID)
      // If no exception was thrown, the query ID is an integer.
      // Therefore, restrict the query by ID.
      var queryKey = new Key(ABCompany, Long.parseLong(queryID))
      queryObj.compare(ABCompany#ID, Relop.Equals, queryKey)
    } catch (e: NumberFormatException) {
      // If an exception was thrown, the queryID is not an integer.
      // Therefore, assume queryID is a public ID and restrict the
      // query by public ID.            
      queryObj.compare(ABCompany#PublicID, Relop.Equals, queryID)
    }
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.getAtMostOneRow()
    } else {
      return null
    }
  }

  // end findCompany


  /* The ABCompanyVendor version of findContact() <br>
   * <br>
   * Returns the ABCompanyVendor with the given ID/public ID. If the query
   * string is an integer, then the method assumes it is an ID. Otherwise,
   * the method assumes it is a public ID. If an ABCompanyVendor with that ID
   * or public ID cannot be found, it returns null.
  */
  static function findCompanyVendor(queryID: String): ABCompanyVendor {
    var queryObj = Query.make(ABCompanyVendor)
    // use the Java parseInt method to check if queryID is an integer
    try {
      Integer.parseInt(queryID)
      // If no exception was thrown, the query ID is an integer.
      // Therefore, restrict the query by ID.
      var queryKey = new Key(ABCompanyVendor, Long.parseLong(queryID))
      queryObj.compare(ABCompanyVendor#ID, Relop.Equals, queryKey)
    } catch (e: NumberFormatException) {
      // If an exception was thrown, the queryID is not an integer.
      // Therefore, assume queryID is a public ID and restrict the
      // query by public ID.            
      queryObj.compare(ABCompanyVendor#PublicID, Relop.Equals, queryID)
    }
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.getAtMostOneRow()
    } else {
      return null
    }
  }

  // end findCompanyVendor


  /** The ABAutoRepairShop version of findContact() <br>
   * <br>
   * Returns the ABAutoRepairShop with the given ID/public ID. If the query
   * string is an integer, then the method assumes it is an ID. Otherwise,
   * the method assumes it is a public ID. If an ABAutoRepairShop with that ID
   * or public ID cannot be found, it returns null.
  */
  static function findAutoRepairShop(queryID: String): ABAutoRepairShop {
    var queryObj = Query.make(ABAutoRepairShop)
    // use the Java parseInt method to check if queryID is an integer
    try {
      Integer.parseInt(queryID)
      // If no exception was thrown, the query ID is an integer.
      // Therefore, restrict the query by ID.
      var queryKey = new Key(ABAutoRepairShop, Long.parseLong(queryID))
      queryObj.compare(ABAutoRepairShop#ID, Relop.Equals, queryKey)
    } catch (e: NumberFormatException) {
      // If an exception was thrown, the queryID is not an integer.
      // Therefore, assume queryID is a public ID and restrict the
      // query by public ID.            
      queryObj.compare(ABAutoRepairShop#PublicID, Relop.Equals, queryID)
    }
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.getAtMostOneRow()
    } else {
      return null
    }
  }

  // end findAutoRepairShop


  /** The ABAutoTowingAgcy version of findContact() <br>
   * <br>
   * Returns the ABAutoTowingAgcy with the given ID/public ID. If the query
   * string is an integer, then the method assumes it is an ID. Otherwise,
   * the method assumes it is a public ID. If an ABAutoTowingAgcy with that ID
   * or public ID cannot be found, it returns null.
  */
  static function findAutoTowingAgcy(queryID: String): ABAutoTowingAgcy {
    var queryObj = Query.make(ABAutoTowingAgcy)
    // use the Java parseInt method to check if queryID is an integer
    try {
      Integer.parseInt(queryID)
      // If no exception was thrown, the query ID is an integer.
      // Therefore, restrict the query by ID.
      var queryKey = new Key(ABAutoTowingAgcy, Long.parseLong(queryID))
      queryObj.compare(ABAutoTowingAgcy#ID, Relop.Equals, queryKey)
    } catch (e: NumberFormatException) {
      // If an exception was thrown, the queryID is not an integer.
      // Therefore, assume queryID is a public ID and restrict the
      // query by public ID.            
      queryObj.compare(ABAutoTowingAgcy#PublicID, Relop.Equals, queryID)
    }
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.getAtMostOneRow()
    } else {
      return null
    }
  }

  // end findAutoTowingAgcy


  /** The ABLawFirm version of findContact() <br>
   * <br>
   * Returns the ABLawFirm with the given ID/public ID. If the query
   * string is an integer, then the method assumes it is an ID. Otherwise,
   * the method assumes it is a public ID. If an ABLawFirm with that ID
   * or public ID cannot be found, it returns null.
  */
  static function findLawFirm(queryID: String): ABLawFirm {
    var queryObj = Query.make(ABLawFirm)
    // use the Java parseInt method to check if queryID is an integer
    try {
      Integer.parseInt(queryID)
      // If no exception was thrown, the query ID is an integer.
      // Therefore, restrict the query by ID.
      var queryKey = new Key(ABLawFirm, Long.parseLong(queryID))
      queryObj.compare(ABLawFirm#ID, Relop.Equals, queryKey)
    } catch (e: NumberFormatException) {
      // If an exception was thrown, the queryID is not an integer.
      // Therefore, assume queryID is a public ID and restrict the
      // query by public ID.            
      queryObj.compare(ABLawFirm#PublicID, Relop.Equals, queryID)
    }
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.getAtMostOneRow()
    } else {
      return null
    }
  }

  // end findLawFirm


  /** The ABMedicalCareOrg version of findContact() <br>
   * <br>
   * Returns the ABMedicalCareOrg with the given ID/public ID. If the query
   * string is an integer, then the method assumes it is an ID. Otherwise,
   * the method assumes it is a public ID. If an ABMedicalCareOrg with that ID
   * or public ID cannot be found, it returns null.
  */
  static function findMedicalCareOrg(queryID: String): ABMedicalCareOrg {
    var queryObj = Query.make(ABMedicalCareOrg)
    // use the Java parseInt method to check if queryID is an integer
    try {
      Integer.parseInt(queryID)
      // If no exception was thrown, the query ID is an integer.
      // Therefore, restrict the query by ID.
      var queryKey = new Key(ABMedicalCareOrg, Long.parseLong(queryID))
      queryObj.compare(ABMedicalCareOrg#ID, Relop.Equals, queryKey)
    } catch (e: NumberFormatException) {
      // If an exception was thrown, the queryID is not an integer.
      // Therefore, assume queryID is a public ID and restrict the
      // query by public ID.            
      queryObj.compare(ABMedicalCareOrg#PublicID, Relop.Equals, queryID)
    }
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.getAtMostOneRow()
    } else {
      return null
    }
  }

  // end findMedicalCareOrg


  /* The ABPolicyCompany version of findContact() <br>
   * <br>
   * Returns the ABPolicyCompany with the given ID/public ID. If the query
   * string is an integer, then the method assumes it is an ID. Otherwise,
   * the method assumes it is a public ID. If an ABPolicyCompany with that ID
   * or public ID cannot be found, it returns null.
  */
  static function findPolicyCompany(queryID: String): ABPolicyCompany {
    var queryObj = Query.make(ABPolicyCompany)
    // use the Java parseInt method to check if queryID is an integer
    try {
      Integer.parseInt(queryID)
      // If no exception was thrown, the query ID is an integer.
      // Therefore, restrict the query by ID.
      var queryKey: Key = new Key(ABPolicyCompany, Long.parseLong(queryID))
      queryObj.compare(ABPolicyCompany#ID, Relop.Equals, queryKey)
    } catch (e: NumberFormatException) {
      // If an exception was thrown, the queryID is not an integer.
      // Therefore, assume queryID is a public ID and restrict the
      // query by public ID.            
      queryObj.compare(ABPolicyCompany#PublicID, Relop.Equals, queryID)
    }
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.getAtMostOneRow()
    } else {
      return null
    }
  }

  // end findPolicyCompany


  // =======================================================
  // ================    ABPerson branch    ================
  // =======================================================


  /** The ABPerson version of findContact() <br>
   * <br>
   * Returns the ABPerson with the given ID/public ID. If the query
   * string is an integer, then the method assumes it is an ID. Otherwise,
   * the method assumes it is a public ID. If an ABPerson with that ID
   * or public ID cannot be found, it returns null.
  */
  static function findPerson(queryID: String): ABPerson {
    var queryObj = Query.make(ABPerson)
    // use the Java parseInt method to check if queryID is an integer
    try {
      Integer.parseInt(queryID)
      // If no exception was thrown, the query ID is an integer.
      // Therefore, restrict the query by ID.
      var queryKey = new Key(ABPerson, Long.parseLong(queryID))
      queryObj.compare(ABPerson#ID, Relop.Equals, queryKey)
    } catch (e: NumberFormatException) {
      // If an exception was thrown, the queryID is not an integer.
      // Therefore, assume queryID is a public ID and restrict the
      // query by public ID.            
      queryObj.compare(ABPerson#PublicID, Relop.Equals, queryID)
    }
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.getAtMostOneRow()
    } else {
      return null
    }
  }

  // end findPerson


  /** The ABAdjudicator version of findContact() <br>
   * <br>
   * Returns the ABAdjudicator with the given ID/public ID. If the query
   * string is an integer, then the method assumes it is an ID. Otherwise,
   * the method assumes it is a public ID. If an ABAdjudicator with that ID
   * or public ID cannot be found, it returns null.
  */
  static function findAdjudicator(queryID: String): ABAdjudicator {
    var queryObj = Query.make(ABAdjudicator)
    // use the Java parseInt method to check if queryID is an integer
    try {
      Integer.parseInt(queryID)
      // If no exception was thrown, the query ID is an integer.
      // Therefore, restrict the query by ID.
      var queryKey = new Key(ABAdjudicator, Long.parseLong(queryID))
      queryObj.compare(ABAdjudicator#ID, Relop.Equals, queryKey)
    } catch (e: NumberFormatException) {
      // If an exception was thrown, the queryID is not an integer.
      // Therefore, assume queryID is a public ID and restrict the
      // query by public ID.            
      queryObj.compare(ABAdjudicator#PublicID, Relop.Equals, queryID)
    }
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.getAtMostOneRow()
    } else {
      return null
    }
  }

  // end findAdjudicator


  /** The ABPersonVendor version of findContact() <br>
   * <br>
   * Returns the ABPersonVendor with the given ID/public ID. If the query
   * string is an integer, then the method assumes it is an ID. Otherwise,
   * the method assumes it is a public ID. If an ABPersonVendor with that ID
   * or public ID cannot be found, it returns null.
  */
  static function findPersonVendor(queryID: String): ABPersonVendor {
    var queryObj = Query.make(ABPersonVendor)
    // use the Java parseInt method to check if queryID is an integer
    try {
      Integer.parseInt(queryID)
      // If no exception was thrown, the query ID is an integer.
      // Therefore, restrict the query by ID.
      var queryKey = new Key(ABPersonVendor, Long.parseLong(queryID))
      queryObj.compare(ABPersonVendor#ID, Relop.Equals, queryKey)
    } catch (e: NumberFormatException) {
      // If an exception was thrown, the queryID is not an integer.
      // Therefore, assume queryID is a public ID and restrict the
      // query by public ID.            
      queryObj.compare(ABPersonVendor#PublicID, Relop.Equals, queryID)
    }
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.getAtMostOneRow()
    } else {
      return null
    }
  }

  // end findPersonVendor


  /** The ABAttorney version of findContact() <br>
   * <br>
   * Returns the ABAttorney with the given ID/public ID. If the query
   * string is an integer, then the method assumes it is an ID. Otherwise,
   * the method assumes it is a public ID. If an ABAttorney with that ID
   * or public ID cannot be found, it returns null.
  */
  static function findAttorney(queryID: String): ABAttorney {
    var queryObj = Query.make(ABAttorney)
    // use the Java parseInt method to check if queryID is an integer
    try {
      Integer.parseInt(queryID)
      // If no exception was thrown, the query ID is an integer.
      // Therefore, restrict the query by ID.
      var queryKey = new Key(ABAttorney, Long.parseLong(queryID))
      queryObj.compare(ABAttorney#ID, Relop.Equals, queryKey)
    } catch (e: NumberFormatException) {
      // If an exception was thrown, the queryID is not an integer.
      // Therefore, assume queryID is a public ID and restrict the
      // query by public ID.            
      queryObj.compare(ABAttorney#PublicID, Relop.Equals, queryID)
    }
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.getAtMostOneRow()
    } else {
      return null
    }
  }

  // end findAttorney


  /** The ABDoctor version of findContact() <br>
   * <br>
   * Returns the ABDoctor with the given ID/public ID. If the query
   * string is an integer, then the method assumes it is an ID. Otherwise,
   * the method assumes it is a public ID. If an ABDoctor with that ID
   * or public ID cannot be found, it returns null.
  */
  static function findDoctor(queryID: String): ABDoctor {
    var queryObj = Query.make(ABDoctor)
    // use the Java parseInt method to check if queryID is an integer
    try {
      Integer.parseInt(queryID)
      // If no exception was thrown, the query ID is an integer.
      // Therefore, restrict the query by ID.
      var queryKey: Key = new Key(ABDoctor, Long.parseLong(queryID))
      queryObj.compare(ABDoctor#ID, Relop.Equals, queryKey)
    } catch (e: NumberFormatException) {
      // If an exception was thrown, the queryID is not an integer.
      // Therefore, assume queryID is a public ID and restrict the
      // query by public ID.            
      queryObj.compare(ABDoctor#PublicID, Relop.Equals, queryID)
    }
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.getAtMostOneRow()
    } else {
      return null
    }
  }

  // end findDoctor


  /** The ABPolicyPerson version of findContact() <br>
   * <br>
   * Returns the ABPolicyPerson with the given ID/public ID. If the query
   * string is an integer, then the method assumes it is an ID. Otherwise,
   * the method assumes it is a public ID. If an ABPolicyPerson with that ID
   * or public ID cannot be found, it returns null.
  */
  static function findPolicyPerson(queryID: String): ABPolicyPerson {
    var queryObj = Query.make(ABPolicyPerson)
    // use the Java parseInt method to check if queryID is an integer
    try {
      Integer.parseInt(queryID)
      // If no exception was thrown, the query ID is an integer.
      // Therefore, restrict the query by ID.
      var queryKey: Key = new Key(ABPolicyPerson, Long.parseLong(queryID))
      queryObj.compare(ABPolicyPerson#ID, Relop.Equals, queryKey)
    } catch (e: NumberFormatException) {
      // If an exception was thrown, the queryID is not an integer.
      // Therefore, assume queryID is a public ID and restrict the
      // query by public ID.            
      queryObj.compare(ABPolicyPerson#PublicID, Relop.Equals, queryID)
    }
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.getAtMostOneRow()
    } else {
      return null
    }
  }

  // end findPolicyPerson



  /** The ABUserContact version of findContact() <br>
   * <br>
   * Returns the ABUserContact with the given ID/public ID. If the query
   * string is an integer, then the method assumes it is an ID. Otherwise,
   * the method assumes it is a public ID. If an ABUserContact with that ID
   * or public ID cannot be found, it returns null.
  */
  static function findUserContact(queryID: String): ABUserContact {
    var queryObj = Query.make(ABUserContact)
    // use the Java parseInt method to check if queryID is an integer
    try {
      Integer.parseInt(queryID)
      // If no exception was thrown, the query ID is an integer.
      // Therefore, restrict the query by ID.
      var queryKey = new Key(ABUserContact, Long.parseLong(queryID))
      queryObj.compare(ABUserContact#ID, Relop.Equals, queryKey)
    } catch (e: NumberFormatException) {
      // If an exception was thrown, the queryID is not an integer.
      // Therefore, assume queryID is a public ID and restrict the
      // query by public ID.            
      queryObj.compare(ABUserContact#PublicID, Relop.Equals, queryID)
    }
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.getAtMostOneRow()
    } else {
      return null
    }
  }

  // end findUserContact


  // ======================================================
  // ================    ABPlace branch    ================
  // ======================================================


  /** The ABPlace version of findContact() <br>
   * <br>
   * Returns the ABPlace with the given ID/public ID. If the query
   * string is an integer, then the method assumes it is an ID. Otherwise,
   * the method assumes it is a public ID. If an ABPlace with that ID
   * or public ID cannot be found, it returns null.
  */
  static function findPlace(queryID: String): ABPlace {
    var queryObj = Query.make(ABPlace)
    // use the Java parseInt method to check if queryID is an integer
    try {
      Integer.parseInt(queryID)
      // If no exception was thrown, the query ID is an integer.
      // Therefore, restrict the query by ID.
      var queryKey = new Key(ABPlace, Long.parseLong(queryID))
      queryObj.compare(ABPlace#ID, Relop.Equals, queryKey)
    } catch (e: NumberFormatException) {
      // If an exception was thrown, the queryID is not an integer.
      // Therefore, assume queryID is a public ID and restrict the
      // query by public ID.            
      queryObj.compare(ABPlace#PublicID, Relop.Equals, queryID)
    }
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.getAtMostOneRow()
    } else {
      return null
    }
  }

  // end findPlace


  /** The ABLegalVenue version of findContact() <br>
   * <br>
   * Returns the ABLegalVenue with the given ID/public ID. If the query
   * string is an integer, then the method assumes it is an ID. Otherwise,
   * the method assumes it is a public ID. If an ABLegalVenue with that ID
   * or public ID cannot be found, it returns null.
  */
  static function findLegalVenue(queryID: String): ABLegalVenue {
    var queryObj = Query.make(ABLegalVenue)
    // use the Java parseInt method to check if queryID is an integer
    try {
      Integer.parseInt(queryID)
      // If no exception was thrown, the query ID is an integer.
      // Therefore, restrict the query by ID.
      var queryKey = new Key(ABLegalVenue, Long.parseLong(queryID))
      queryObj.compare(ABLegalVenue#ID, Relop.Equals, queryKey)
    } catch (e: NumberFormatException) {
      // If an exception was thrown, the queryID is not an integer.
      // Therefore, assume queryID is a public ID and restrict the
      // query by public ID.            
      queryObj.compare(ABLegalVenue#PublicID, Relop.Equals, queryID)
    }
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.getAtMostOneRow()
    } else {
      return null
    }
  }


  // ======================================================
  // ======================================================


  /** Returns the ABContact with the given ID (or null if no ABContact with
     that ID exists). This is used primarily for education purposes as it
     allows for shorter code examples where a given contact is needed.
     ** RETAINED FOR BACKWARDS COMPATABILITY. NEW REFERENCES SHOULD USE
     findContact() or one of its related methods. ***
  */
  @Deprecated("Diamond")
  public static function findContactByID(queryID: int): ABContact {
    var queryKey = new Key(ABContact, queryID)
    var queryObj = Query.make(ABContact)
    queryObj.compare(ABContact#ID, Relop.Equals, queryKey)
    var resultsObj = queryObj.select()
    if (resultsObj.Count == 1) {
      return resultsObj.getAtMostOneRow()
    } else {
      return null
    }
  }

  // end findContactByID

}

package libraries

@Export
enhancement RelatedContactsSorting : entity.ABContact
{
  // ---------------------------------------------------------------------------------------------------------
  //  PM had a desire for the relatedContacts LV to be sorted differently than how Contact sorting is specified
  //  in the displayNames.xml file.  In displayNames.xml, contacts are first sorted by subtype, which means
  //  that in the relatedContacts LV the list of contacts would be broken up by contact subtype, e.g., ABPerson,
  //  ABVendor, ABPlace, etc.  For relatedContacts LV, PM wants all contacts sorted as one large group, regardless
  //  of subtype, and with ABPerson instances sorted by 'LastName, FirstName MiddleName'.  This method was
  //  added as an extension to the ABContact class so that it can be accessed from a 'sortValue' attribute in the
  //  PCF file that defines the relatedContacts LV.
  // ---------------------------------------------------------------------------------------------------------
  function getSortValue() : String {
    var sortString = "";
  
    if (this typeis ABPerson) {
      var lastName = this.getFieldValue( "LastName" );
      var middleName = this.getFieldValue( "MiddleName" );
      var firstName = this.getFieldValue( "FirstName" ) + ((null != middleName) ? " " : "");
      middleName = (null == middleName) ? "" : middleName;
  
      sortString = lastName + ", " + firstName + middleName;
    } else {
      sortString = this.Name;
    }
  
    return sortString;
  }


}

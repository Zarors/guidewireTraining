package trainingapp.base


uses java.util.ArrayList
uses gw.api.database.Query
uses gw.api.database.QuerySelectColumns
uses gw.api.path.Paths


class RecentlyViewedContactUtil {

  static property get maximumViewedContacts(): int {
    var value: int = 5
    if (ScriptParameters.MaximumViewedContacts > 0) {
      value = ScriptParameters.MaximumViewedContacts
    }
    return value
  }

  public static function lastViewedContact(ViewingUser: User): ABContact {
    // select ViewedContacts for user
    var viewedContactsQuery = Query.make(ViewedContact)
    viewedContactsQuery.compare("ViewingUser", Equals, ViewingUser.ID)
    //select only that exist in ABContacts
    var contacts = Query.make(ABContact)
    viewedContactsQuery.subselect("ViewedContact", CompareIn, contacts, "ID")
    var aViewedContact = viewedContactsQuery.select().orderByDescending(QuerySelectColumns.path(Paths.make(ViewedContact#CreateTime))).FirstResult
    return aViewedContact.ViewedContact
  }

  public static function lastViewedContact(): ABContact {
    return lastViewedContact(User.util.getCurrentUser())
  }

  public static function lastViewedContactList(ViewingUser: User): List<ABContact> {
    // select ViewedContacts for user
    var viewedContactsQuery = Query.make(ViewedContact)
    viewedContactsQuery.compare("ViewingUser", Equals, ViewingUser.ID)
    //select only that exist in ABContacts
    var contacts = Query.make(ABContact)
    viewedContactsQuery.subselect("ViewedContact", CompareIn, contacts, "ID")
    var resultSet = viewedContactsQuery.select().orderByDescending(QuerySelectColumns.path(Paths.make(ViewedContact#CreateTime)))

    // create empty contact list
    var contactList = new ArrayList<ABContact>()
    // for each ViewedContact, if the contact list isn't full and if the
    // contact isn't already in the list, add the contact to the list
    for (aViewedContact in resultSet) {
      if ((contactList.Count < maximumViewedContacts ) and (!contactList.contains(aViewedContact.ViewedContact))) {
        // add to array list
        contactList.add(aViewedContact.ViewedContact)
      }
    }
    // return contact list
    return contactList
  }
}

// end class


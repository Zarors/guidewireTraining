package trainingapp.base

uses gw.api.database.IQueryBeanResult
uses gw.api.database.Query
uses gw.api.database.QuerySelectColumns
uses gw.api.database.Relop
uses gw.api.path.Paths
uses gw.transaction.Transaction

class AssignedUserUtil {

  /** Returns all users who are contact managers.
  */
  public static function findAllContactManagers(): IQueryBeanResult <User> {
    var roleQuery = Query.make(Role)
    roleQuery.compare(Role#Name, Relop.Equals, "Contact Manager")
    var userRoleQuery = Query.make(UserRole)
    userRoleQuery.subselect(UserRole#Role, CompareIn, roleQuery, Role#ID)
    var contactManagerQuery = Query.make(User)
    contactManagerQuery.subselect(User#ID, CompareIn, userRoleQuery, UserRole#User)
    var resultSet = contactManagerQuery.select()
    return resultSet
  }

  // end of findAllContactManager function

  /** Returns number of assigned ABContacts for given user.
  */
  public static function countAssignedContacts(aUser: User): int {
    var abContactQuery = Query.make(ABContact)
    abContactQuery.compare(ABContact#AssignedUser, Relop.Equals, aUser)
    var resultSet = abContactQuery.select()
    return resultSet.Count
  }

  // end of countAssignedContacts function


  /** Returns the set of ABContacts for given user.
  */
  public static function getAssignedContacts(aUser: User): IQueryBeanResult <ABContact> {
    var abContactQuery = Query.make(ABContact)
    abContactQuery.compare(ABContact#AssignedUser, Relop.Equals, aUser)
    var resultSet = abContactQuery.select()
    return resultSet
  }

  // end of countAssignedContacts function


  /** Returns user who has fewest number of contacts assigned to him or her. If there is a tie,
     function returns first such user when sorted alphabetically by last name.
  */
  public static function selectLeastBusyUser(ABContactNeedingReassignment: ABContact): void {
    // Determine all users who can have contact assigned to him or her. (This is the users with the
    // role "Contact Manager".) Then, sort them by last name. (Sort order determines who gets contact
    // when there is a tie.)

    var roleQuery = Query.make(Role)
    roleQuery.compare(Role#Name, Relop.Equals, "Contact Manager")

    var userRoleQuery = Query.make(UserRole)
    userRoleQuery.subselect(UserRole#Role, CompareIn, roleQuery,Role#ID)

    var contactManagerQuery = Query.make(User)
    contactManagerQuery.subselect(User#ID, CompareIn, userRoleQuery, UserRole#User)
    var contactManagerResultSet = contactManagerQuery.select()
    contactManagerResultSet.orderBy(QuerySelectColumns.path(Paths.make(User#Contact, UserContact#LastName)))
    var leastBusyUserContacts = Query.make(ABContact)
    // Initially, assume first user is least busy user. Determine how many users assigned to him/her.
    var leastBusyUser = contactManagerResultSet.FirstResult
    if (leastBusyUser !=null){
      leastBusyUserContacts.compare(ABContact#AssignedUser, Relop.Equals, leastBusyUser)
      var leastBusyUserContactsResultSet = leastBusyUserContacts.select()
      // For each contact manager user, compare number of their assigned contacts to number of contacts
      // assigned to current least busy manager. If current user has fewer contacts than least busy user,
      // make the current user the new least busy user.
      for (currentUser in contactManagerResultSet) {
        var currentUserContacts = Query.make(ABContact)
        currentUserContacts.compare(ABContact#AssignedUser, Relop.Equals, currentUser)
        var currentUserContactsResultSet = currentUserContacts.select()
        if (currentUserContactsResultSet.Count < leastBusyUserContactsResultSet.Count) {
          leastBusyUser = currentUser
          leastBusyUserContacts.compare(ABContact#AssignedUser, Relop.Equals, leastBusyUser)
          leastBusyUserContactsResultSet = leastBusyUserContacts.select()
        }
        // Change assigned user for target ABContact to least busy user.
        ABContactNeedingReassignment.AssignedUser = leastBusyUser
      }
    }
  }

  // end of SelectLeastBusyUser function

  // =================================================================================================

  public static function transferAssignedUser(CurrentUser: User, TargetUser: User): String {
    // Do no further processing if either user value is null.
    if ((CurrentUser == null) or (TargetUser == null)) {
      return "Cannot transfer assigned user if either value is null."
    }
    // Do no further processing if two users are the same.
    if (CurrentUser == TargetUser) {
      return "Cannot transfer assigned user to same user."
    }
    var contactsToTransfer = getAssignedContacts(CurrentUser)
    var affectedContacts = contactsToTransfer.Count
    if (affectedContacts > 0) {
      Transaction.runWithNewBundle(\bundle -> {
        for (currentContact in contactsToTransfer) {
          bundle.add(currentContact)
          currentContact.AssignedUser = TargetUser
          // Create history entry to denote change
          var newEntry = new HistoryEntry()
          newEntry.EventType = HistoryEventType.TC_ASSIGNED
          // AssignedUser is a foreign key field. Therefore, foreign key
          // must be retrieved, and then object to which that key points to
          // must be retrieved.
          // Retrieve foreign key value (which is a user ID value)
          var originalUserKey = currentContact.getOriginalValue("AssignedUser")
          // Write history entry using original user value.
          var originalAssignedUser = Query.make(User).compare("ID", Relop.Equals, originalUserKey).select().AtMostOneRow
          newEntry.Description = "Assigned user changed from "
              + originalAssignedUser.DisplayName + " to "
              + currentContact.AssignedUser.DisplayName
          currentContact.addToHistoryEntries(newEntry)
        }
      })
    }
    return "Number of contacts reassigned: " + affectedContacts
  }
}

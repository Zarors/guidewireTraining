package gw.webservice.contactapi.ab900

@Export
interface ABClientAPI {
  
  /**
   * Merge a given contact with another.
   * 
   * @param keptContactABUID the UID of the contact to keep
   * @param deletedContactABUID the UID of contact to be replaced
   */
  function mergeContacts(keptContactABUID: String, deletedContactABUID: String)
  
  /**
   * Update a contact in the client system.
   * 
   * @param contactXML the updates expressed as a SOAP object
   */
  function updateContact(contactXML: gw.webservice.contactapi.beanmodel.XmlBackedInstance)
  
  /**
   * Return true if the contact associated with the <code>AddressBookUID</code> can be deleted
   * or no contact is associated with <code>AddressBookUID</code>, false otherwise.
   * 
   * @param addressBookUID the <code>AddressBookUID</code> of the <code>Contact</code>
   * @return true if the associated contact is deletable or nonexistant, false otherwise.
   */
  function isContactDeletable(addressBookUID: String) : boolean

  /**
   * Removes the specified contact.
   * 
   * @param addressBookUID the <code>AddressBookUID</code> of the <code>Contact</code>
   */
  function removeContact(addressBookUID: String)

  /**
   * Notifies the client system that a pending update it submitted has been 
   * rejected by ContactManager. The client application can use the 
   * information in the context parameter to inform the user who submitted
   * the change of its rejection.
   * 
   * @param context the context information for the change
   */
  function pendingUpdateRejected(context: gw.webservice.contactapi.ab900.ABClientAPIPendingChangeContext)

  /**
   * Notifies the client system that a pending create it submitted has been
   * rejected by ContactManager. The client application can use the
   * information in the context parameter to inform the user who submitted
   * the change of its rejection.
   *
   * @param context the context information for the change
   */
  function pendingCreateRejected(context: gw.webservice.contactapi.ab900.ABClientAPIPendingChangeContext)

  /**
   * Notifies the client system that a pending create it submitted has been
   * approved by ContactManager.
   *
   * @param context the context information for the change
   */
  function pendingCreateApproved(context: gw.webservice.contactapi.ab900.ABClientAPIPendingChangeContext)

  /**
   * Notifies the client system that a pending update it submitted has been
   * approved by ContactManager.
   *
   * @param context the context information for the change
   * @param abuidContainer the mapping between client public ids and addressbookuids for
   * entities created by the update
   */
  function pendingUpdateApproved(context: gw.webservice.contactapi.ab900.ABClientAPIPendingChangeContext, abuidContainer: ABClientAPIAddressBookUIDContainer)


}

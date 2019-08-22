package gw.webservice.contactapi.ab900

uses gw.webservice.contactapi.ab900.IABClientAPIPendingChangeContext


/**
 * An ABClientAPIPendingChangeContext is passed as an argument to the ABClientAPI methods:
 *     pendingUpdateApproved
 *     pendingUpdateRejected
 *     pendingCreateApproved
 *     pendingCreateRejected
 * It contains information about the pending change.
 */
@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/pl/ws/gw/webservice/contactapi/ab900/ABClientAPIPendingChangeContext")
final class ABClientAPIPendingChangeContext implements IABClientAPIPendingChangeContext {
   /**
    * @return The Applications PublicID of the Contact that was updated
    */
   private var _contactPublicID : String as PublicID

   /**
    * @return The AddressBookUID of the Contact that was updated
    */
   private var _contactAddressBookUID : String as AddressBookUID

   /**
    * @return The client application user who made the change
    */
   private var _appUsername : String as Username

   /**
    * @return The client application user's DisplayName
    */
   private var _appUserDisplayName : String as UserDisplayName

   /**
    * @return The type of the client application entity associated with the change
    */
   private var _appRootEntityType : String as RootEntityType

   /**
    * @return The client app ID for the client application entity associated with the change
    */
   private var _appRootEntityID : String as RootEntityID

   /**
    * @return The display name for the client application entity associated with the change
    */
   private var _appRootEntityDisplayName : String as RootEntityDisplayName

   /**
    * @return The resolution of the contact change request
    */
   private var _changeResolution : ContactChangeResolution as Resolution

   /**
    * @return The reason for the resolution of the contact change request
    */
   private var _changeResolutionReason : String as ResolutionReason
   
   /**
    * @return The entity type name of the PendingContactChangeEntity 
    */
   private var _changeEntityTypeName : String as ChangeEntityTypeName

   /**
    * @return The changed fields sent to CM as part of Pending Update
    */
   private var _changeXML : String as ChangeXML
}
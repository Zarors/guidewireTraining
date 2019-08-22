package gw.api.contact

uses gw.xml.ws.annotation.WsiExportable

/**
 * This is the class that ContactManager uses to hold the data for a
 * PendingChangeContext in a webservice version independent manner.
 */
@Export
@WsiExportable( "http://guidewire.com/ab/ws/gw/api/contact/PendingChangeContext" )
final class PendingChangeContext implements IPendingChangeContext{
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
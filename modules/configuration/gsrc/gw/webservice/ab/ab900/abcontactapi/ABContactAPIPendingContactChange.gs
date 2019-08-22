package gw.webservice.ab.ab900.abcontactapi
uses gw.webservice.contactapi.beanmodel.XmlBackedInstance

@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/ab/ws/gw/webservice/ab/ab900/abcontactapi/ABContactAPIPendingContactChange" )
@Export
final class ABContactAPIPendingContactChange implements IABContactAPIPendingContactChange {

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

  construct() {

  }

  override function populatePendingContactChange(contactChange : PendingContactChange, updateXML : XmlBackedInstance, contactForChange : ABContact) {
    contactChange.AppRootEntityDisplayName = RootEntityDisplayName
    contactChange.AppRootEntityID = RootEntityID
    contactChange.AppRootEntityType = RootEntityType
    contactChange.AppUserDisplayName = UserDisplayName
    contactChange.AppUserName = Username    
    contactChange.ClientAppPublicID = updateXML.ExternalPublicID
    contactChange.Application = updateXML.ExternalUpdateApp
    contactChange.ABContact = contactForChange
  }

}

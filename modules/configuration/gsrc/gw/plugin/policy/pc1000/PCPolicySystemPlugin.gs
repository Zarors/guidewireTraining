package gw.plugin.policy.pc1000

uses gw.api.contact.IAddressBookUIDContainer
uses gw.plugin.integration.ClientSystemPlugin1000
uses gw.webservice.ab.ab1000.abclientapi.ABClientAPIAddressBookUIDContainerUtil
uses gw.xml.XmlElement
uses gw.xml.ws.WsdlConfig
uses gw.xml.ws.WsiExportableUtil
uses wsi.remote.gw.webservice.pc.pc1000.beanmodel.XmlBackedInstance
uses wsi.remote.gw.webservice.pc.pc1000.contactapi.ContactAPI
uses wsi.remote.gw.webservice.pc.pc1000.contactapi.anonymous.elements.ABClientAPIAddressBookUIDContainer_AddressBookUIDTuples
uses wsi.remote.gw.webservice.pc.pc1000.contactapi.anonymous.elements.ABClientAPIAddressBookUIDContainer_AddressBookUIDTuples_Entry
uses wsi.remote.gw.webservice.pc.pc1000.contactapi.faults.BadIdentifierException
uses wsi.remote.gw.webservice.pc.pc1000.contactapi.faults.IllegalArgumentException
uses wsi.remote.gw.webservice.pc.pc1000.contactapi.faults.RequiredFieldException
uses wsi.remote.gw.webservice.pc.pc1000.contactapi.faults.SOAPException
uses wsi.remote.gw.webservice.pc.pc1000.contactapi.types.complex.ABClientAPIAddressBookUIDContainer
uses wsi.remote.gw.webservice.pc.pc1000.contactapi.types.complex.ABClientAPIPendingChangeContext
uses entity.ABContact


@Export
class PCPolicySystemPlugin extends ClientSystemPlugin1000 {
  
  private var _api : ContactAPI

  construct() {
    _api = new ContactAPI()
  }

  override protected property get WsdlConfig() : WsdlConfig {
    return _api.Config
  }

  override property get ProductName() : String {
    return "PolicyCenter"
  }

  override property get ShortProductName() : String {
    return "pc"
  }

  override public function setLanguage(languageType : LanguageType) {
    _api.Config.Guidewire.Locale = languageType.Code
  }

  public property get Language(): LanguageType {
    return LanguageType.get(_api.Config.Guidewire.Locale)
  }
  
  override protected function appSpecificMergeContacts(keptId : String, retiredId : String, transId : String) {
    setTransactionId(transId)
    _api.mergeContacts(keptId, retiredId)
  }

  override protected function appSpecificUpdateContact(xml : String, transId : String) {
    var xmlBackedInstance = XmlBackedInstance.parse(xml)
    setTransactionId(transId)
    _api.updateContact(xmlBackedInstance)
  }

  override function appSpecificRemoveContact(linkID : String, transId : String) {
    setTransactionId(transId)
    _api.removeContact(linkID)
  }

  override function appSpecificRejectChange(contextXml : String) {
    var clientContext = createRemoteABClientAPIPendingChangeContext(contextXml)

    if(clientContext.ChangeEntityTypeName == PendingContactCreate.Type.RelativeName) {
      _api.pendingCreateRejected(clientContext)
    } else if(clientContext.ChangeEntityTypeName == PendingContactUpdate.Type.RelativeName) {
      _api.pendingUpdateRejected(clientContext)
    }
  }

  override function appSpecificApproveChange(contextXml : String, abuidContainerXml : String) {
    var clientContext = createRemoteABClientAPIPendingChangeContext(contextXml)

    if(clientContext.ChangeEntityTypeName == PendingContactCreate.Type.RelativeName) {
      _api.pendingCreateApproved(clientContext)
    } else if(clientContext.ChangeEntityTypeName == PendingContactUpdate.Type.RelativeName) {
      var abuidContainer = createRemoteABClientAddressBookUIDContainer(abuidContainerXml)
      _api.pendingUpdateApproved(clientContext, abuidContainer)
    }
  }

  override function appSpecificIsContactDeletable(linkID : String) : boolean {
    return _api.isContactDeletable(linkID)
  }

  override function appSpecificInitAddressBookUIDContainer(container: IAddressBookUIDContainer, contact : ABContact) {
    ABClientAPIAddressBookUIDContainerUtil.init(container, contact)
  }

  override protected function isNonRetryableSOAPException(e : Exception) : boolean {
    return  e typeis BadIdentifierException or
            e typeis IllegalArgumentException or
            e typeis RequiredFieldException
  }

  override protected function isRetryableSOAPException(e : Exception) : boolean {
    return  e typeis SOAPException
  }

  override property get ProductCode() : String {
    return "pc"
  }
  protected function createRemoteABClientAPIPendingChangeContext(contextXml : String) : ABClientAPIPendingChangeContext {
    var contextXmlElement = XmlElement.parse(contextXml)
    var context = WsiExportableUtil.unmarshal(contextXmlElement, gw.api.contact.PendingChangeContext) as gw.api.contact.PendingChangeContext
    var clientContext = new ABClientAPIPendingChangeContext() {
      :AddressBookUID = context.AddressBookUID,
      :ChangeEntityTypeName = context.ChangeEntityTypeName,
      :PublicID = context.PublicID,
      :Resolution = wsi.remote.gw.webservice.pc.pc1000.contactapi.enums.ContactChangeResolution.forGosuValue(context.Resolution.Code),
      :ResolutionReason = context.ResolutionReason,
      :RootEntityDisplayName = context.RootEntityDisplayName,
      :RootEntityID = context.RootEntityID,
      :RootEntityType = context.RootEntityType,
      :UserDisplayName = context.UserDisplayName,
      :Username = context.Username      
    }
    return clientContext
  }

  protected function createRemoteABClientAddressBookUIDContainer(abuidContainerXml : String) : ABClientAPIAddressBookUIDContainer {
    var abuidContainerXmlElement = XmlElement.parse(abuidContainerXml)
    var abuidContainer = WsiExportableUtil.unmarshal(abuidContainerXmlElement, gw.api.contact.AddressBookUIDContainer) as gw.api.contact.AddressBookUIDContainer
    var clientContainer = new ABClientAPIAddressBookUIDContainer() {
      :ContactABUID = abuidContainer.ContactABUID
    }
    clientContainer.AddressBookUIDTuples = new ABClientAPIAddressBookUIDContainer_AddressBookUIDTuples()
    clientContainer.AddressBookUIDTuples.Entry = new java.util.ArrayList<ABClientAPIAddressBookUIDContainer_AddressBookUIDTuples_Entry>()
    for(tuple in abuidContainer.AddressBookUIDTuples) {
      var clientTuple = new ABClientAPIAddressBookUIDContainer_AddressBookUIDTuples_Entry() {
        :EntityType = tuple.EntityType,
        :External_PublicID = tuple.External_PublicID,
        :LinkID = tuple.LinkID
      }
      clientContainer.AddressBookUIDTuples.Entry.add(clientTuple)
    }
    return clientContainer
  }

}

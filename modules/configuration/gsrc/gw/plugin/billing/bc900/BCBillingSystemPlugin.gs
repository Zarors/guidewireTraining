package gw.plugin.billing.bc900

uses gw.api.contact.IAddressBookUIDContainer
uses gw.api.system.ABLoggerCategory
uses gw.plugin.integration.ClientSystemPlugin900
uses gw.webservice.ab.ab900.abclientapi.ABClientAPIAddressBookUIDContainerUtil
uses gw.xml.XmlElement
uses gw.xml.ws.WsdlConfig
uses gw.xml.ws.WsiExportableUtil
uses wsi.remote.gw.webservice.bc.bc900.beanmodel.XmlBackedInstance
uses wsi.remote.gw.webservice.bc.bc900.contactapi.ContactAPI
uses wsi.remote.gw.webservice.bc.bc900.contactapi.anonymous.elements.ABClientAPIAddressBookUIDContainer_AddressBookUIDTuples
uses wsi.remote.gw.webservice.bc.bc900.contactapi.anonymous.elements.ABClientAPIAddressBookUIDContainer_AddressBookUIDTuples_Entry
uses wsi.remote.gw.webservice.bc.bc900.contactapi.faults.BadIdentifierException
uses wsi.remote.gw.webservice.bc.bc900.contactapi.faults.IllegalArgumentException
uses wsi.remote.gw.webservice.bc.bc900.contactapi.faults.IllegalStateException
uses wsi.remote.gw.webservice.bc.bc900.contactapi.faults.RequiredFieldException
uses wsi.remote.gw.webservice.bc.bc900.contactapi.types.complex.ABClientAPIAddressBookUIDContainer
uses wsi.remote.gw.webservice.bc.bc900.contactapi.types.complex.ABClientAPIPendingChangeContext

uses java.lang.Exception

@Export
class BCBillingSystemPlugin extends ClientSystemPlugin900 {

  var _api : ContactAPI
  private static var _logger = ABLoggerCategory.AB_PLUGIN

  construct() {
    _api = new ContactAPI()
  }

  override protected property get WsdlConfig() : WsdlConfig {
    return _api.Config
  }

  override property get ProductName() : String {
    return "BillingCenter"
  }

  override property get ShortProductName() : String {
    return "bc"
  }

  override function appSpecificMergeContacts(keptId : String, retiredId : String, transId : String) {
    setTransactionId(transId)
    _api.mergeContacts(keptId, retiredId)
  }

  override function appSpecificUpdateContact(xml : String, transId : String) {
    var xmlBackedInstance = XmlBackedInstance.parse(xml)
    setTransactionId(transId)
    _api.updateContact(xmlBackedInstance)
  }

  override public function setLanguage(languageType : LanguageType) {
    //     _api.Config.Guidewire.Locale = languageType.Code
  }
  
  override function appSpecificRemoveContact(linkId : String, transId : String) {
    setTransactionId(transId)
    _api.removeContact(linkId)
  }

  override function appSpecificIsContactDeletable(linkId : String) : boolean {
    return _api.isContactDeletable(linkId)
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

  override function appSpecificInitAddressBookUIDContainer(container: IAddressBookUIDContainer, contact : ABContact) {
    ABClientAPIAddressBookUIDContainerUtil.init(container, contact)
  }

  override protected function isNonRetryableSOAPException(e : Exception) : boolean {
    return  e typeis BadIdentifierException or
            e typeis IllegalArgumentException or
            e typeis IllegalStateException or
            e typeis RequiredFieldException
  }

  override protected function isRetryableSOAPException(e : Exception) : boolean {
    return  false
  }

  override property get ProductCode() : String {
    return "bc"
  }

  protected function createRemoteABClientAPIPendingChangeContext(contextXml : String) : ABClientAPIPendingChangeContext {
    var contextXmlElement = XmlElement.parse(contextXml)
    var context = WsiExportableUtil.unmarshal(contextXmlElement, gw.api.contact.PendingChangeContext) as gw.api.contact.PendingChangeContext
    var clientContext = new ABClientAPIPendingChangeContext() {
      :AddressBookUID = context.AddressBookUID,
      :ChangeEntityTypeName = context.ChangeEntityTypeName,
      :PublicID = context.PublicID,
      :Resolution = wsi.remote.gw.webservice.bc.bc900.contactapi.enums.ContactChangeResolution.forGosuValue(context.Resolution.Code),
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

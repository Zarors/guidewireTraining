package gw.api.extension

uses gw.api.contact.AddressBookUIDContainer
uses gw.api.contact.IAddressBookUIDContainerFactory
uses gw.plugin.contact.pendingchange.ABPendingChanges
uses gw.web.IPendingChangesWebUtilExtensions
uses gw.web.PendingChangesWebUtil
uses gw.web.merge.IMergeContactsWebUtilExtensions
uses gw.web.merge.MergeContactsWebUtil
uses gw.webservice.contactapi.AddressBookUIDTupleFactory

/**
 * Extension interfaces mapper implementation.
 * <p/>
 * WARNING: Customers must never modify this mapping class file. Treat this file as read-only, despite the @Export
 * annotation that is in this file for internal reasons. However, you can edit the writable implementation classes
 * that this file references.
 */
@Export
class ABExtensionInterfacesMapper implements ExtensionInterfacesMapper {

  override function bindImplementations(config: ExtensionInterfacesConfig) {
    config.setImplementation<gw.contactmapper.ab900.IContactIntegrationMapperFactoryExtensions>(\ -> gw.contactmapper.ab900.ContactIntegrationMapperFactory.get())
    config.setImplementation<gw.webservice.ab.ab900.abcontactapi.IRelatedContactInfoContainerFactory>(\ -> new gw.webservice.ab.ab900.abcontactapi.RelatedContactInfoContainer())
    config.setImplementation<gw.webservice.ab.ab900.abcontactapi.IABContactAPIRelatedContactFactory>(\ -> new gw.webservice.ab.ab900.abcontactapi.ABContactAPIRelatedContact())
    config.setImplementation<gw.webservice.ab.ab900.abcontactapi.IABContactAPISearchResultContainerFactory>(\ -> new gw.webservice.ab.ab900.abcontactapi.ABContactAPISearchResultContainer())
    config.setImplementation<gw.webservice.ab.ab900.abcontactapi.IABContactAPISearchResultFactory>(\ contact -> new gw.webservice.ab.ab900.abcontactapi.ABContactAPISearchResult(contact))
    config.setImplementation<gw.webservice.ab.ab900.abcontactapi.IABContactAPIFindDuplicatesResultContainerFactory>(\ -> new gw.webservice.ab.ab900.abcontactapi.ABContactAPIFindDuplicatesResultContainer())
    config.setImplementation<gw.webservice.ab.ab900.abcontactapi.IABContactAPIFindDuplicatesResultFactory>(\ contact, exactMatch -> new gw.webservice.ab.ab900.abcontactapi.ABContactAPIFindDuplicatesResult(contact, exactMatch))
    config.setImplementation<gw.webservice.ab.ab900.abcontactapi.IABContactAPISpecialistServiceFactory>(\ service -> new gw.webservice.ab.ab900.abcontactapi.ABContactAPISpecialistService(service))
    config.setImplementation<gw.contactmapper.ab1000.IContactIntegrationMapperFactoryExtensions>(\ -> gw.contactmapper.ab1000.ContactIntegrationMapperFactory.get())
    config.setImplementation<gw.webservice.ab.ab1000.abcontactapi.IRelatedContactInfoContainerFactory>(\ -> new gw.webservice.ab.ab1000.abcontactapi.RelatedContactInfoContainer())
    config.setImplementation<gw.webservice.ab.ab1000.abcontactapi.IABContactAPIRelatedContactFactory>(\ -> new gw.webservice.ab.ab1000.abcontactapi.ABContactAPIRelatedContact())
    config.setImplementation<gw.webservice.ab.ab1000.abcontactapi.IABContactAPISearchResultContainerFactory>(\ -> new gw.webservice.ab.ab1000.abcontactapi.ABContactAPISearchResultContainer())
    config.setImplementation<gw.webservice.ab.ab1000.abcontactapi.IABContactAPISearchResultFactory>(\ contact -> new gw.webservice.ab.ab1000.abcontactapi.ABContactAPISearchResult(contact))
    config.setImplementation<gw.webservice.ab.ab1000.abcontactapi.IABContactAPIFindDuplicatesResultContainerFactory>(\ -> new gw.webservice.ab.ab1000.abcontactapi.ABContactAPIFindDuplicatesResultContainer())
    config.setImplementation<gw.webservice.ab.ab1000.abcontactapi.IABContactAPIFindDuplicatesResultFactory>(\ contact, exactMatch -> new gw.webservice.ab.ab1000.abcontactapi.ABContactAPIFindDuplicatesResult(contact, exactMatch))
    config.setImplementation<gw.webservice.ab.ab1000.abcontactapi.IABContactAPISpecialistServiceFactory>(\ service -> new gw.webservice.ab.ab1000.abcontactapi.ABContactAPISpecialistService(service))
    config.setImplementation<IPendingChangesWebUtilExtensions>(\ -> new PendingChangesWebUtil())
    config.setImplementation<IMergeContactsWebUtilExtensions>(\ -> MergeContactsWebUtil.Instance)
    config.setImplementation<AddressBookUIDTupleFactory>(\ -> new gw.webservice.contactapi.ab1000.ABClientAPIAddressBookUIDTuple())
    config.setImplementation<gw.webservice.contactapi.ab900.IABClientAPIAddressBookUIDContainerFactory>(\ -> new gw.webservice.contactapi.ab900.ABClientAPIAddressBookUIDContainer())
    config.setImplementation<gw.webservice.contactapi.ab1000.IABClientAPIAddressBookUIDContainerFactory>(\ -> new gw.webservice.contactapi.ab1000.ABClientAPIAddressBookUIDContainer())
    config.setImplementation<gw.webservice.ab.ab900.abcontactapi.IABContactAPIDocumentInfoFactory>(\ document -> new gw.webservice.ab.ab900.abcontactapi.ABContactAPIDocumentInfo(document))
    config.setImplementation<gw.webservice.ab.ab900.abcontactapi.IABContactAPIDocumentSearchResultContainerFactory>(\ -> new gw.webservice.ab.ab900.abcontactapi.ABContactAPIDocumentSearchResultContainer())
    config.setImplementation<gw.webservice.ab.ab1000.abcontactapi.IABContactAPIDocumentInfoFactory>(\ document -> new gw.webservice.ab.ab1000.abcontactapi.ABContactAPIDocumentInfo(document))
    config.setImplementation<gw.webservice.ab.ab1000.abcontactapi.IABContactAPIDocumentSearchResultContainerFactory>(\ -> new gw.webservice.ab.ab1000.abcontactapi.ABContactAPIDocumentSearchResultContainer())
    config.setImplementation<IAddressBookUIDContainerFactory>(\ -> new AddressBookUIDContainer())
    config.setImplementation<ABPendingChanges>(new PendingChangesWebUtil())
  }
}

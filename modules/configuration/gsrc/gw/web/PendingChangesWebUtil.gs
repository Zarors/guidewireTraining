package gw.web
uses gw.api.contact.PendingChangeContext
uses gw.api.database.Query
uses gw.api.database.IQueryBeanResult
uses gw.plugin.contact.pendingchange.ABPendingChanges
uses gw.webservice.abcontactapihelpers.ABFactory
uses gw.webservice.contactapi.beanmodel.XmlBackedInstance
uses gw.contactmapper.ab1000.ContactIntegrationMapperFactory
uses java.lang.ThreadLocal
uses gw.pl.persistence.core.Bundle

uses java.util.ArrayList
uses gw.transaction.AbstractBundleTransactionCallback
uses gw.api.contact.pendingchanges.DiffDisplays
uses gw.api.web.contact.PendingContactChangeUtil
uses pcf.PendingChanges
uses gw.transaction.Transaction
uses gw.webservice.contactapi.mapping.MappingConstants
uses java.util.HashSet
uses java.util.Set
uses gw.webservice.contactapi.beanmodel.anonymous.elements.XmlBackedInstance_Array
uses gw.webservice.contactapi.beanmodel.anonymous.elements.XmlBackedInstance_Fk
uses gw.api.graph.GraphVisitor
uses gw.api.graph.EntityGraphTraverser
uses gw.api.graph.traverse.TraversalType
uses gw.api.graph.TraversalFilter
uses gw.entity.IEntityType
uses java.util.List

@Export
class PendingChangesWebUtil implements IPendingChangesWebUtil, ABPendingChanges {

  private static var _pendingChangeContext : ThreadLocal<PendingChangeContext> = new ThreadLocal<PendingChangeContext>()
  private static var _keepFieldSet : Set<String> = new HashSet<String> () { MappingConstants.LINK_ID, MappingConstants.EXTERNAL_PUBLIC_ID}

  /**
   * Returns the IQueryBeanResult of all the PendingContactCreateViews to display in the LV
   */
  static function getPendingCreates() : IQueryBeanResult<PendingContactCreateView> {
    return Query.make(PendingContactCreateView).select()
  }

  /**
   * Returns the IQueryBeanResult of all the PendingContactCreateViews to display in the LV
   */
  static function getPendingUpdates() : IQueryBeanResult<PendingContactUpdateView> {
    return Query.make(PendingContactUpdateView).select()
  }

  override property get ClientChangeContext() : PendingChangeContext {
    return _pendingChangeContext.get()    
  }

  override function performPendingUpdate(contactUpdate : PendingContactUpdate, bundle : Bundle) {
    var contactToBeUpdated = bundle.add(contactUpdate.ABContact)
    applyXmlToABContact(contactUpdate.ChangeXML, contactToBeUpdated)
    var clientContext = createClientContextFromPendingChange(contactUpdate, true)
    contactUpdate.ABContact.ExternalUpdateApp = contactUpdate.Application
    contactUpdate.ABContact.ExternalUpdateUser = contactUpdate.AppUserName
    setPendingChangeContext(clientContext, bundle)
  }

  override function performPendingCreate(contactCreate : PendingContactCreate, bundle : Bundle) {
    var clientContext = createClientContextFromPendingChange(contactCreate, false)
    contactCreate.ABContact.ExternalUpdateApp = contactCreate.Application
    contactCreate.ABContact.ExternalUpdateUser = contactCreate.AppUserName
    setPendingChangeContext(clientContext, bundle)
  }

  override function rejectPendingCreate(contactCreate : PendingContactCreate, bundle : Bundle) {
    var clientContext = createClientContextFromPendingChange(contactCreate, false)
    contactCreate.ABContact.ExternalUpdateApp = contactCreate.Application
    contactCreate.ABContact.ExternalUpdateUser = contactCreate.AppUserName
    setPendingChangeContext(clientContext, bundle)
  }

  override function rejectPendingUpdate(contactUpdate : PendingContactUpdate, bundle : Bundle) {
    var clientContext = createClientContextFromPendingChange(contactUpdate, true)
    contactUpdate.ABContact.ExternalUpdateApp = contactUpdate.Application
    contactUpdate.ABContact.ExternalUpdateUser = contactUpdate.AppUserName
    setPendingChangeContext(clientContext, bundle)
  }
  
  static class ClearPendingChangeContextBTC extends  AbstractBundleTransactionCallback {
    
    override function afterCommit(bundle : Bundle, didCommit : boolean ) {
      if(didCommit == true) {
        PendingChangesWebUtil.clearPendingChangeContext()
      }
    }
  }
  
  function setPendingChangeContext(context : PendingChangeContext, bundle : Bundle) {
    _pendingChangeContext.set(context)
    bundle.addBundleTransactionCallback(new ClearPendingChangeContextBTC())    
  }
  
  static function clearPendingChangeContext() {
    _pendingChangeContext.remove()
  }

  /**
   * Apply the given change XML to the given ABContact and return the result.
   * 
   * @param xml the pending change XML as a string
   * @param contactBeforeChanges the ABContact to apply the xml changes to
   * @return the modified ABContact including the changes from the given xml
   */
  override function applyXmlToABContact(xml : String, contactBeforeChanges : ABContact) : ABContact {
    var abContactXML = XmlBackedInstance.parse(xml)
    var linkIDs = getLinkIDList(contactBeforeChanges)
    replaceNullLinkIDWithExternalUniqueID(abContactXML, linkIDs);

    var bp = new ABFactory().updateContact(contactBeforeChanges, abContactXML, false)
    ContactIntegrationMapperFactory.get().populateABContactFromXML(bp)
    return bp.Bean
  }

  /**
   * Build a list of the LinkIDs found on the Contact to check which
   * could be present in the change XML
   * @param contact - the ABContact whose graph should be traversed
   * @return the set of LinkIDs found
   */
  static function getLinkIDList(contact : ABContact) : Set<String> {
    var visitor = new GraphVisitor<KeyableBean>() {
      var ids = new HashSet<String>()
      override function visit(node: KeyableBean) {
        if (node typeis ABLinkable) {
          if (node.LinkID != null) {
            ids.add(node.LinkID)
          }
        }
      }
      public property get LinkIDs() : Set<String> {
        return ids;
      }
      override function edgeTraversed(source: KeyableBean, target: KeyableBean, weight: Object) {
      }
    }

    var traverser = new EntityGraphTraverser(contact)
          .withTraversalType(TraversalType.BREADTH_FIRST)
          .withTypeFilter(new DoNotTraverseOtherABContactsFilter())
    traverser.traverse({visitor})

    return visitor.LinkIDs;
  }

  static function replaceNullLinkIDWithExternalUniqueID(changeXml : XmlBackedInstance, linkIDs : Set<String>) {
    if (changeXml.LinkID == null && changeXml.ExternalUniqueID != null && linkIDs.contains(changeXml.ExternalUniqueID)) {
      changeXml.fieldByName(MappingConstants.EXTERNAL_UNIQUE_ID).setAttributeValue("name", MappingConstants.LINK_ID)
      changeXml.Action = null
    }

    changeXml.Fk.each( \ fk -> {
      if (fk.XmlBackedInstance.LinkID == null) {
        replaceNullLinkIDWithExternalUniqueID(fk.XmlBackedInstance, linkIDs)
      }
    })

    changeXml.Array.each( \ array -> {
      var removedSet = new HashSet<XmlBackedInstance>()
      array.XmlBackedInstance.each( \ arrayItem -> {
        if (arrayItem.LinkID != null && !linkIDs.contains(arrayItem.LinkID)) {
          removedSet.add(arrayItem)
        } else {
          replaceNullLinkIDWithExternalUniqueID(arrayItem, linkIDs)
        }
      })
      for (item in removedSet) {
        array.XmlBackedInstance.remove(item)
      }
    })
  }

  static function stripUnchangedFieldsFromXml(xml : XmlBackedInstance) : XmlBackedInstance {
    xml.Field.removeWhere( \ elt -> (elt.Value == elt.OrigValue) and not(_keepFieldSet.contains(elt.Name)))

    var removeFk = new ArrayList<XmlBackedInstance_Fk>()
    for(fkElem in xml.Fk) {
      var strippedXml = stripUnchangedFieldsFromXml(fkElem.XmlBackedInstance)
      if(not hasEdits(strippedXml)) {
        removeFk.add(fkElem)
      }
    }
    for(rfk in removeFk){
      xml.Fk.remove(rfk)
    }
    var removeArray = new ArrayList<XmlBackedInstance_Array>()
    for(arrayElems in xml.Array) {
      var removeElems = new ArrayList<XmlBackedInstance>()
      for(arrayElem in arrayElems.XmlBackedInstance) {
        var strippedXml = stripUnchangedFieldsFromXml(arrayElem)
        if(not hasEdits(strippedXml)) {
          removeElems.add(arrayElem)
        }
      }
      for(elem in removeElems) {
        arrayElems.XmlBackedInstance.remove(elem)
      }
      if(arrayElems.XmlBackedInstance.Count == 0) {
        removeArray.add(arrayElems)
      }
    }
    for(ra in removeArray) {
      xml.Array.remove(ra)
    }

    return xml
  }

  static function hasEdits(changeXml : XmlBackedInstance) : boolean {
    var hasEdits = false

    if(changeXml.Field.Count > _keepFieldSet.Count && changeXml.Field.countWhere( \ elt -> _keepFieldSet.contains(elt.Name)) == _keepFieldSet.Count) {
      hasEdits = true
    }
    if(changeXml.Fk.Count > 0) {
      hasEdits = true
    }
    if(changeXml.Array.Count > 0) {
      hasEdits = true
    }

    return hasEdits
  }

  static function removeNonEditsFromChangeXml(changeXml : XmlBackedInstance) : XmlBackedInstance {

    var strippedXml = stripUnchangedFieldsFromXml(changeXml)

    return changeXml
  }

  static function createClientContextFromPendingChange(change : PendingContactChange, update : boolean) : PendingChangeContext {

    var updateChangeXML : String = null
    if (update) {
      updateChangeXML = (change as PendingContactUpdate).ChangeXML
    }
    return new PendingChangeContext() {
      :AddressBookUID =  change.ABContact.LinkID,
      :PublicID = change.ABContact.External_PublicID,
      :Username = change.AppUserName,
      :UserDisplayName = change.AppUserDisplayName,
      :RootEntityType = change.AppRootEntityType,
      :RootEntityID = change.AppRootEntityID,
      :RootEntityDisplayName = change.AppRootEntityDisplayName,  
      :ChangeEntityTypeName =  (typeof change).RelativeName,  
      :Resolution = change.Resolution,
      :ResolutionReason = change.ResolutionReasonText,
      :ChangeXML = updateChangeXML
    }
  }
  
  static function rejectionResolutionFilter(values : ContactChangeResolution[]) : List<ContactChangeResolution> {
    var retList = new ArrayList<ContactChangeResolution>()
    for(value in values) {
      if(value != ContactChangeResolution.TC_APPROVED && value != ContactChangeResolution.TC_ALREADY_APPLIED) {
        retList.add(value)
      }
    }
    return retList
  }

  public static function hasChange(pending : PendingContactUpdateView) : Boolean {
    if (pending == null)
      return true

    var pendingUpdate = pending.PendingContactUpdate
    if (pendingUpdate.ChangeXML == null or pendingUpdate.ChangeXML == "") {
      return false
    }
    var diffDisplay = PendingContactChangeUtil.createDiffDisplayTree(pendingUpdate)
  
    if (DiffDisplays.getVisibleChildren(diffDisplay).Empty)
      return false

    return true
  }
  
  public static function rejectAlreadyAppliedPendingChanges(pendingUpdate : PendingContactChange, currentLocation : PendingChanges) {
    Transaction.runWithNewBundle(\ bundle -> {
      pendingUpdate = bundle.add(pendingUpdate)
      pendingUpdate.Resolution = ContactChangeResolution.TC_ALREADY_APPLIED
      pendingUpdate.ResolutionReasonText = "Pending change was already applied"        
    })

    gw.api.web.contact.PendingContactChangeUtil.rejectChange(pendingUpdate, currentLocation)
  }

  private static class DoNotTraverseOtherABContactsFilter implements TraversalFilter<IEntityType> {
    override function shouldTraverse(source : IEntityType , target : IEntityType, attribute : Object) : boolean  {
      return (gw.api.util.TypeUtil.isNominallyOrStructurallyAssignable(ABLinkable.Type, target)) and (not (gw.api.util.TypeUtil.isNominallyOrStructurallyAssignable(ABContact.Type, target)))
    }
  }

}

package gw.web

uses gw.api.database.Query

uses java.lang.Deprecated
uses java.util.ArrayList
uses java.util.Collections
uses gw.api.database.Relop
uses gw.api.locale.DisplayKey

uses java.util.List

/**
 * Helper class used by the Vendor Services card on ABContactDetailScreen.
 * Has a few static methods that VendorDataCardHelper also uses.
 */
@Export
class ContactDetailsVendorHelper {
  private var _contact : ABContact

  construct(c : ABContact) {
    _contact = c
  }

  /**
   * Tells whether to show the vendor services card
   */
  property get VendorServicesCardIsVisible() : boolean {

    return ( _contact.isVendor() or _contact.SpecialistServices.HasElements or
        ( _contact.ChangedFields.HasElements and
            _contact.isArrayElementAddedOrRemoved(ABContact#Tags) and
            _contact.getOriginalValue(ABContact#Tags).hasMatch(\ contactTag -> contactTag.Type == ContactTagType.TC_VENDOR))

    )
  }

  /**
   * Tells whether to show the vendor services editable tree
   */
  @Deprecated
  function isShowServicesEditableTree(editable: boolean) : boolean {
    return editable and _contact.isVendor()
  }

  /**
   * Tells whether to show the vendor services read only list view
   */
  @Deprecated
  function isShowServicesLV(editable: boolean) : boolean {
    return !editable or isShowServicesUnavailableWarning(editable)
  }

  /**
   * Tells whether to show the warning that the contact services are not editable
   */
  function isShowServicesUnavailableWarning(editable: boolean) : boolean {
    return editable and not _contact.isVendor()
  }

  /**
   * Tells whether to show the warning that the contact will lose its services
   */
  property get ShowLossOfServicesWarning() : boolean {
    return _contact.SpecialistServices.Count > 0 and
           (not _contact.TagTypes.contains(ContactTagType.TC_VENDOR))
  }

  /**
   * Tells whether to show the VendorUnavailableMessage
   */
  property get ShowVendorUnavailableMessage() : boolean {
    return _contact.Vendor and 
           _contact.VendorAvailability == VendorAvailabilityType.TC_UNAVAILABLE
  }

  function getAllRows() : List<ServiceRow> {
    if (_contact.Bundle == null) {
      return null
    }
    var allServiceRow =  Query.make(SpecialistService).compare("Parent", Relop.Equals, null).select().toList()
    Collections.sort(allServiceRow, SpecialistService.StandardComparator)
    var allService = allServiceRow.map( \ s -> new ServiceRow(s))
    for (i in allService.size()|..0) {
      if(getChildren(allService.get(i)).Empty) {
        allService.remove(i)
      }
    }
    return allService
  }

  function getChildren(sr : ServiceRow) : List<ServiceRow> {
    var childrenList = sr.Service.Children.toList()
    Collections.sort(childrenList, SpecialistService.StandardComparator)
    var allChildren = childrenList.where( \ elt -> elt.Leaf ? (contactHasService(elt) or elt.Active) : true).map( \ s -> new ServiceRow(s))
    for (i in allChildren.size()|..0) {
      if(!allChildren.get(i).Service.Leaf and getChildren(allChildren.get(i)).Empty) {
        allChildren.remove(i)
      }
    }
    return allChildren
  }

  function hasInactiveService() : boolean {
    for (service in _contact.SpecialistServices){
      if (!service.Active) {
        return true
      }
    }
    return false
  }

  /**
   * Returns the rows for the services LV.  If it's editable we show
   * all services, if it's read only we only show the contact's services.
   */
  @Deprecated
  function getRows(editable : boolean) : List<ServiceRow> {
    var services : List<SpecialistService>
    if (editable and not isShowServicesUnavailableWarning(editable)) {
      // find all leaf services
      var specialistServiceQuery = Query.make(SpecialistService)
      var specialistServiceParentQuery = Query.make(SpecialistServiceParent)
      specialistServiceQuery.subselect(
        SpecialistService#ID.PropertyInfo.Name, 
        CompareNotIn, 
        specialistServiceParentQuery, 
        SpecialistServiceParent#ForeignEntity.PropertyInfo.Name)
      
      services = specialistServiceQuery.select().toList()
    }

    else {
      services = _contact.SpecialistServices
    }

    return sortServices(services)
      .map(\ s -> new ServiceRow(s))
  }

  /**
   * Returns the rows for the contact's services.
   */
  property get Rows() : List<ServiceRow> {
    var services = _contact.SpecialistServices
    return sortServices(services)
        .map(\ s -> new ServiceRow(s))
  }
  
  /**
   * This is a row in the LV representing a service
   */
  class ServiceRow {
    private var _service : SpecialistService
    
    construct(s : SpecialistService) {
      _service = s
    }
    
    property get Service() : SpecialistService {
      return _service
    }

    function getServiceNamePart(index : int) : String {
      return serviceNamePart(_service, index)
    }
    @Deprecated
    function toggleService() {
      var services = _contact.SpecialistServices
      if (services.contains(_service)) {
        services.remove(_service)
      }
      else {
        services.add(_service)
      }

      _contact.SpecialistServices = services
    }

    property get ContactHasService() : boolean {
      return contactHasService(_service)
    }

    property set ContactHasService(b : boolean) {
      var services = _contact.SpecialistServices
      if (b) {
        services.add(_service)
      }
      else {
        services.remove(_service)
      }

      _contact.SpecialistServices = services
    }
    @Deprecated
    property get Icon() : String {
      if (ContactHasService) {
        if (_service.Leaf) {
          return "completed"
        } else {
          return "warning"
        }
      } else {
        if (_service.Leaf) {
          return "closed"
        }
      }
      return ""
    }

  }

  /**
   * VendorAvailability can never be null when it's visible in the UI, so this sets
   * it to Available when necessary. 
   */
  public function fixInMemoryContactForVendorTagRequirements() {
    if (_contact.TagTypes.contains(ContactTagType.TC_VENDOR)) {
      if (_contact.VendorAvailability == null)
        _contact.VendorAvailability = VendorAvailabilityType.TC_AVAILABLE
    }
  }
  
  public static function serviceNamePart(service : SpecialistService, index : int) : String {
    var nameParts : List<String>

    nameParts = new ArrayList<String>()
    var s = service
    while (s != null) {
      nameParts.add(s.DisplayName)
      s = s.Parent
    }
    nameParts = nameParts.reverse()
    return index < nameParts.size() ? nameParts.get(index) : ""
  }

  public static function sortServices(services : List<SpecialistService>) : List<SpecialistService> {
    return services.sort(\ service1, service2 -> { 
      // this returns true if service1 is before service2
      var i = 0
      while (true) {
        var service1part = serviceNamePart(service1, i)
        var service2part = serviceNamePart(service2, i)
        if (service1part == "" and service2part == "")
          return true
        var order = service1part.compareTo(service2part)
        if (order != 0)
          return order < 0
        i++
      }
    })
  }

  /**
   * Check whether the selected services are leaves. Otherwise, does not allow adding those services.
   * @param selectedServices
   */
  public function validateServices( selectedServices: SpecialistService[]) {
    var nonLeafSelectedServices = selectedServices.where(\s -> !s.Leaf)
    if(nonLeafSelectedServices.HasElements){
      throw new gw.api.util.DisplayableException(DisplayKey.get("Java.ABContact.Vendor.OnlyLeafServicesAllowedOnContact", nonLeafSelectedServices*.DisplayName.join(",")))
    }
  }

  
  //
  // private 
  //
  
  private function contactHasService(service : SpecialistService) : boolean {
    return _contact.SpecialistServices.map(\ s -> s.Code).contains(service.Code)
  }

}

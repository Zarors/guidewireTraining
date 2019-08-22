package gw.web.merge

uses gw.api.system.ABLoggerCategory
uses java.util.HashMap
uses java.lang.IllegalStateException
uses gw.web.ContactDetailsVendorHelper
uses java.util.List

@Export
class VendorDataCardHelper {
  private static var _logger = ABLoggerCategory.AB
  
  private var _keptContact : ABContact
  private var _retiredContact : ABContact
  private var _mergedContact : ABContact
  
  private var _mergedVendorValuesInitialized = false

  construct(
    keptContact : ABContact,
    retiredContact : ABContact,
    mergedContact : ABContact) {

    _keptContact = keptContact
    _retiredContact = retiredContact
    _mergedContact = mergedContact
  }

  property get KeptContactHasVendorTag() : boolean {
    return hasVendorTag(_keptContact)
  }
  
  property get RetiredContactHasVendorTag() : boolean {
    return hasVendorTag(_retiredContact)
  }
  
  /**
   * Controls the editability of the merged contact's "has vendor tag" checkbox.
   * If Vendor is the only tag, we don't want to let them remove it.
   */
  property get MergedContactHasVendorTagEditable() : boolean {
    return not (hasVendorTag(_mergedContact) and _mergedContact.Tags.Count == 1)
  }
  
  property get MergedContactHasVendorTag() : boolean {
    return hasVendorTag(_mergedContact)
  }
  
  property set MergedContactHasVendorTag(hasVendorTag : boolean) {
    var tags = _mergedContact.TagTypes.toSet()
    if (hasVendorTag) {
      tags.add(ContactTagType.TC_VENDOR)
      
      // Set the merged contact's VendorAvailability initial value.
      // Normally the initial value for the merged contact comes from the kept
      // contact, but what if the kept contact is not a vendor so it has null
      // VendorAvailability?  The merged contact can't have null VendorAvailability
      // if it has the Vendor tag.  So we use the retired contact's VendorAvailability.
      // If the kept contact and retired contact both have null VendorAvailability
      // then that means neither has the Vendor tag and the Vendor Data card will be
      // hidden, so we should never get here.
      if (not _mergedVendorValuesInitialized) {
        var useRetiredContactVendorValues = !_keptContact.Vendor
        if (_mergedContact.VendorAvailability == null) {
          _mergedContact.VendorAvailability = useRetiredContactVendorValues ?
            _retiredContact.VendorAvailability : _keptContact.VendorAvailability

          // I didn't make this a display key because it should never happen.
          if (_mergedContact.VendorAvailability == null) {
            var e = new IllegalStateException("_mergedContact.VendorAvailability shouldn't be null now")
            _logger.error(e.getLocalizedMessage(), e)
            throw e
          }
        }

        // do the same thing for VendorUnavailableMessage
        if (_mergedContact.VendorAvailability == VendorAvailabilityType.TC_UNAVAILABLE and
            _mergedContact.VendorUnavailableMessage == null) {

          _mergedContact.VendorUnavailableMessage = useRetiredContactVendorValues ?
            _retiredContact.VendorUnavailableMessage : _keptContact.VendorUnavailableMessage
        }
        
        _mergedVendorValuesInitialized = true
      }
    }
    else {
      tags.remove(ContactTagType.TC_VENDOR)
    }
    _mergedContact.TagTypes = tags?.toTypedArray()
  }
  
  property get ShowVendorUnavailableMessage() : boolean {
    return MergedContactHasVendorTag and
           _mergedContact.VendorAvailability == VendorAvailabilityType.TC_UNAVAILABLE
  }
  
  property get ServiceRows() : List<ServiceRow> {
    var codeToServiceMap = new HashMap<String,SpecialistService>()
    _keptContact.SpecialistServices.each(\ s -> 
      codeToServiceMap.put(s.Code, s))
    _retiredContact.SpecialistServices.each(\ s -> 
      codeToServiceMap.put(s.Code, s))
    
    var rows = ContactDetailsVendorHelper.sortServices(codeToServiceMap.values().toList())
      .map(\ s -> new ServiceRow(s))

    return rows
  }
  
  property get ShowVendorDataCard() : boolean {
    return hasVendorTag(_keptContact) or hasVendorTag(_retiredContact)
  }
  

  /**
   * Corresponds to a service row in the LV
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
      return ContactDetailsVendorHelper.serviceNamePart(_service, index)
    }
    
    property get KeptContactHasService() : boolean {
      return hasService(_keptContact)
    }
    
    property get RetiredContactHasService() : boolean {
      return hasService(_retiredContact)
    }
    
    property get MergedContactHasService() : boolean {
      return hasService(_mergedContact)
    }
    
    property set MergedContactHasService(hs : boolean)  {
      var services = _mergedContact.SpecialistServices
      if (hs) {
        services.add(_service)
      }
      else {
        services.remove(_service)
      }
      
      _mergedContact.SpecialistServices = services
        
    }
    
    private function hasService(contact : ABContact) : boolean {
      return contact.SpecialistServices.map(\ s -> s.Code).contains(_service.Code)
    }
  }
  

  
  // 
  //    Private
  //

  private function hasVendorTag(contact : ABContact) : boolean {
    return contact.TagTypes.contains(ContactTagType.TC_VENDOR)
  }

}

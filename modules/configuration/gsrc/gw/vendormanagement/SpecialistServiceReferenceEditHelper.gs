package gw.vendormanagement
uses java.lang.IllegalArgumentException
uses java.util.ArrayList
uses gw.api.database.Query
uses java.util.Collections
uses gw.lang.reflect.features.PropertyReference
uses java.util.List

@Export
class SpecialistServiceReferenceEditHelper {

  private var _referrer : Object
  private var _referrerProperty : PropertyReference<Object,SpecialistService>
  private var _hierarchyLevel : int as readonly ServiceHierarchyLevel

  construct(referrer : Object, referrerProperty : PropertyReference<Object,SpecialistService>, hierarchyLevel : int) {
    _referrer = referrer
    _referrerProperty = referrerProperty
    _hierarchyLevel = hierarchyLevel
  }

  construct(referrer : Object, hierarchyLevel : int) {
    _referrer = referrer
    _hierarchyLevel = hierarchyLevel
  }

  private property get ReferencedServiceAncestry() : List<SpecialistService> {
    return _referrerProperty != null ? _referrerProperty.get(_referrer).Ancestry : (_referrer as SpecialistService).Ancestry as List<SpecialistService>
  }

  /**
   * Returns the value of this property
   */
  property get Value() : SpecialistService {
    var ancestry = ReferencedServiceAncestry
    return _hierarchyLevel < ancestry.Count ? ancestry[_hierarchyLevel] : null
  }

  /**
   * Sets the value of this property if it is different from the current value.
   */
  property set Value(newVal : SpecialistService) {
    if (newVal != Value) {
      if (newVal != null) {
        var newValAncestry = newVal.Ancestry
        if (newValAncestry.Count-1 != _hierarchyLevel) {
          throw new IllegalArgumentException("new value (" + newVal.Code + ") does not appear at hierarchy level " + _hierarchyLevel)
        }
        _referrerProperty.set(_referrer, newVal)
      } else {
        if (_hierarchyLevel == 0) {
          _referrerProperty.set(_referrer, null)
        } else {
          var currentValAncestry = Value.Ancestry
          if (_hierarchyLevel <= currentValAncestry.Count-1) {
            _referrerProperty.set(_referrer, currentValAncestry[_hierarchyLevel-1])
          } // else a null value is consistent with the current value, so do nothing
        }
      }
    }
  }

  property get RootSpecialistServices() : List<SpecialistService> {
      return Query.make(SpecialistService)
                  // find all root SpecialistServices -- those without a parent
                  .subselect(SpecialistService#ID, CompareNotIn, SpecialistServiceParent#Owner)
                  .select()
                  .toList()
  }

  /**
   * Returns the possible values for this property, sorted by Name. No guarantees
   * are made about which bundle the results appear in.
   */
  property get ValueRange() : List<SpecialistService> {
    var result : List<SpecialistService>
    if (_hierarchyLevel == 0) {
      result = RootSpecialistServices
    } else {
      var ancestry = ReferencedServiceAncestry
      if (_hierarchyLevel-1 < ancestry.Count) {
        result = ancestry[_hierarchyLevel-1].Children.toList()
      } else {
        result = new ArrayList<SpecialistService>()
      }
    }
    Collections.sort(result, SpecialistService.StandardComparator)
    return result
  }
}

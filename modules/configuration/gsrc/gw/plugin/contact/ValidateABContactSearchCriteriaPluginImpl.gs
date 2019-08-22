package gw.plugin.contact

uses java.util.Map

/**
 * Base implementation of the ABContact search criteria plugin interface.
 * Users may override satisfiesNoLocaleSpecificCriteriaRequirements() to provide Locale-specific search criteria.
 */
@Export
class ValidateABContactSearchCriteriaPluginImpl extends ValidateABContactSearchCriteriaPluginBase {

  override function initSubtypeSpecificValidation(): Map<typekey.ABContact, ABContactSubtypeLogic> {
    return {
        typekey.ABContact.TC_ABCONTACT     -> new SearchLogic(\sc -> abContactCanSearch(sc)),
        typekey.ABContact.TC_ABCOMPANY     -> new SearchLogic(\sc -> abCompanyCanSearch(sc)),
        typekey.ABContact.TC_ABPERSON      -> new SearchLogic(\sc -> abPersonCanSearch(sc)),
        typekey.ABContact.TC_ABUSERCONTACT -> new SearchLogic(\sc -> abUserCanSearch(sc)),
        typekey.ABContact.TC_ABPLACE       -> new SearchLogic(\sc -> abPlaceCanSearch(sc))
    }
  }
}

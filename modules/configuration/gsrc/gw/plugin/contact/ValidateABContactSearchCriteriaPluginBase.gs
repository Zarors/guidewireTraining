package gw.plugin.contact

uses gw.api.webservice.addressbook.contactapi.ABContactSearchSpecWithoutPaging
uses java.util.Map
uses gw.api.system.PLConfigParameters
uses gw.api.contact.ContactSubtypeSpecificException
uses gw.api.contact.ContactSearchWithServiceCriteriaException
uses gw.api.contact.TooLooseContactSearchCriteriaException

/**
 * Abstract base implementation ValidateABContactSearchCriteriaPlugin.
 */
@Export
abstract class ValidateABContactSearchCriteriaPluginBase implements ValidateABContactSearchCriteriaPlugin {

  final var _subtypeSpecificLogic : Map<typekey.ABContact, ABContactSubtypeLogic> = {
      typekey.ABContact.TC_ABCONTACT     -> new SearchLogic(\ sc -> abContactCanSearch(sc)),
      typekey.ABContact.TC_ABCOMPANY     -> new SearchLogic(\ sc -> abCompanyCanSearch(sc)),
      typekey.ABContact.TC_ABPERSON      -> new SearchLogic(\ sc -> abPersonCanSearch(sc)),
      typekey.ABContact.TC_ABUSERCONTACT -> new SearchLogic(\ sc -> abUserCanSearch(sc)),
      typekey.ABContact.TC_ABPLACE       -> new SearchLogic(\ sc -> abPlaceCanSearch(sc))
  }

  protected abstract function initSubtypeSpecificValidation() : Map<typekey.ABContact, ABContactSubtypeLogic>


  /**
   * Interface method for ValidateABContactSearchCriteriaPlugin that delegates
   * to a subtype specific subclass of ABContactSubtypeLogic.
   */
  override function validateCanSearch(searchCriteria : ABContactSearchCriteria, searchSpec : ABContactSearchSpecWithoutPaging) : ValidateABContactSearchCriteriaPluginResult {
    var v = canSearch(searchCriteria)
    var em : String
    if (!v) {
      var country = searchCriteria.Address.Country ?: gw.api.admin.BaseAdminUtil.getDefaultCountry()

      if (searchSpec != null && searchSpec.Locale == null) { //default search locale if no locale is passed in
        searchSpec.Locale = LocaleType.get(PLConfigParameters.DefaultApplicationLocale.Value)
      }

      var exception:ContactSubtypeSpecificException = null
      if (searchCriteria.SpecialistServices != null and searchCriteria.SpecialistServices.Count > 0) {
        exception = new ContactSearchWithServiceCriteriaException(
            searchCriteria.ContactSubtypeType, country, searchSpec.Locale)
      } else {
        exception = new TooLooseContactSearchCriteriaException(
            searchCriteria.ContactSubtypeType, country, searchSpec.Locale)
      }
      em = exception.Message
    }

    return new ValidateABContactSearchCriteriaPluginResult() {
      override property get Valid() : boolean { return v }
      override property get ErrorMessage() : String { return em }
    }
  }

  /**
   * Interface method implementation from ValidateABContactSearchCriteriaPlugin.
   * The implementation basically delegates to a subtype specific subclass of
   * ABContactSubtypeLogic.
   */
  private function canSearch(searchCriteria : ABContactSearchCriteria) : boolean {
    var logic = ABContactSubtypeLogic.getLogic(searchCriteria.ContactSubtype, _subtypeSpecificLogic)
    if (logic == null) {
      return true
    }
    if (meetSpecialistServicesCriteria(searchCriteria)) {
      return true
    }
    return logic.execute(searchCriteria)
  }


  /**
   * Delegate inner class for ABCompany subtypes
   */
  public class SearchLogic extends ABContactSubtypeLogic {
    private var _call : block(searchCriteria : ABContactSearchCriteria) : boolean

    construct(call : block(searchCriteria : ABContactSearchCriteria) : boolean) {
      _call = call
    }

    override function execute(bean : Object) : boolean {
      var searchCriteria = (bean as ABContactSearchCriteria)
      return _call(searchCriteria)
    }
  }



  //
  //  Subtype specific "can search" methods
  //

  protected function abCompanyCanSearch(searchCriteria : ABContactSearchCriteria) : boolean {
    if (searchCriteria.Keyword == null
        and searchCriteria.KeywordKanji == null
        and searchCriteria.TaxID == null
        and satisfiesNoLocaleSpecificCriteriaRequirements(searchCriteria)
        and searchCriteria.Address.PostalCode == null
        and not searchCriteria.isValidProximitySearch()) {
      return false
    }
    return true
  }


  protected function abPersonCanSearch(searchCriteria : ABContactSearchCriteria) : boolean {
    if (searchCriteria.FirstName != null or searchCriteria.FirstNameKanji != null) {
      if (searchCriteria.Keyword == null and searchCriteria.KeywordKanji == null) {
        return false
      }
    }
    if (searchCriteria.Keyword == null
        and searchCriteria.KeywordKanji == null
        and searchCriteria.FirstName == null
        and searchCriteria.FirstNameKanji == null
        and searchCriteria.TaxID == null
        and satisfiesNoLocaleSpecificCriteriaRequirements(searchCriteria)
        and searchCriteria.Address.PostalCode == null
        and not searchCriteria.isValidProximitySearch()) {
      return false
    }
    return true
  }


  protected function abUserCanSearch(searchCriteria : ABContactSearchCriteria) : boolean {
    if (searchCriteria.Keyword == null
        and searchCriteria.KeywordKanji == null
        and searchCriteria.FirstName == null
        and searchCriteria.FirstNameKanji == null
        and searchCriteria.EmployeeNumber == null
        and satisfiesNoLocaleSpecificCriteriaRequirements(searchCriteria)
        and searchCriteria.Address.PostalCode == null
        and not searchCriteria.isValidProximitySearch()) {
      return false
    }
    return true
  }


  protected function abPlaceCanSearch(searchCriteria : ABContactSearchCriteria) : boolean {
    if (searchCriteria.Keyword == null
        and searchCriteria.KeywordKanji == null
        and satisfiesNoLocaleSpecificCriteriaRequirements(searchCriteria)
        and searchCriteria.Address.PostalCode == null
        and not searchCriteria.isValidProximitySearch()) {
      return false
    }
    return true
  }


  protected function abContactCanSearch(searchCriteria : ABContactSearchCriteria) : boolean {
    if (searchCriteria.Keyword == null
        and searchCriteria.KeywordKanji == null
        and searchCriteria.FirstName == null
        and searchCriteria.FirstNameKanji == null
        and searchCriteria.TaxID == null
        and searchCriteria.EmployeeNumber == null
        and satisfiesNoLocaleSpecificCriteriaRequirements(searchCriteria)
        and searchCriteria.Address.PostalCode == null
        and not searchCriteria.isValidProximitySearch()) {
      return false
    }
    return true
  }


  /**
   * Function that locale-specific subclasses may override to determine if the
   * locale information should pass validation. This base implementation expects
   * a combination of City and State, but some locales may not have any concept
   * of state, or may have different requirements altogether.
   */
  protected function satisfiesNoLocaleSpecificCriteriaRequirements(searchCriteria: ABContactSearchCriteria) : boolean {
    var country = searchCriteria.Address.Country ?: gw.api.admin.BaseAdminUtil.getDefaultCountry()
    if (country == Country.TC_US || country == Country.TC_CA || country == Country.TC_AU) {
      return searchCriteria.Address.City == null or searchCriteria.Address.State == null
    } else if (country == Country.TC_JP) {
      return (searchCriteria.Address.City == null and searchCriteria.Address.CityKanji == null) or searchCriteria.Address.State == null
    } else {
      return searchCriteria.Address.City == null
    }
  }

  /*
   * Search should be valid as long as SearchCriteria contains SpecialistServices and (State or PostalCode)
   */
  protected function meetSpecialistServicesCriteria(searchCriteria : ABContactSearchCriteria) : boolean {
    if (searchCriteria.SpecialistServices != null and searchCriteria.SpecialistServices.Count > 0) {
      if ((searchCriteria.Address.State != null) or (searchCriteria.Address.PostalCode != null))
        return true
    }
    return false
  }

}
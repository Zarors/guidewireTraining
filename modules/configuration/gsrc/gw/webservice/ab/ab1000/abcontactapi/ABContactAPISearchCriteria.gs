package gw.webservice.ab.ab1000.abcontactapi

uses entity.Address
uses gw.api.database.Queries
uses gw.api.database.Query
uses gw.api.locale.DisplayKey
uses gw.api.system.ABConfigParameters
uses gw.api.system.ABLoggerCategory
uses gw.api.webservice.exception.SOAPSenderException
uses gw.pl.persistence.core.Bundle

/**
 * Search criteria used by ABContactAPI.searchContact.
 */
// Make @Export because it corresponds to the ABContact entity which the customer may extend.
@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/ab/ws/gw/webservice/ab/ab1000/abcontactapi/ABContactAPISearchCriteria" )
final class ABContactAPISearchCriteria implements IABContactAPISearchCriteria {
  private static var _logger = ABLoggerCategory.ABContactAPI
  
  public var ContactType      : typekey.ABContact
  public var FirstName        : String
  public var FirstNameKanji   : String
  public var Keyword          : String
  public var KeywordKanji     : String
  public var OrganizationName : String
  public var PreferredVendors : Boolean
  public var TaxID            : String
  public var EmployeeNumber   : String
  public var Score            : Integer
  
  public var AdjudicativeDomain  : typekey.AdjudicativeDomain
  public var AttorneySpecialty   : LegalSpecialty
  public var DoctorSpecialty     : SpecialtyType
  public var LawFirmSpecialty    : LegalSpecialty
  public var MedicalOrgSpecialty : SpecialtyType
  public var VendorType          : typekey.VendorType
  public var VendorAvailability  : String

  public var Address                   : ABContactAPIAddressSearch
  public var ProximitySearchCenter     : ABContactAPIAddressSearch
  public var ProximitySearchParameters : ABContactAPIProximitySearchParameters
  public var Tags                      : ContactTagType[]
  public var AllTagsRequired           : Boolean
  public var SpecialistServiceCodes        : String[]

  construct() { }

  override function toSearchCriteria(b : Bundle) : ABContactSearchCriteria {
    var criteria = new ABContactSearchCriteria(b) {
      :ContactSubtype      = this.ContactType,
      :FirstName           = this.FirstName,
      :FirstNameKanji      = this.FirstNameKanji,
      :Keyword             = this.Keyword,
      :KeywordKanji        = this.KeywordKanji,
      :OrganizationName    = this.OrganizationName,
      :PreferredVendors    = this.PreferredVendors,
      :TaxID               = this.TaxID,
      :EmployeeNumber      = this.EmployeeNumber,
      :Score               = this.Score,
      :AdjudicativeDomain  = this.AdjudicativeDomain,
      :AttorneySpecialty   = this.AttorneySpecialty,
      :DoctorSpecialty     = this.DoctorSpecialty,
      :LawFirmSpecialty    = this.LawFirmSpecialty,
      :MedicalOrgSpecialty = this.MedicalOrgSpecialty,
      :VendorType          = this.VendorType,
      :VendorAvailability  = VendorAvailabilityType.get(this.VendorAvailability),
      :AllTagsRequired     = this.AllTagsRequired
    }

    if (criteria.Address == null) criteria.Address = new Address(b)
    if (criteria.ProximitySearchCenter == null) criteria.ProximitySearchCenter = new Address(b)
    if (criteria.ProximitySearchParameters == null) criteria.ProximitySearchParameters = new ProximitySearchParameters(b)
    populateAddressCriteria(criteria.Address, this.Address)
    populateAddressCriteria(criteria.ProximitySearchCenter, this.ProximitySearchCenter)
    populateProximitySearchParameters(criteria.ProximitySearchParameters, this.ProximitySearchParameters)

    if (this.Tags != null) {
      for (tagType in this.Tags) {
        criteria.addToTags(new ABContactSearchCriteriaTag(b) {
          :Type = tagType
        })
      }
    }

    // throw if we get a bad VendorAvailability
    if (criteria.VendorAvailability == null and this.VendorAvailability != null) {
      var errorMessage = DisplayKey.get("Webservice.ABContactAPI.BadVendorAvailabilityType", this.VendorAvailability)
      _logger.error(errorMessage)
      throw new SOAPSenderException(errorMessage)
    }

    if (this.SpecialistServiceCodes != null) {
      if(this.SpecialistServiceCodes.Count > ABConfigParameters.MaxNumberServicesInSearchQuery.Value) {
        var errorMessage = DisplayKey.get("Java.Contact.Search.TooManyServicesForQuery")
        _logger.error(errorMessage)
        throw new SOAPSenderException(errorMessage)
      }
      for (specialistServiceCode in this.SpecialistServiceCodes) {
        var ss = findSpecialistServiceByCode(specialistServiceCode)

        // error checking
        if (ss == null) {
          var errorMessage = DisplayKey.get("Webservice.ABContactAPI.BadSpecialistServiceCode", specialistServiceCode)
          _logger.error(errorMessage)
          throw new SOAPSenderException(errorMessage)
        }
        if (ss.Children.Count > 0){
          var errorMessage = DisplayKey.get("Webservice.ABContactAPI.OnlyLeafServicesAllowedInSearch", specialistServiceCode)
          _logger.error(errorMessage)
          throw new SOAPSenderException(errorMessage)
        }

        criteria.addToSpecialistServices(new ABContactSearchCriteriaSpecialistService(b) {
          :SpecialistService = ss
        })
      }
    }

    return criteria
  }


  //
  //     Private
  //


  private function findSpecialistServiceByCode(code : String) : SpecialistService {
    var query : Query<SpecialistService> = Queries.createQuery(SpecialistService)
    query.compare(SpecialistService#Code.PropertyInfo.Name, Equals, code)
    return query.select().FirstResult // null if there isn't any
  }

  private function populateAddressCriteria(addressCriteria : Address, info: ABContactAPIAddressSearch) {
    addressCriteria.City = info.City
    addressCriteria.CityKanji = info.CityKanji
    addressCriteria.State = info.State
    addressCriteria.PostalCode = info.PostalCode
    addressCriteria.Country = info.Country
  }

  private function populateProximitySearchParameters(params : ProximitySearchParameters, info : ABContactAPIProximitySearchParameters) {
    params.DistanceBasedSearch = info.DistanceBasedSearch
    params.Number = info.Number
    params.UnitOfDistance = info.UnitOfDistance
    params.GeocodeStatus = info.GeocodeStatus
    params.SpatialPoint = info.SpatialPoint
    params.SavedSearchCenter = info.SavedSearchCenter
    params.CorrectedSearchCenter = info.CorrectedSearchCenter
  }
}

package gw.api.data

uses gw.api.databuilder.DocumentBuilder
uses gw.api.databuilder.UniqueKeyGenerator
uses gw.api.system.ABLoggerCategory
uses gw.api.util.DateUtil
uses gw.transaction.Transaction
uses gw.sampledata.SampleSpecialistServicesBase
uses gw.api.database.Query
uses gw.api.databuilder.AddressBuilder
uses java.util.ArrayList
uses java.util.List


/** 
 * Base class for DataSetsHelpers.  Provides some common functionality.
 */
@Export
abstract class DataSetsHelperBase {
  /**
   * Generates sample data SpecialistService if they haven't already been created
   */
  protected function generateSpecialistServices() {
    // see if they're already created
    var autoService = Query.make(entity.SpecialistService)
        .compare(SpecialistService#Code, Equals, "auto").select().AtMostOneRow
    if (autoService != null) {
      return
    }
    Transaction.runWithNewBundle(\ bundle -> {
      SampleSpecialistServicesBase.getSampleSpecialistServices(bundle)
    })
  }


  /**
   * Creates a builder for a California home address
   */
  protected function caHomeAddressBuilder(
    addressLine1 : String,
    city : String,
    postalCode : String) : AddressBuilder {
    
    return addressBuilder(AddressType.TC_HOME, addressLine1, city, State.TC_CA, postalCode, Country.TC_US)
  }

  /**
   * Creates a builder for a California business address
   */
  protected function caBusinessAddressBuilder(
    addressLine1 : String,
    city : String,
    postalCode : String) : AddressBuilder {
    
    return addressBuilder(AddressType.TC_BUSINESS, addressLine1, city, State.TC_CA, postalCode, Country.TC_US)
  }

  /**
   * Creates a builder for a California business address
   */
  protected function caBillingAddressBuilder(
    addressLine1 : String,
    city : String,
    postalCode : String) : AddressBuilder {
    
    return addressBuilder(AddressType.TC_BILLING, addressLine1, city, State.TC_CA, postalCode, Country.TC_US)
  }


  protected function addressBuilder(
    addressType : AddressType,
    addressLine1 : String,
    city : String,
    state : State,
    postalCode : String,
    country : Country) : AddressBuilder {
      
    return new AddressBuilder()
      .withAddressType(addressType)
      .withAddressLine1(addressLine1)
      .withCity(city)
      .withState(state)
      .withPostalCode(postalCode)
      .withCountry(country)
  }
  
  protected function servicesFromCodes(codes : List<String>) : List<SpecialistService> {
    if(codes == null or codes.Count == 0) {
      return new ArrayList<SpecialistService>()
    }

    var services = Query.make(SpecialistService)
      .compareIn(SpecialistService#Code, codes?.toTypedArray())
      .select().toList()

    // error handling
    if (services.size() != codes.size()) {
      var gotCodes = services.map(\ service -> service.Code)
      var missing = new ArrayList<String>()
      codes.each(\ code -> { 
        if (!gotCodes.contains(code))
          missing.add(code)
      })
      throw "Missing services: " + missing.join(", ")
    }

    return services
  }

  protected function linkDocument (abContactList: List<ABContact>, obsolete : boolean) {

    // Documents cannot be linked when the IDCS is disabled
    if (gw.plugin.Plugins.isEnabled(gw.plugin.document.IDocumentContentSource)) {

      var publicId = "dms:"+ UniqueKeyGenerator.get().nextInteger()
      var docName = "Doc-"+ UniqueKeyGenerator.get().nextID()
      var docID = "DocIdentifier-"+ UniqueKeyGenerator.get().nextInteger()

      var bundle = abContactList[0].Bundle
      var document = new DocumentBuilder()
          .withAuthor(User.util.CurrentUser.DisplayName)
          .withDescription("Doc-" + UniqueKeyGenerator.get().nextInteger())
          .withType(DocumentType.TC_SLA)
          .withStatus(DocumentStatusType.TC_APPROVED)
          .withObsolete(obsolete)
          .withPublicId(publicId)
          .withDocumentIdentifier(docID)
          .withDateModified(DateUtil.currentDate())
          .withName(docName)
          .create(bundle)
      bundle.commit()
      for(abContact in abContactList){
        abContact = bundle.add(abContact)
        abContact.addToDocuments(document)
      }
      bundle.commit()
    } else {
      ABLoggerCategory.DOCUMENT.warn("IDocumentContentSource is not enabled so documents are not linked to the data sets.")
    }

  }

}

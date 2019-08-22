package gw.contactmapper.ab900

uses gw.webservice.contactapi.mapping.PropertyMapping
uses java.util.Set


/**
 * Use this file to map between ContactManager entities in the ABContact graph and 
 * XmlBackedInstance objects that represent the ABContact graph in XML.
 */
@Export
public class ContactMapper extends ContactMapperABBase {

  construct() {}
  
  /**
   * Returns the set of mapped properties used to integrate ContactManager with 
   * another app.  These properties are used to translate between entities in the 
   * ABContact graph ("beans") and the XML sent to and from ContactManager.
   * 
   * By default, mappings are in both directions, "to XML" and "to bean".  For 
   * mappings that should only be used for one direction, use 
   *   .withMappingDirection(TO_XML) or
   *   .withMappingDirection(TO_BEAN)
   * 
   * When mapping LinkID, use the TO_XML direction:
   *   fieldMapping(Accident_Ext#LinkID)
   *     .withMappingDirection(TO_XML)
   * 
   * For simple fields, use
   *   fieldMapping(Entity#Property)
   * 
   * For foreign keys to child objects use, use
   *   fkMapping(Entity#Property)
   * and fieldMapping() for the properties on the child entity.  Example: Suppose the 
   * Contact data model was extended with DrivingHabits_Ext foreign key.  This would 
   * be added to the code:
   *   fkMapping(Contact#DrivingHabits_Ext)
   *   fieldMapping(DrivingHabits_Ext#LinkID)
   *     .withMappingDirection(TO_XML),
   *   fieldMapping(DrivingHabits_Ext#External_PublicID),
   *   fieldMapping(DrivingHabits_Ext#External_UniqueID),
   *   fieldMapping(DrivingHabits_Ext#MilesPerWeek)
   *   fieldMapping(DrivingHabits_Ext#CommuteDistance)
   *   fieldMapping(DrivingHabits_Ext#Carpools)
   * 
   * For arrays of child objects use, use
   *   arrayMapping(Entity#Property)
   * and fieldMapping() for the properties on the child entity.  Example: Suppose the 
   * Contact data model was extended with AccidentHistory_Ext array of Accident_Ext 
   * objects.  This would be added to the code:
   *   arrayMapping(Contact#AccidentHistory_Ext)
   *   fieldMapping(Accident_Ext#LinkID)
   *     .withMappingDirection(TO_XML),
   *   fieldMapping(Accident_Ext#External_PublicID),
   *   fieldMapping(Accident_Ext#External_UniqueID),
   *   fieldMapping(Accident_Ext#AccidentDate)
   *   fieldMapping(Accident_Ext#DamageCost)
   *   fieldMapping(Accident_Ext#DriverAtFault)
   */
  override property get Mappings() : Set<PropertyMapping> {
    return {
      
      // ABContact
      fieldMapping(ABContact#LinkID)
        .withMappingDirection(TO_XML),
      fieldMapping(ABContact#External_PublicID),
      fieldMapping(ABContact#External_UniqueID),
      fieldMapping(ABContact#EmailAddress1),
      fieldMapping(ABContact#EmailAddress2),
      fieldMapping(ABContact#FaxPhone),
      fieldMapping(ABContact#FaxPhoneCountry),
      fieldMapping(ABContact#FaxPhoneExtension),
      fieldMapping(ABContact#HomePhone),
      fieldMapping(ABContact#HomePhoneCountry),
      fieldMapping(ABContact#HomePhoneExtension),
      fieldMapping(ABContact#Name),
      fieldMapping(ABContact#NameKanji),
      fieldMapping(ABContact#Notes),
      fieldMapping(ABContact#Preferred),
      fieldMapping(ABContact#VendorAvailability),
      fieldMapping(ABContact#VendorUnavailableMessage),
      fieldMapping(ABContact#PreferredCurrency),
      fieldMapping(ABContact#PrimaryPhone),
      fieldMapping(ABContact#Score),
      fieldMapping(ABContact#TaxID),
      fieldMapping(ABContact#TaxStatus),
      fieldMapping(ABContact#VendorNumber),
      fieldMapping(ABContact#VendorType),
      fieldMapping(ABContact#W9Received),
      fieldMapping(ABContact#W9ReceivedDate),
      fieldMapping(ABContact#W9ValidFrom),
      fieldMapping(ABContact#W9ValidTo),
      fieldMapping(ABContact#WithholdingRate),
      fieldMapping(ABContact#WorkPhone),
      fieldMapping(ABContact#WorkPhoneCountry),
      fieldMapping(ABContact#WorkPhoneExtension),
      fieldMapping(ABContact#UpdateScore),
      fieldMapping(ABContact#MinimumCriteriaVerified),
      fieldMapping(ABContact#ValidationLevel),
      fieldMapping(ABContact#Keyword),
      fieldMapping(ABContact#HasPendingUpdates)
          .withMappingDirection(TO_XML),
      fieldMapping(ABContact#CreateStatus)
          .withMappingDirection(TO_XML),

      // ABPerson
      fieldMapping(ABPerson#CellPhone),
      fieldMapping(ABPerson#CellPhoneCountry),
      fieldMapping(ABPerson#CellPhoneExtension),
      fieldMapping(ABPerson#DateOfBirth),
      fieldMapping(ABPerson#FirstName),
      fieldMapping(ABPerson#FirstNameKanji),
      fieldMapping(ABPerson#FormerName),
      fieldMapping(ABPerson#Gender),
      fieldMapping(ABPerson#LastName),
      fieldMapping(ABPerson#LastNameKanji),
      fieldMapping(ABPerson#LicenseNumber),
      fieldMapping(ABPerson#LicenseState),
      fieldMapping(ABPerson#MaritalStatus),
      fieldMapping(ABPerson#MiddleName),
      fieldMapping(ABPerson#NumDependents),
      fieldMapping(ABPerson#NumDependentsU18),
      fieldMapping(ABPerson#NumDependentsU25),
      fieldMapping(ABPerson#Occupation),
      fieldMapping(ABPerson#Prefix),
      fieldMapping(ABPerson#Suffix),
      fieldMapping(ABPerson#TaxFilingStatus),
      fieldMapping(ABPerson#Particle),

      // Other ABContact subtypes
      fieldMapping(ABAdjudicator#AdjudicativeDomain),
      fieldMapping(ABAdjudicator#AdjudicatorLicense),
      fieldMapping(ABAttorney#AttorneyLicense),
      fieldMapping(ABAttorney#AttorneySpecialty),
      fieldMapping(ABAutoRepairShop#AutoRepairLicense),
      fieldMapping(ABAutoTowingAgcy#AutoTowingLicense),
      fieldMapping(ABDoctor#DoctorSpecialty),
      fieldMapping(ABDoctor#MedicalLicense),
      fieldMapping(ABLawFirm#LawFirmSpecialty),
      fieldMapping(ABLegalVenue#VenueType),
      fieldMapping(ABMedicalCareOrg#MedicalOrgSpecialty),
      fieldMapping(ABUserContact#EmployeeNumber),
      
      // Addresses
      fkMapping(ABContact#PrimaryAddress)
          .withMappingDirection(TO_XML),
      arrayMapping(ABContact#ContactAddresses)
          .withMappingDirection(TO_XML),
      fieldMapping(ABContactAddress#LinkID)
          .withMappingDirection(TO_XML),
      fieldMapping(ABContactAddress#External_PublicID),
      fieldMapping(ABContactAddress#External_UniqueID),
      fkMapping(ABContactAddress#Address),

      fieldMapping(Address#LinkID)
          .withMappingDirection(TO_XML),
      fieldMapping(Address#External_PublicID),
      fieldMapping(Address#External_UniqueID),
      fieldMapping(Address#AddressLine1),
      fieldMapping(Address#AddressLine1Kanji),
      fieldMapping(Address#AddressLine2),
      fieldMapping(Address#AddressLine2Kanji),
      fieldMapping(Address#AddressLine3),
      fieldMapping(Address#AddressType),
      fieldMapping(Address#City),
      fieldMapping(Address#CityKanji),
      fieldMapping(Address#Country),
      fieldMapping(Address#County),
      fieldMapping(Address#Description),
      fieldMapping(Address#GeocodeStatus),
      fieldMapping(Address#PostalCode),
      fieldMapping(Address#State),
      fieldMapping(Address#ValidUntil),
      fieldMapping(Address#CEDEX),
      fieldMapping(Address#CEDEXBureau),
      
      arrayMapping(ABContact#Tags),
      fieldMapping(ABContactTag#LinkID)
          .withMappingDirection(TO_XML),
      fieldMapping(ABContactTag#External_PublicID),
      fieldMapping(ABContactTag#External_UniqueID),
      fieldMapping(ABContactTag#Type),

      arrayMapping(ABContact#EFTRecords),
      fieldMapping(EFTData#LinkID)
          .withMappingDirection(TO_XML),
      fieldMapping(EFTData#External_PublicID),
      fieldMapping(EFTData#External_UniqueID),
      fieldMapping(EFTData#AccountName),
      fieldMapping(EFTData#BankAccountNumber),
      fieldMapping(EFTData#BankAccountType),
      fieldMapping(EFTData#BankName),
      fieldMapping(EFTData#BankRoutingNumber),
      fieldMapping(EFTData#IsPrimary),

      arrayMapping(ABContact#CategoryScores),
      fieldMapping(ABContactCategoryScore#LinkID)
          .withMappingDirection(TO_XML),
      fieldMapping(ABContactCategoryScore#External_PublicID),
      fieldMapping(ABContactCategoryScore#External_UniqueID),
      fieldMapping(ABContactCategoryScore#ReviewCategory),
      fieldMapping(ABContactCategoryScore#Score)
    }
  }
}

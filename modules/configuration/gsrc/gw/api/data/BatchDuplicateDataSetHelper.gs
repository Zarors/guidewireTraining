package gw.api.data

uses gw.api.database.BooleanExpression
uses gw.api.database.Relop
uses gw.api.database.Restriction
uses gw.api.databuilder.ABAdjudicatorBuilder
uses gw.api.databuilder.ABAttorneyBuilder
uses gw.api.databuilder.ABAutoRepairShopBuilder
uses gw.api.databuilder.ABAutoTowingAgcyBuilder
uses gw.api.databuilder.ABCompanyBuilder
uses gw.api.databuilder.ABCompanyVendorBuilder
uses gw.api.databuilder.ABContactContactBuilder
uses gw.api.databuilder.ABDoctorBuilder
uses gw.api.databuilder.ABLawFirmBuilder
uses gw.api.databuilder.ABLegalVenueBuilder
uses gw.api.databuilder.ABMedicalCareOrgBuilder
uses gw.api.databuilder.ABPersonBuilder
uses gw.api.databuilder.ABPersonVendorBuilder
uses gw.api.databuilder.ABPlaceBuilder
uses gw.api.databuilder.ABPolicyCompanyBuilder
uses gw.api.databuilder.ABPolicyPersonBuilder
uses gw.api.databuilder.DocumentBuilder
uses gw.api.databuilder.DuplicateContactBatchRunBuilder
uses gw.api.databuilder.EFTDataBuilder
uses gw.api.databuilder.ReviewSummaryBuilder
uses gw.api.databuilder.UniqueKeyGenerator
uses gw.api.system.ABLoggerCategory
uses java.lang.Thread
uses java.util.Date
uses gw.api.database.Query
uses gw.api.util.DateUtil
uses java.lang.Double
uses java.util.List


/**
 * Generate test data for Batch detection of duplicate Contacts
 */
@Export
class BatchDuplicateDataSetHelper extends DataSetsHelperBase {
  private static var _logger = ABLoggerCategory.AB


  public static function insertDuplicateContacts() {
    new BatchDuplicateDataSetHelper()._insertDuplicateContacts()
  }

  private construct() {}

  private function _insertDuplicateContacts() {
    // don't insert the data multiple times
    if (duplicateContactsAlreadyInserted()) {
      return
    }


    generateSpecialistServices()
    generateExistingContacts()

    // allow a small but significant time change before setting the last batch run time
    timeDelay(5)
    // Set the last batch run time to now
    var bTime = DateUtil.currentDate()
    new DuplicateContactBatchRunBuilder().withLastRunDate(bTime ).createAndCommit()
    _logger.info("Batch run set to " + bTime)


    // insert a small delay after the last batch run time before inserting the batch contacts
    timeDelay(5)
    generateBatchContacts()
    createRelationships()
  }


  private function generateExistingContacts () {
    // Create contacts that are in the database before running the duplicate detection batch process


    // Block to convert numeric date into Date object
    // Note that Month is Zero-based; Jan. = 0; Dec = 11
    // var cal = new java.util.GregorianCalendar()
    // var birthday =\ year: Number, monthLessOne : Number, day : Number -> {cal.set(year,monthLessOne,day); return cal.getTime() }


    var abAddress0 = caHomeAddressBuilder("6312 Branham Rd", "San Jose", "94528").create()
    var abAddress1 = caHomeAddressBuilder("1433 Jacintha Lane", "San Mateo", "94404").create()
    var abAddress2 = caHomeAddressBuilder("1044 Delaney St", "San Carlos", "94424").create()
    var abAddress3 = caHomeAddressBuilder("1522 Fontana Rd", "San Mateo", "94404").create()
    var abAddress4 = caHomeAddressBuilder("6033 Cranston Way", "Belmont", "94415").create()
    var abAddress5 = caHomeAddressBuilder("6033 Cranston Way", "Belmont", "94415").create()
    var abAddress6 = caHomeAddressBuilder("1433 Jacintha Lane", "San Mateo", "94404").create()
    var abAddress7 = caHomeAddressBuilder("1433 Jacintha Lane", "San Mateo", "94404").create()
    var abAddress8 = caHomeAddressBuilder("1433 Jacintha Lane", "San Mateo", "94404").create()
    var abAddress9 = caHomeAddressBuilder("1433 Jacintha Lane", "San Mateo", "94404").create()
    var abAddress10 = caHomeAddressBuilder("1433 Jacintha Lane", "San Mateo", "94404").create()
    var abAddress11 = caHomeAddressBuilder("1453 Sand Hill Rd", "Palo Alto", "94456").create()
    var abAddress12 = caHomeAddressBuilder("1433 Jacintha Lane", "San Mateo", "94404").create()
    var abAddress13 = caHomeAddressBuilder("1433 Jacintha Lane", "San Mateo", "94404").create()

    var abAddress14 = caHomeAddressBuilder("2140 Evenard Rd", "San Jose", "94531").create()
    var abAddress15 = caHomeAddressBuilder("4140 Evenard Rd", "San Jose", "94532").create()
    var abAddress16 = caHomeAddressBuilder("4140 Evenard Rd", "San Jose", "94532").create()
    var abAddress17 = caHomeAddressBuilder("2140 Evenard Rd", "San Jose", "94531").create()
    var abAddress18 = caHomeAddressBuilder("1433 Jacintha Lane", "San Mateo", "94404").create()

    var abAddress19 = caHomeAddressBuilder("2952 Sandalwood Dr", "Concord", "95121").create()
    var abAddress20 = caHomeAddressBuilder("1340 West St", "Concord", "95121").create()
    var abAddress21 = caHomeAddressBuilder("2952 Sandalwood Dr", "Concord", "95121").create()

    var abAddress22 = caHomeAddressBuilder("8291 Ralston Dr", "Belmont", "94451").create()
    var abAddress23 = caHomeAddressBuilder("5231 Bayview Rd", "Belmont", "94451").create()
    var abAddress24 = caHomeAddressBuilder("5231 Bayview Rd", "Belmont", "94451").create()
    var abAddress25 = caHomeAddressBuilder("8291 Ralston Dr", "Belmont", "94451").create()


    var abAddress26 = caHomeAddressBuilder("1741 Moorpark", "San Jose", "94531").create()
    var abAddress27 = caHomeAddressBuilder("7352 Rooter St", "San Mateo", "94496").create()
    var abAddress28 = caHomeAddressBuilder("7352 Wooster St", "San Mateo", "94406").create()
    var abAddress29 = caHomeAddressBuilder("5139 Center Rd", "Palo Alto", "94471").create()
    var abAddress30 = caHomeAddressBuilder("4915 59th St", "San Francisco", "94108").create()
    var abAddress31 = caHomeAddressBuilder("4618 Gaspard Rd", "San Mateo", "94413").create()
    var abAddress32 = caHomeAddressBuilder("4618 Gaspard Rd", "San Mateo", "94413").create()
    var abAddress33 = caHomeAddressBuilder("6138 Fremont Rd", "San Carlos", "94425").create()
    var abAddress34 = caHomeAddressBuilder("6841 Santa Clara Blvd", "San Jose", "94531").create()
    var abAddress35 = caHomeAddressBuilder("6841 Santa Clara Blvd", "San Jose", "94531").create()
    var abAddress36 = caHomeAddressBuilder("5144 11th St", "San Jose", "94529").create()
    var abAddress37 = caHomeAddressBuilder("8154 Piedmont Rd", "Oakland", "95127").create()
    var abAddress38 = caHomeAddressBuilder("18571 Bevell Rd", "Fremont", "94588").create()
    var abAddress39 = caHomeAddressBuilder("6630 Winding Rd", "San Mateo", "94409").create()
    var abAddress40 = caHomeAddressBuilder("510 Eagle Creek Dr", "San Mateo", "94408").create()
    var abAddress41 = caHomeAddressBuilder("4400 Majestic Dr", "San Mateo", "94416").create()

    var abAddress42 = caHomeAddressBuilder("2358 Hooper Rd", "San Carlos", "94426").create()
    var abAddress43 = caHomeAddressBuilder("3947 Creekside Rd", "Oakland", "94572").create()
    var abAddress44 = caHomeAddressBuilder("7427 Hillside Dr", "San Mateo", "94409").create()
    var abAddress45 = caBusinessAddressBuilder("650 10th St", "San Jose", "94531").create()
    var abAddress46 = caHomeAddressBuilder("5913 Manzanita Dr", "Concord", "94521").create()
    var abAddress47 = caHomeAddressBuilder("156 Bubb Rd", "Cupertino", "95159").create()
    var abAddress48 = caHomeAddressBuilder("3082 Ralston Blvd", "Belmont", "94415").create()
    var abAddress49 = caHomeAddressBuilder("2840 Hillside Rd", "San Mateo", "94407").create()
    var abAddress50 = caHomeAddressBuilder("5113 Emmerson Ln", "San Mateo", "94405").create()
    var abAddress51 = caHomeAddressBuilder("5104 Alum Rock Rd", "San Jose", "94144").create()


    // Company addresses
    var abAddress52 = caBusinessAddressBuilder("5682 Bayside Rd", "San Carlos", "94416").create()
    var abAddress53 = caBusinessAddressBuilder("4517 Frontage Rd", "San Mateo", "94404").create()
    var abAddress54 = caBusinessAddressBuilder("5682 Bayside Rd", "San Carlos", "94416").create()
    var abAddress55 = caBusinessAddressBuilder("4517 Frontage Rd", "San Mateo", "94404").create()
    var abAddress56 = caBusinessAddressBuilder("4517 Frontage Rd", "San Mateo", "94404").create()
    var abAddress57 = caBusinessAddressBuilder("5682 Bayside Rd", "San Carlos", "94416").create()
    var abAddress58 = caBusinessAddressBuilder("7811 Broadway", "Oakland", "95133").create()

    var abAddress59 = caBusinessAddressBuilder("1951 Silo Rd", "Redwood City", "94424").create()
    var abAddress60 = caBusinessAddressBuilder("5824 El Camino Real", "San Mateo", "94404").create()
    var abAddress61 = caBusinessAddressBuilder("5824 El Camino Real", "San Mateo", "94404").create()
    var abAddress62 = caBusinessAddressBuilder("6823 Concord Blvd", "Concord", "94521").create()
    var abAddress63 = caBusinessAddressBuilder("1951 Silo Rd", "Redwood City", "94424").create()
    var abAddress64 = caBusinessAddressBuilder("5824 Santa Clara Blvd", "San Jose", "95134").create()

    var abAddress65 = caBusinessAddressBuilder("5915 Campbell Rd", "Campbell", "95155").create()
    var abAddress66 = caBusinessAddressBuilder("6218 Campbell Rd", "Campbell", "95155").create()
    var abAddress67 = caBusinessAddressBuilder("5915 Campbell Rd", "Campbell", "95155").create()
    var abAddress68 = caBusinessAddressBuilder("8925 El Camino Real", "Redwood City", "94473").create()
    var abAddress69 = caBusinessAddressBuilder("8925 El Camino Real", "Redwood City", "94473").create()
    var abAddress70 = caBusinessAddressBuilder("8925 El Camino Real", "Redwood City", "94473").create()

    var abAddress71 = caBusinessAddressBuilder("5291 5th St", "San Mateo", "94403").create()
    var abAddress72 = caBusinessAddressBuilder("5291 5th St", "San Mateo", "94403").create()
    var abAddress73 = caBusinessAddressBuilder("3014 Maple St", "San Carlos", "94436").create()
    var abAddress74 = caBusinessAddressBuilder("4601 Frontage Rd", "San Mateo", "94404").create()
    var abAddress75 = caBusinessAddressBuilder("4601 Frontage Rd", "San Mateo", "94404").create()
    var abAddress76 = caBusinessAddressBuilder("9207 Frontage Rd", "Belmont", "94417").create()
    var abAddress77 = caBusinessAddressBuilder("6963 Oak St", "San Francisco", "95109").create()
    var abAddress78 = caBusinessAddressBuilder("1548 Grollier St", "San Francisco", "95116").create()
    var abAddress79 = caBusinessAddressBuilder("1001 Airport Rd", "Hayward", "94487").create()
    var abAddress80 = caBusinessAddressBuilder("1100 Airport Rd", "Hayward", "94487").create()

    var abAddress81 = caBusinessAddressBuilder("6731 Reston Rd", "San Mateo", "94404").create()
    var abAddress82 = caBusinessAddressBuilder("3917 Mission Rd", "Hayward", "94487  ").create()
    var abAddress83 = caBusinessAddressBuilder("5840 Blossom Hill Rd", "San Jose", "95127").create()
    var abAddress84 = caBusinessAddressBuilder("5751 El Camino Real", "Belmont", "94415").create()
    var abAddress85 = caBusinessAddressBuilder("4925 Fonteign Rd", "Sunnyvale", "95177").create()
    var abAddress86 = caBusinessAddressBuilder("3561 Ditwiller Dr", "San Mateo", "94404").create()
    var abAddress87 = caBusinessAddressBuilder("4741 Everard Ln", "Palo Alto", "94483").create()
    var abAddress88 = caBusinessAddressBuilder("5583 Marine World Pkwy", "Redwood Shores", "94438").create()
    var abAddress89 = caBusinessAddressBuilder("36 Avenida Espana", "San Jose", "95113").create()

    //  Place Addesses
    var abAddress90 = caBusinessAddressBuilder("1095 Homestead Road", "Santa Clara", "95050").create()
    var abAddress91 = caBusinessAddressBuilder("191 N. First St.", "San Jose", "95113").create()
    var abAddress92 = caBusinessAddressBuilder("90-200 West Hedding Street", "San Jose", "94424").create()
    var abAddress93 = caBusinessAddressBuilder("800 North Humboldt Street", "San Mateo", "94401").create()
    var abAddress94 = caBusinessAddressBuilder("2211 Bridgepointe Parkway", "San Mateo", "94404").create()
    var abAddress95 = caBusinessAddressBuilder("1044 3rd Street", "San Mateo", "94401").createAndCommit()


    //  Additional Addresses
    var abAddress96 = caHomeAddressBuilder("6941 Santa Clara Blvd", "San Jose", "94531").create()
    var abAddress97 = caBillingAddressBuilder("5144 11th St", "San Jose", "94529").create()
    var abAddress98 = caHomeAddressBuilder("6630 Winding Rd", "San Mateo", "94409").create()
    var abAddress99 = caHomeAddressBuilder("520 Eagle Creek Dr", "San Mateo", "94408").create()
    var abAddress100 = caBusinessAddressBuilder("4400 Majestic Dr", "San Mateo", "94416").create()
    var abAddress101 = caBusinessAddressBuilder("6312 Branham Rd", "San Jose", "94528").create()
    var abAddress102 = caHomeAddressBuilder("6204 Jorelle Dr", "San Mateo", "94408").create()
    var abAddress103 = caBusinessAddressBuilder("1041 Via Espana", "San Mateo", "94416").create()
    var abAddress104 = caBusinessAddressBuilder("5824 El Camino Real", "San Mateo", "94404").create()
    var abAddress105 = caBusinessAddressBuilder("6823 Concord Blvd", "Concord", "94521").create()
    var abAddress106 = caBillingAddressBuilder("1951 Silo Rd", "Redwood City", "94424").create()
    var abAddress107 = caBusinessAddressBuilder("5824 Santa Clara Blvd", "San Jose", "95134").create()
    var abAddress108 = caBusinessAddressBuilder("1548 Grollier St", "San Francisco", "95116").createAndCommit()
    var abAddress109 = caBusinessAddressBuilder("1051 E. Hillsdale Blvd.", "Foster City", "94404").createAndCommit()
    var abAddress110 = caBusinessAddressBuilder("1001 E. Hillsdale Blvd.", "Foster City", "94404").createAndCommit()
  

    // Create many matches for a contact
    abPersonBuilder("Carll", "Webber", "F").withHomePhone("510-777-9669").withCellPhone("650-245-1083").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withLicenseNumber("H4912552").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1980, 04, 10 ) ).withTaxID("").create()
    abPersonBuilder("Carlos", "Webber", "G").withCellPhone("650-245-1083").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress0).withTaxID("").create()
    abPersonBuilder("Carl", "Webber", "H").withPrimaryAddress(abAddress1).withTaxID("410-35-1384").withLicenseNumber("K4518412").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1970, 04, 10 ) ).create()
    abPersonBuilder("Dan", "Webber", "I").withPrimaryAddress(abAddress2).withTaxID("410-35-1384").withDateOfBirth(makeDate(1980, 09, 30 ) ).create()
    abPersonBuilder("Carlita", "Webber", "J").withHomePhone("510-777-9669").withPrimaryAddress(abAddress3).withLicenseNumber("J4814913").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1970, 04, 10 ) ).withTaxID("").create()
    abPersonBuilder("Carllund", "Webber", "K").withWorkPhone("650-313-4500").withWorkPhoneExtension("145").withFaxPhone("650-313-4501").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withPrimaryAddress(abAddress4).withTaxID("").create()
    abPersonBuilder("Carl", "Webber", "L").withPrimaryAddress(abAddress5).withLicenseNumber("G4518412").withLicenseState(Jurisdiction.TC_CA).withTaxID("").create()
    abPersonBuilder("Carlos", "Webber", "M").withHomePhone("510-777-9669").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress6).withLicenseNumber("M4184561").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1980, 04, 10 ) ).withTaxID("").create()
    abPersonBuilder("Carl", "Webber", "N").withCellPhone("650-245-1083").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withLicenseNumber("G4518412").withLicenseState(Jurisdiction.TC_CA).withTaxID("").create()
    abPersonBuilder("Carl", "Webber", "O").withWorkPhone("650-313-4500").withWorkPhoneExtension("145").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withPrimaryAddress(abAddress7).withDateOfBirth(makeDate(1970, 04, 10 ) ).withTaxID("").create()
    abPersonBuilder("Carl", "Webber", "P").withHomePhone("510-777-9669").withCellPhone("650-245-1083").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress8).withTaxID("").create()
    abPersonBuilder("Carlos", "Webber", "Q").withPrimaryAddress(abAddress9).withLicenseNumber("Q5148155").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1977, 08, 12 ) ).withTaxID("").create()
    abPersonBuilder("Carl", "Webber", "R").withWorkPhone("650-313-4500").withWorkPhoneExtension("145").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withLicenseNumber("G4518412").withLicenseState(Jurisdiction.TC_CA).withTaxID("").create()
    abPersonBuilder("Carla", "Webber", "S").withCellPhone("650-245-1083").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withDateOfBirth(makeDate(1970, 04, 10 ) ).withTaxID("").create()
    abPersonBuilder("Carla", "Webber", "T").withPrimaryAddress(abAddress10).withLicenseNumber("G4518412").withLicenseState(Jurisdiction.TC_CA).withTaxID("").create()
    abPersonBuilder("Carl", "Webber", "U").withCellPhone("650-245-1055").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress11).withTaxID("410-35-1384").withDateOfBirth(makeDate(1970, 04, 10 ) ).create()
    abPersonBuilder("Carl", "Webber", "V").withHomePhone("650-258-1856").withCellPhone("650-412-1485").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress12).withTaxID("512-77-4185").withLicenseNumber("G4518412").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1970, 04, 10 ) ).create()
    abPersonBuilder("Carla", "Webber", "W").withPrimaryAddress(abAddress13).withTaxID("395-48-1481").withLicenseNumber("G4518412").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1970, 04, 10 ) ).create()


    // Create contacts with multiple matches
    abPersonBuilder("Jean-Yve", "Rameau", "B").withPrimaryAddress(abAddress14).withDateOfBirth(makeDate(1958, 05, 11) ).withTaxID("").create()
    abPersonBuilder("Jean-Claude", "Rameau", "C").withCellPhone("408-358-1484").withWorkPhone("650-441-5800").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("").create()
    abPersonBuilder("Jean", "Rameau", "D").withHomePhone("408-372-5812").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress15).withLicenseNumber("J5815388").withLicenseState(Jurisdiction.TC_CA).withTaxID("").create()
    abPersonBuilder("Jeanette", "Rameau", "E").withPrimaryAddress(abAddress16).withDateOfBirth(makeDate(1958, 05, 11) ).withTaxID("").create()
    abPersonBuilder("Jean-Phillipe", "Rameau", "F").withPrimaryAddress(abAddress17).withDateOfBirth(makeDate(1970, 07, 11) ).withTaxID("").create()
    abPersonBuilder("Jean", "Rameau", "G").withCellPhone("408-358-1484").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withTaxID("524-55-2481").create()
    abPersonBuilder("Jean-Thom", "Rameau", "H").withWorkPhone("650-441-5800").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("510-59-3841").create()
    abPersonBuilder("Jean-Marie", "Rameau", "I").withHomePhone("408-491-5284").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress18).withLicenseNumber("J5815388").withLicenseState(Jurisdiction.TC_CA).withTaxID("").create()
    abPersonBuilder("Jean", "Rameau", "J").withHomePhone("408-255-2582").withCellPhone("408-358-1484").withWorkPhone("650-441-5800").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withDateOfBirth(makeDate(1958, 05, 11) ).withTaxID("").create()
    abPersonBuilder("Tom", "Sakurai", "B").withLicenseNumber("F5194821").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1975, 07, 04) ).withTaxID("").create()
    abPersonBuilder("Tomo", "Sakurai", "C").withHomePhone("925-443-5892").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress19).withTaxID("").create()
    abPersonBuilder("Thomas", "Sakurai", "D").withHomePhone("925-443-5892").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withTaxID("251-58-2581").create()
    abPersonBuilder("Tom", "Sakurai", "E").withCellPhone("925-418-1845").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withDateOfBirth(makeDate(1975, 07, 04) ).withTaxID("").create()
    abPersonBuilder("Tomo", "Sakurai", "F").withWorkPhone("925-330-1000").withWorkPhoneExtension("4459").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withPrimaryAddress(abAddress20).withTaxID("").create()
    abPersonBuilder("Tom", "Sakurai", "G").withPrimaryAddress(abAddress21).withTaxID("").create()
    abPersonBuilder("Tomohiro", "Sakurai", "H").withHomePhone("925-443-5891").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withLicenseNumber("F5194821").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1977, 07, 11) ).withTaxID("").create()
    abPersonBuilder("Georgeia", "Dinsdale", "C").withHomePhone("650-589-4813").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress22).withTaxID("").create()
    abPersonBuilder("Georgeina", "Dinsdale", "D").withCellPhone("510-582-5821").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withLicenseNumber("K5815410").withLicenseState(Jurisdiction.TC_CA).withTaxID("").create()
    abPersonBuilder("George", "Dinsdale", "E").withPrimaryAddress(abAddress23).withDateOfBirth(makeDate(1983, 02, 28) ).withTaxID("").create()
    abPersonBuilder("Jorge", "Dinsdale", "F").withHomePhone("650-258-2589").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress24).withTaxID("581-58-1475").create()
    abPersonBuilder("Georgette", "Dinsdale", "G").withCellPhone("650-258-1489").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withTaxID("581-58-1475").create()
    abPersonBuilder("Georgeia", "Dinsdale", "H").withWorkPhone("650-444-4200").withWorkPhoneExtension("155").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withDateOfBirth(makeDate(1983, 02, 28) ).withTaxID("").create()
    abPersonBuilder("George", "Dinsdale", "I").withPrimaryAddress(abAddress25).withLicenseNumber("K5815410").withLicenseState(Jurisdiction.TC_CA).withTaxID("").create()

    // Create contacts with 2-5 matches
    abPersonBuilder("Carol", "Logan", "U").withHomePhone("408-399-2459").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withLicenseNumber("G4514149").withLicenseState(Jurisdiction.TC_CA).withTaxID("").create()
    abPersonBuilder("Carolita", "Logan", "V").withCellPhone("408-258-2581").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withTaxID("410-59-1492").create()
    abPersonBuilder("Carole", "Logan", "W").withPrimaryAddress(abAddress26).withDateOfBirth(makeDate(1968, 01, 22) ).withTaxID("").create()

    new ABPolicyPersonBuilder().withFirstName("Jon").withLastName("Smith").withMiddleName("Q").withCellPhone("650-934-3584").withWorkPhone("650-258-5317").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withDateOfBirth(makeDate(1963, 04, 01) ).withTaxID("").create()
    new ABPolicyPersonBuilder().withFirstName("Jon").withLastName("Smith").withMiddleName("R").withHomePhone("925-444-6838").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress27).withTaxID("525-68-2581").create()
    new ABPolicyPersonBuilder().withFirstName("Jonathan").withLastName("Smith").withMiddleName("S").withPrimaryAddress(abAddress28).withDateOfBirth(makeDate(1963, 04, 01) ).withTaxID("").create()

    abPersonBuilder("Peter", "Ferrara", "N").withHomePhone("510-395-3684").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withLicenseNumber("L5914831").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1968, 03, 19) ).withTaxID("").create()
    abPersonBuilder("Pete", "Ferrara", "O").withPrimaryAddress(abAddress29).withTaxID("235-68-5814").create()
    abPersonBuilder("Peter", "Ferrara", "P").withHomePhone("510-395-3684").withCellPhone("510-358-0126").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withDateOfBirth(makeDate(1968, 03, 19) ).withTaxID("").create()

    abPersonBuilder("David", "Morris", "J").withHomePhone("415-518-5924").withCellPhone("415-573-5165").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withTaxID("528-18-3671").withDateOfBirth(makeDate(1970, 08, 17) ).create()
    abPersonBuilder("David", "Morris", "K").withCellPhone("415-573-5165").withWorkPhone("831-555-4007").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress30).withTaxID("").create()

    abPersonBuilder("Ernesto", "Johnson", "F").withHomePhone("650-671-5836").withWorkPhone("510-582-1682").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress31).withTaxID("").create()
    abPersonBuilder("Ernest", "Johnson", "G").withCellPhone("650-368-8316").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withLicenseNumber("J3581056").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1971, 06, 02) ).withTaxID("").create()
    abPersonBuilder("Ernestine", "Johnson", "H").withCellPhone("650-368-8316").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress32).withTaxID("591-68-1857").create()

    abPersonBuilder("Franklin", "Winchester", "B").withHomePhone("510-666-1512").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress33).withTaxID("").create()
    abPersonBuilder("Frank", "Winchester", "C").withWorkPhone("650-815-7812").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withDateOfBirth(makeDate(1966, 11, 24) ).withTaxID("").create()

    abPersonBuilder("Robert", "Evans", "E").withPrimaryAddress(abAddress34).withTaxID("581-58-8164").withLicenseNumber("E5815901").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1965, 10, 24) ).create()
    abPersonBuilder("Roberto", "Evans", "F").withWorkPhone("408-215-6430").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withPrimaryAddress(abAddress35).withTaxID("527-47-6114").create()
    abPersonBuilder("Roberta", "Evans", "G").withCellPhone("408-716-5618").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress36).withTaxID("581-58-8164").withAddress(abAddress96).withAddress(abAddress97).create()

    abPersonBuilder("Gailyn", "Walker", "I").withHomePhone("510-581-4186").withCellPhone("510-401-3397").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withLicenseNumber("J5127115").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1972, 10, 27) ).withTaxID("").create()
    abPersonBuilder("Gail", "Walker", "J").withCellPhone("510-401-3397").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress37).withTaxID("").create()

    abPersonBuilder("Erik", "Miller", "L").withHomePhone("408-714-3815").withCellPhone("510-584-2281").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withLicenseNumber("G1841954").withLicenseState(Jurisdiction.TC_CA).withTaxID("").create()
    abPersonBuilder("Erika", "Miller", "M").withCellPhone("510-584-2281").withWorkPhone("650-619-7311").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withTaxID("723-81-8616").create()
    abPersonBuilder("Erikard", "Miller", "N").withWorkPhone("650-619-7311").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withPrimaryAddress(abAddress38).withDateOfBirth(makeDate(1969, 11, 30) ).withTaxID("").create()
    abPersonBuilder("Erik", "Miller", "O").withHomePhone("408-714-3815").withCellPhone("510-584-2281").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withLicenseNumber("G1841954").withLicenseState(Jurisdiction.TC_CA).withTaxID("").create()

    abPersonBuilder("Steve", "Grant", "Q").withHomePhone("510-589-1856").withCellPhone("650-589-5662").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress39).withTaxID("").create()
    abPersonBuilder("Steven", "Grant", "R").withHomePhone("510-589-1856").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress40).withLicenseNumber("G4894103").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1974, 12, 02) ).withTaxID("").withAddress(abAddress98).withAddress(abAddress99).withAddress(abAddress100).withAddress(abAddress101).create()
    abPersonBuilder("Stephan", "Grant", "S").withPrimaryAddress(abAddress41).withTaxID("571-56-9469").withDateOfBirth(makeDate(1974, 12, 02) ).create()



    // contacts with a single match

    abPersonBuilder("Wendy", "Harrison", "U").withHomePhone("650-852-1784").withCellPhone("650-588-9331").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress42).withLicenseNumber("H5812615").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1980, 01, 26) ).withTaxID("").create()
    abPersonBuilder("Lela", "Masuret", "W").withHomePhone("510-383-1295").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress43).withTaxID("382-18-4613").create()
    abPersonBuilder("Felicia", "Dole", "Y").withCellPhone("650-517-7541").withWorkPhone("408-557-4260").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withPrimaryAddress(abAddress44).withTaxID("").create()
    abPersonBuilder("Sa'aea", "Gaoteote", "A").withHomePhone("408-635-5833").withCellPhone("408-656-1051").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress45).withTaxID("").create()
    abPersonBuilder("Marion", "Takahashi", "C").withHomePhone("650-572-6253").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withLicenseNumber("F5781241").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1974, 11, 03) ).withTaxID("").create()

    var durflinger = abPersonBuilder("Geoffrey", "Durflinger", "E").withHomePhone("925-492-1853").withCellPhone("925-678-1785").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress46).withTaxID("").create()
    new ReviewSummaryBuilder().withContact(durflinger).create()

    abPersonBuilder("Ophilia", "Dane", "G").withHomePhone("408-683-1824").withCellPhone("408-759-6833").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress47).withTaxID("524-66-3815").create()
    abPersonBuilder("John", "Smith", "I").withCellPhone("650-444-7255").withWorkPhone("707-555-7061").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress48).withLicenseNumber("J5258441").withLicenseState(Jurisdiction.TC_CA).withTaxID("").create()

    new ABAttorneyBuilder().withFirstName("Grace").withLastName("Lee").withMiddleName("K").withWorkPhone("650-394-0127").withPrimaryAddress(abAddress49).withTaxID("44-2585411").withPreferred(false).withW9Received(false).withW9ReceivedDate(makeDate(2009,08,13) ).withW9ValidFrom(makeDate(2009,01,01) ).withW9ValidTo(makeDate(2009,12,31) ).withAttorneyLicense("88224400-ZZBBKK").withAttorneySpecialty(LegalSpecialty.TC_GENERALLIABILITY).create()
    var doc = new ABDoctorBuilder().withFirstName("Diane").withLastName("Mendoza").withMiddleName("M").withWorkPhone("650-492-3391").withFaxPhone("650-492-3392").withTaxID("82-4810233").withPrimaryAddress(abAddress102).withAddress(abAddress103).withPreferred(false).withW9Received(false).withW9ReceivedDate(makeDate(2009,08,13) ).withW9ValidFrom(makeDate(2009,01,01) ).withW9ValidTo(makeDate(2009,12,31) ).withMedicalLicense("RRR000114411888HH").withDoctorSpecialty(SpecialtyType.TC_DERMATOLOGY).create()
    addVendorData(doc, {"medicalcare"})
    new ABPersonVendorBuilder().withFirstName("Mark").withLastName("Dresden").withMiddleName("O").withTaxID("51-3568925").withPreferred(false).
      withW9Received(false).withW9ReceivedDate(makeDate(2009,08,13) ).withW9ValidFrom(makeDate(2009,01,01) ).
      withW9ValidTo(makeDate(2009,12,31) ).withEFTRecord(new EFTDataBuilder().withAccountName("Dresden Commercial Account").withBankAccountType(BankAccountType.TC_OTHER).
      withBankAccountNumber("777744441111").withBankName("First National Bank and Substatial Trust").
      withBankRoutingNumber("5892-258114801") ).
      createAndCommit()
    new ABPolicyPersonBuilder().withFirstName("Mary").withLastName("Oldham").withMiddleName("Q").withCellPhone("650-472-5117").withWorkPhone("408-522-5800").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress50).withTaxID("").create()
    new ABPolicyPersonBuilder().withFirstName("Michael").withLastName("O'Neil").withMiddleName("S").withHomePhone("408-492-3118").withCellPhone("408-580-2015").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withTaxID("").create()
    new ABAdjudicatorBuilder().withFirstName("Phillipe").withLastName("Soares").withMiddleName("U").withWorkPhone("408-521-4495").withPrimaryAddress(abAddress51).withTaxID("").withAdjudicatorLicense("LL555000KK-QQ112211").withAdjudicativeDomain(AdjudicativeDomain.TC_COUNTY).create()



    // Companies with Multiple Matches
    new ABPolicyCompanyBuilder().withName("AAMCO").withWorkPhone("650-551-4400").withPrimaryAddress(abAddress52).withTaxID("51-5815434").withNotes("B").create()
    new ABPolicyCompanyBuilder().withName("AAMCO").withWorkPhone("650-552-4499").withPrimaryAddress(abAddress53).withNotes("C").create()
    new ABPolicyCompanyBuilder().withName("AAMCO Drilling").withWorkPhone("650-553-5251").withFaxPhone("650-551-4404").withNotes("D").create()
    new ABPolicyCompanyBuilder().withName("AAMCO").withPrimaryAddress(abAddress54).withTaxID("51-5815434").withNotes("E").create()
    new ABPolicyCompanyBuilder().withName("AAMCO").withWorkPhone("408-359-5682").withFaxPhone("408-359-2568").withPrimaryAddress(abAddress55).withTaxID("44-2582591").withNotes("F").create()
    new ABPolicyCompanyBuilder().withName("AAMCO Metals").withWorkPhone("510-345-6812").withPrimaryAddress(abAddress56).withNotes("G").create()
    new ABPolicyCompanyBuilder().withName("AAMCO Metals").withWorkPhone("510-345-6812").withPrimaryAddress(abAddress57).withTaxID("51-5815434").withNotes("H").create()
    new ABPolicyCompanyBuilder().withName("AAMCO").withWorkPhone("650-551-4400").withFaxPhone("650-551-4404").withPrimaryAddress(abAddress58).withTaxID("61-5481816").withNotes("I").create()

    new ABCompanyBuilder().withName("Braxton Bakery Supply").withPrimaryAddress(abAddress59).withNotes("C").withAddress(abAddress104).withAddress(abAddress105).withAddress(abAddress106).withAddress(abAddress107).create()
    new ABCompanyBuilder().withName("Braxton Bakery Supply").withFaxPhone("650-582-4821").withPrimaryAddress(abAddress60).withNotes("D").create()
    new ABCompanyBuilder().withName("Braxton Bakery Supply").withWorkPhone("650-482-5813").withPrimaryAddress(abAddress61).withTaxID("46-1147486").withNotes("E").create()
    new ABCompanyBuilder().withName("Braxton Bakery Supply").withWorkPhone("925-488-1488").withPrimaryAddress(abAddress62).withTaxID("46-5891302").withNotes("F").create()
    new ABCompanyBuilder().withName("Braxton Bakery Supply").withFaxPhone("650-249-5800").withPrimaryAddress(abAddress63).withNotes("G").create()
    new ABCompanyBuilder().withName("Braxton Bakery Supply").withWorkPhone("650-249-5800").withPrimaryAddress(abAddress64).withTaxID("46-5612873").withNotes("H").create()

    var campbellAutoC = new ABAutoRepairShopBuilder().withName("Campbell Auto").withWorkPhone("408-582-1823").withPrimaryAddress(abAddress65).withNotes("C").
        withPreferred(false).withW9Received(false).withW9ReceivedDate(makeDate(2009,08,13) ).
        withW9ValidFrom(makeDate(2009,01,01) ).withW9ValidTo(makeDate(2009,12,31) ).
        withAutoRepairLicense("55AA99SS0011JJLL").withScore(78).withScore(82).create()
    new ABAutoRepairShopBuilder().withName("Campbell Auto Repair").withFaxPhone("408-582-1864").withTaxID("40-5814216").withPreferred(false).withW9Received(false).withW9ReceivedDate(makeDate(2009,08,13) ).withW9ValidFrom(makeDate(2009,01,01) ).withW9ValidTo(makeDate(2009,12,31) ).withNotes("D").create()
    new ABAutoRepairShopBuilder().withName("Campbell Auto Inc").withPrimaryAddress(abAddress66).withTaxID("40-5814216").withNotes("E").create()
    new ABAutoRepairShopBuilder().withName("Campbell Auto").withWorkPhone("408-582-1823").withFaxPhone("408-582-1864").withTaxID("40-5814216").withNotes("F").create()
    new ABAutoRepairShopBuilder().withName("Campbell Auto Co").withFaxPhone("408-582-1864").withPrimaryAddress(abAddress67).withNotes("G").create()
    new ABAutoRepairShopBuilder().withName("Campbell Auto").withWorkPhone("650-248-4882").withFaxPhone("650-248-4883").withPrimaryAddress(abAddress68).withTaxID("40-5814216").withNotes("H").create()
    new ABAutoRepairShopBuilder().withName("Campbell Auto").withWorkPhone("408-582-1823").withFaxPhone("650-248-4883").withPrimaryAddress(abAddress69).withNotes("I").create()
    new ABAutoRepairShopBuilder().withName("Campbell Auto").withWorkPhone("408-582-1823").withPrimaryAddress(abAddress70).withNotes("J").create()
    new ReviewSummaryBuilder().withContact(campbellAutoC).create()

    var lawFirmOne = new ABLawFirmBuilder().withName("Dinwiddie and Dunstan").withWorkPhone("650-735-2817").withFaxPhone("650-735-2818").withPrimaryAddress(abAddress71).withNotes("B").withPreferred(false).withW9Received(false).withW9ReceivedDate(makeDate(2009,08,13) ).withW9ValidFrom(makeDate(2009,01,01) ).withW9ValidTo(makeDate(2009,12,31) ).withLawFirmSpecialty(LegalSpecialty.TC_PERSONALINJURY ).create()
    var lawFirmTwo = new ABLawFirmBuilder().withName("Dinwiddie and Dunstan").withWorkPhone("650-735-2817").withFaxPhone("650-735-2818").withPrimaryAddress(abAddress72).withTaxID("91-5828164").withNotes("C").create()
    var lawFirmThree = new ABLawFirmBuilder().withName("Dinwiddie and Dunstan").withWorkPhone("650-735-2817").withTaxID("91-5828164").withNotes("D").create()
    linkDocument({lawFirmOne, lawFirmTwo, lawFirmThree}, false)
    linkDocument({lawFirmOne, lawFirmTwo}, false)
    linkDocument({lawFirmOne, lawFirmThree}, false)
    linkDocument({lawFirmThree, lawFirmTwo}, false)
    linkDocument({lawFirmOne}, true)
    linkDocument({lawFirmTwo}, true)
    linkDocument({lawFirmThree}, true)

    new ABPolicyCompanyBuilder().withName("Eastern Meditation Supply").withWorkPhone("650-426-0581").withFaxPhone("650-426-0588").withPrimaryAddress(abAddress73).withTaxID("91-5828164").withNotes("B").create()
    new ABPolicyCompanyBuilder().withName("Eastern Meditation Supply").withWorkPhone("650-426-0581").withTaxID("91-5828164").withNotes("C").create()

    var franksTowing = new ABAutoTowingAgcyBuilder().withName("Franks Towing").withWorkPhone("650-258-1854").withFaxPhone("650-258-1957").withPrimaryAddress(abAddress74).withNotes("B").withPreferred(false).withW9Received(false).withW9ReceivedDate(makeDate(2009,08,13) ).withW9ValidFrom(makeDate(2009,01,01) ).withW9ValidTo(makeDate(2009,12,31) ).withAutoTowingLicense("YY005511PPMM12345").create()
    addVendorData(franksTowing, {"autoothertowing"})
    franksTowing = new ABAutoTowingAgcyBuilder().withName("Franks Towing").withPrimaryAddress(abAddress75).withTaxID("25-5824156").withNotes("C").withPreferred(false).withW9Received(false).withW9ReceivedDate(makeDate(2009,08,13) ).withW9ValidFrom(makeDate(2009,01,01) ).withW9ValidTo(makeDate(2009,12,31) ).create()
    addVendorData(franksTowing, {"autoothertowing"})
    franksTowing = new ABAutoTowingAgcyBuilder().withName("Franks Towing").withWorkPhone("650-258-1854").withFaxPhone("650-258-1957").withNotes("D").create()
    addVendorData(franksTowing, VendorAvailabilityType.TC_UNAVAILABLE, "On vacation until August 1", {"autoothertowing", "autootherroadassist"})
    franksTowing = new ABAutoTowingAgcyBuilder().withName("Franks Towing").withWorkPhone("650-385-5892").withFaxPhone("650-385-5893").withPrimaryAddress(abAddress76).withTaxID("25-5824156").withNotes("E").create()
    addVendorData(franksTowing, VendorAvailabilityType.TC_UNAVAILABLE, "Closed until further notice", {"autoothertowing", "autootherroadassist"})

    new ABCompanyBuilder().withName("Golden Gate Lumber").withWorkPhone("415-559-3584").withFaxPhone("415-559-3591").withPrimaryAddress(abAddress77).withNotes("B").withAddress(abAddress108).create()
    new ABCompanyBuilder().withName("Golden Gate Lumber").withWorkPhone("650-555-5824").withFaxPhone("650-555-5827").withPrimaryAddress(abAddress78).withTaxID("44-5825811").withNotes("C").create()
    new ABCompanyBuilder().withName("Golden Gate Lumber").withWorkPhone("415-559-3584").withFaxPhone("415-559-3591").withTaxID("44-5825811").withNotes("D").create()

    new ABPolicyCompanyBuilder().withName("Hayward Municipal Airport").withWorkPhone("510-542-1854").withFaxPhone("510-542-1887").withPrimaryAddress(abAddress79).withNotes("B").create()
    new ABPolicyCompanyBuilder().withName("Hayward Municipal Airport").withTaxID("84-2582519").withNotes("C").create()
    new ABPolicyCompanyBuilder().withName("Hayward Airplane Supply").withWorkPhone("510-542-1854").withFaxPhone("510-542-2855").withPrimaryAddress(abAddress80).withTaxID("87-4125851").withNotes("D").create()


    // Companies with a single match
    // var eftData3 = new EFTDataBuilder().withAccountName("IWW Medical Operations").withBankAccountType(BankAccountType.TC_SAVINGS).withBankAccountNumber("5522119911003").withBankName("First National Bank and Substatial Trust").withBankRoutingNumber("5892-258114801").create()
    var mco = new ABMedicalCareOrgBuilder().withName("IWW Medical Group").withWorkPhone("650-662-5914").withPrimaryAddress(abAddress81).withTaxID("24-5892118").
      withNotes("B").withPreferred(false).withW9Received(false).withW9ReceivedDate(makeDate(2009,08,13) ).withW9ValidFrom(makeDate(2009,01,01) ).
      withW9ValidTo(makeDate(2009,12,31) ).withMedicalOrgSpecialty(SpecialtyType.TC_EMERGENCYMED).
      withEFTRecord(new EFTDataBuilder().withAccountName("IWW Medical Operations").withBankAccountType(BankAccountType.TC_SAVINGS).withBankAccountNumber("5522119911003").
      withBankName("First National Bank and Substatial Trust").withBankRoutingNumber("5892-258114801") ).createAndCommit()
    addVendorData(mco, {"medicalcare"})
    new ABCompanyBuilder().withName("Jasperlode Precious Stones").withWorkPhone("510-546-6639").withPrimaryAddress(abAddress82).withTaxID("48-2582561").withNotes("B").create()
    new ABCompanyBuilder().withName("Kaspars Hot Dogs").withWorkPhone("408-376-1742").withPrimaryAddress(abAddress83).withTaxID("54-6684151").withNotes("B").create()
    new ABCompanyVendorBuilder().withName("Lowery Recovery Inc").withWorkPhone("650-257-6614").withPrimaryAddress(abAddress84).withTaxID("47-2585167").withNotes("B").withPreferred(false).withW9Received(false).withW9ReceivedDate(makeDate(2009,08,13) ).withW9ValidFrom(makeDate(2009,01,01) ).withW9ValidTo(makeDate(2009,12,31) ).create()
    new ABCompanyBuilder().withName("Maritime Supply of Santa Clara").withWorkPhone("408-582-1485").withPrimaryAddress(abAddress85).withTaxID("57-2548146").withNotes("B").create()
    new ABCompanyBuilder().withName("Nonsuch").withWorkPhone("650-762-6591").withPrimaryAddress(abAddress86).withNotes("B").create()
    new ABPolicyCompanyBuilder().withName("Orchid Restaurant").withWorkPhone("408-736-2811").withFaxPhone("408-754-6617").withPrimaryAddress(abAddress87).withTaxID("62-5724168").withNotes("B").create()
    new ABPolicyCompanyBuilder().withName("Peninsula Paper Supply").withWorkPhone("650-682-4716").withFaxPhone("650-682-4744").withPrimaryAddress(abAddress88).withTaxID("95-6247411").withNotes("B").create()
    new ABPolicyCompanyBuilder().withName("Quiver Archery Range").withWorkPhone("408-476-1751").withPrimaryAddress(abAddress89).withNotes("B").createAndCommit()


    // Places with matches
    new ABLegalVenueBuilder().withName("Superior Court-Santa Clara County").withWorkPhone("408-882-2100").withPrimaryAddress(abAddress90).withNotes("B").withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY}).create()
    new ABLegalVenueBuilder().withName("Superior Court-Santa Clara County").withWorkPhone("408-882-2100").withFaxPhone("408-882-2690").withPrimaryAddress(abAddress91).withNotes("C").withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY}).create()
    new ABLegalVenueBuilder().withName("Superior Court-Santa Clara County").withFaxPhone("408-882-2690").withPrimaryAddress(abAddress92).withNotes("D").withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY}).create()

    new ABLegalVenueBuilder().withName("Superior Court-Santa Mateo County").withWorkPhone("650-573-2885").withFaxPhone("650-573-2951").withPrimaryAddress(abAddress93).withNotes("B").withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY}).create()
    new ABPlaceBuilder().withName("Building Site").withPrimaryAddress(abAddress94).withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY}).create()
    new ABPlaceBuilder().withName("Property 45-25495").withWorkPhone("650-611-5489").withPrimaryAddress(abAddress95).withNotes("B").withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY}).createAndCommit()

    new ABCompanyBuilder().withName("GSoft Inc.").withTaxID("66-7654321").withPrimaryAddress(abAddress109).withWorkPhone("650-555-1212").withAddress(abAddress110)
        .withEFTRecord(new EFTDataBuilder().withAccountName("Main Checking").withBankAccountType(BankAccountType.TC_CHECKING).withBankAccountNumber("111333888555").withBankName("First National Bank and Substatial Trust").withBankRoutingNumber("5892-258114801").create())
        .withEFTRecord(new EFTDataBuilder().withAccountName("Cash").withBankAccountType(BankAccountType.TC_OTHER).withBankAccountNumber("111333888666").withBankName("First National Bank and Substatial Trust").withBankRoutingNumber("5892-258114801").create())
    .withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).createAndCommit()
  }


  private function generateBatchContacts () {    // These are the contacts that should be found by the Duplicate Batch process

    //
    var abAddress0 = caHomeAddressBuilder("1433 Jacintha Lane", "San Mateo", "94404").create()
    var abAddress1 = caHomeAddressBuilder("1433 Jacintha Lane", "San Mateo", "94404").create()
    var abAddress2 = caHomeAddressBuilder("1433 Jacintha Lane", "San Mateo", "94404").create()

    var abAddress3 = caHomeAddressBuilder("2140 Evenard Rd", "San Jose", "94531").create()
    var abAddress4 = caHomeAddressBuilder("2952 Sandalwood Dr", "Concord", "95121").create()
    var abAddress5 = caHomeAddressBuilder("8291 Ralston Dr", "Belmont", "94451").create()
    var abAddress6 = caHomeAddressBuilder("8291 Ralston Dr", "Belmont", "94451").create()

    var abAddress7 = caHomeAddressBuilder("1741 Moorpark", "San Jose", "94531").create()
    var abAddress8 = caHomeAddressBuilder("7352 Wooster St", "San Mateo", "94406").create()
    var abAddress9 = caHomeAddressBuilder("5139 Center Rd", "Palo Alto", "94471").create()
    var abAddress10 = caHomeAddressBuilder("5139 Center Rd", "Palo Alto", "94471").create()
    var abAddress11 = caHomeAddressBuilder("4915 59th St", "San Francisco", "94108").create()
    var abAddress12 = caHomeAddressBuilder("4618 Gaspard Rd", "San Mateo", "94413").create()
    var abAddress13 = caHomeAddressBuilder("6138 Fremont Rd", "San Carlos", "94425").create()
    var abAddress14 = caHomeAddressBuilder("6841 Santa Clara Blvd", "San Jose", "94531").create()
    var abAddress15 = caHomeAddressBuilder("8154 Piedmont Rd", "Oakland", "95127").create()
    var abAddress16 = caHomeAddressBuilder("18571 Bevell Rd", "Fremont", "94588").create()
    var abAddress17 = caHomeAddressBuilder("510 Eagle Creek Dr", "San Mateo", "94408").create()

    var abAddress18 = caHomeAddressBuilder("5185 Gulf Dr", "Belmont", "94417").create()
    var abAddress19 = caHomeAddressBuilder("3947 Creekside Rd", "Oakland", "94572").create()
    var abAddress20 = caHomeAddressBuilder("7427 Hillside Dr", "San Mateo", "94409").create()
    var abAddress21 = caBusinessAddressBuilder("650 10th St", "San Jose", "94531").create()
    var abAddress22 = caHomeAddressBuilder("4317 Bloom Dr", "San Mateo", "94408").create()
    var abAddress23 = caHomeAddressBuilder("5913 Manzanita Dr", "Concord", "94521").create()
    var abAddress24 = caHomeAddressBuilder("156 Bubb Rd", "Cupertino", "95159").create()
    var abAddress25 = caHomeAddressBuilder("3082 Ralston Blvd", "Belmont", "94415").create()
    var abAddress26 = caHomeAddressBuilder("2840 Hillside Rd", "San Mateo", "94407").create()
    var abAddress27 = caHomeAddressBuilder("5922 Orville Dr", "San Mateo", "94407").create()
    var abAddress28 = caHomeAddressBuilder("5113 Emmerson Ln", "San Mateo", "94405").create()
    var abAddress29 = caHomeAddressBuilder("4955 White Rd", "San Jose", "95139").create()
    var abAddress30 = caHomeAddressBuilder("5104 Alum Rock Rd", "San Jose", "94144").create()


    //company addresses
    var abAddress31 = caBusinessAddressBuilder("4517 Frontage Rd", "San Mateo", "94404").create()
    var abAddress32 = caBusinessAddressBuilder("1951 Silo Rd", "Redwood City", "94424").create()
    var abAddress33 = caBusinessAddressBuilder("5824 El Camino Real", "San Mateo", "94404").create()
    var abAddress34 = caBusinessAddressBuilder("5915 Campbell Rd", "Campbell", "95155").create()
    var abAddress35 = caBusinessAddressBuilder("5915 Campbell Rd", "Campbell", "95155").create()

    var abAddress36 = caBusinessAddressBuilder("5291 5th St", "San Mateo", "94403").create()
    var abAddress37 = caBusinessAddressBuilder("3014 Maple St", "San Carlos", "94436").create()
    var abAddress38 = caBusinessAddressBuilder("4601 Frontage Rd", "San Mateo", "94404").create()
    var abAddress39 = caBusinessAddressBuilder("1548 Grollier St", "San Francisco", "95116").create()
    var abAddress40 = caBusinessAddressBuilder("1001 Airport Rd", "Hayward", "94487").create()

    var abAddress41 = caBusinessAddressBuilder("6731 Reston Rd", "San Mateo", "94404").create()
    var abAddress42 = caBusinessAddressBuilder("3917 Mission Rd", "Hayward", "94487  ").create()
    var abAddress43 = caBusinessAddressBuilder("5840 Blossom Hill Rd", "San Jose", "95127").create()
    var abAddress44 = caBusinessAddressBuilder("5751 El Camino Real", "Belmont", "94415").create()
    var abAddress45 = caBusinessAddressBuilder("5822 Santa Clara Blvd", "Santa Clara", "95156").create()
    var abAddress46 = caBusinessAddressBuilder("3561 Ditwiller Dr", "San Mateo", "94404").create()
    var abAddress47 = caBusinessAddressBuilder("4741 Everard Ln", "Palo Alto", "94483").create()
    var abAddress48 = caBusinessAddressBuilder("5583 Marine World Pkwy", "Redwood Shores", "94438").create()
    var abAddress49 = caBusinessAddressBuilder("36 Avenida Espana", "San Jose", "95113").create()

    // place addresses
    var abAddress50 = caBusinessAddressBuilder("1095 Homestead Road", "Santa Clara", "95050").create()
    var abAddress51 = caBusinessAddressBuilder("800 North Humboldt Street", "San Mateo", "94401").create()
    var abAddress52 = caBusinessAddressBuilder("2211 Bridgepointe Parkway", "San Mateo", "94404").create()
    var abAddress53 = caBusinessAddressBuilder("1044 3rd Street", "San Mateo", "94401").create()


    // Additional Addresses (for multiple addresses per contact)

    var abAddress60 = caHomeAddressBuilder("68411 Santa Clara Blvd", "San Jose", "94531").create()
    var abAddress61 = caHomeAddressBuilder("8154 Piedmont Rd", "Oakland", "95127").create()

    var abAddress62 = caHomeAddressBuilder("6610 Windling Rd", "San Mateo", "94409").create()
    var abAddress63 = caHomeAddressBuilder("530 Eagle Creek Dr", "San Mateo", "94408").create()
    var abAddress64 = caBillingAddressBuilder("4499 Majestic Dr", "San Mateo", "94416").create()
    var abAddress65 = caBusinessAddressBuilder("6324 Branham Rd", "San Jose", "94528").create()

    var abAddress66 = caHomeAddressBuilder("2349 Hooper Rd", "San Carlos", "94426").create()
    var abAddress67 = caHomeAddressBuilder("5914 Blucher St", "Concord", "94428").create()

    var abAddress68 = caBusinessAddressBuilder("5682 Bayside Rd", "San Carlos", "94416").create()

    var abAddress109 = caBusinessAddressBuilder("1051 E. Hillsdale Blvd.", "San Mateo", "94404").createAndCommit()
    var abAddress110 = caBusinessAddressBuilder("1051 E. Hillsdale Blvd.", "San Mateo", "94404").createAndCommit()
    var abAddress111 = caBusinessAddressBuilder("1051 E. Hillsdale Blvd.", "San Mateo", "94404").createAndCommit()
    var abAddress112 = caBusinessAddressBuilder("1051 E. Hillsdale Blvd.", "San Mateo", "94404").createAndCommit()

    // Largest matching contact
    abPersonBuilder("Carl", "Webber", "A").withHomePhone("510-777-9669").withCellPhone("650-245-1083").withWorkPhone("650-313-4500").withWorkPhoneExtension("145").withFaxPhone("650-313-4501").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress0).withTaxID("410-35-1384").withLicenseNumber("G4518412").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1970, 03, 10 ) ).create()
    abPersonBuilder("Carl", "Webber", "B").withHomePhone("510-777-9669").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress1).withTaxID("").create()
    abPersonBuilder("Carl", "Webber", "C").withCellPhone("650-245-1083").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withTaxID("410-35-1384").create()
    abPersonBuilder("Carl", "Webber", "D").withWorkPhone("650-313-4500").withWorkPhoneExtension("145").withFaxPhone("650-313-4501").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withLicenseNumber("G4518412").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1970, 04, 10 ) ).withTaxID("").create()
    abPersonBuilder("Carl", "Webber", "E").withPrimaryAddress(abAddress2).withDateOfBirth(makeDate(1970, 04, 10 ) ).withTaxID("").create()

    // Contacts with more than 5 matches
    abPersonBuilder("Jean", "Rameau", "A").withHomePhone("408-491-5284").withCellPhone("408-358-1484").withWorkPhone("650-441-5800").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress3).withTaxID("510-59-3841").withLicenseNumber("J5815388").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1958, 05, 11) ).create()
    abPersonBuilder("Tom", "Sakurai", "A").withHomePhone("925-443-5891").withCellPhone("925-418-1845").withWorkPhone("925-330-1000").withWorkPhoneExtension("4459").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress4).withTaxID("251-58-2581").withLicenseNumber("F5194821").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1975, 07, 04) ).create()
    abPersonBuilder("George", "Dinsdale", "A").withHomePhone("650-589-4813").withCellPhone("650-524-5813").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress5).withTaxID("581-58-1475").withLicenseNumber("K5815410").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1983, 02, 28) ).create()
    abPersonBuilder("George", "Dinsdale", "B").withCellPhone("650-524-5813").withWorkPhone("650-444-4200").withWorkPhoneExtension("155").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress6).withDateOfBirth(makeDate(1983, 02, 28) ).withTaxID("").create()


    // contacts with 2 - 5 matches

    abPersonBuilder("Carol", "Logan", "T").withHomePhone("408-399-2459").withCellPhone("408-258-2581").withWorkPhone("408-658-3921").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress7).withTaxID("410-59-1492").withLicenseNumber("G4514149").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1968, 01, 22) ).create()
    new ABPolicyPersonBuilder().withFirstName("Jon").withLastName("Smith").withMiddleName("P").withHomePhone("925-444-6838").withCellPhone("650-934-3584").withWorkPhone("650-258-5317").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withPrimaryAddress(abAddress8).withTaxID("525-68-2581").withDateOfBirth(makeDate(1963, 04, 01) ).create()

    abPersonBuilder("Peter", "Ferrara", "L").withHomePhone("510-395-3684").withCellPhone("510-358-0126").withWorkPhone("510-567-3258").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withPrimaryAddress(abAddress9).withTaxID("235-68-5814").withDateOfBirth(makeDate(1968, 03, 19) ).create()
    abPersonBuilder("Pete", "Ferrara", "M").withCellPhone("510-358-0126").withWorkPhone("510-567-3258").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress10).withLicenseNumber("L5914831").withLicenseState(Jurisdiction.TC_CA).withTaxID("").create()
    abPersonBuilder("David", "Morris", "I").withHomePhone("415-518-5924").withCellPhone("415-573-5165").withWorkPhone("831-555-4007").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress11).withLicenseNumber("M5811476").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1970, 08, 17) ).withTaxID("").create()
    abPersonBuilder("Ernest", "Johnson", "E").withHomePhone("650-671-5836").withCellPhone("650-368-8316").withWorkPhone("510-582-1682").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress12).withTaxID("591-68-1857").withLicenseNumber("J3581056").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1971, 06, 02) ).create()
    abPersonBuilder("Frank", "Winchester", "A").withHomePhone("510-666-1512").withWorkPhone("650-815-7812").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress13).withLicenseNumber("E5418416").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1966, 11, 24) ).withTaxID("").create()
    abPersonBuilder("Robert", "Evans", "D").withCellPhone("408-716-5618").withWorkPhone("408-215-6430").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress14).withTaxID("581-58-8164").withLicenseNumber("E5815901").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1965, 10, 24) ).withAddress(abAddress60).create()
    abPersonBuilder("Gail", "Walker", "H").withHomePhone("510-581-4186").withCellPhone("510-401-3397").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress15).withLicenseNumber("J5127115").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1972, 10, 27) ).withTaxID("").withAddress(abAddress61).create()
    abPersonBuilder("Erik", "Miller", "K").withHomePhone("408-714-3815").withCellPhone("510-584-2281").withWorkPhone("650-619-7311").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress16).withTaxID("723-81-8616").withLicenseNumber("G1841954").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1969, 11, 30) ).create()
    abPersonBuilder("Steve", "Grant", "P").withHomePhone("510-589-1856").withCellPhone("650-589-5662").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress17).withTaxID("571-56-9469").withLicenseNumber("G4894103").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1974, 12, 02) ).withAddress(abAddress62).withAddress(abAddress63).withAddress(abAddress64).withAddress(abAddress65).create()


    // contacts with a single match

    abPersonBuilder("Wendy", "Harrison", "T").withHomePhone("650-482-1858").withCellPhone("650-588-9331").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress18).withLicenseNumber("H5812615").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1980, 01, 26) ).withTaxID("").withAddress(abAddress66).create()
    abPersonBuilder("Lela", "Masuret", "V").withHomePhone("510-383-1295").withCellPhone("510-266-5816").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress19).withTaxID("382-18-4613").withDateOfBirth(makeDate(1977, 01, 23) ).create()
    abPersonBuilder("Felicia", "Dole", "X").withHomePhone("650-834-4497").withCellPhone("650-517-7541").withWorkPhone("408-557-4260").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withPrimaryAddress(abAddress20).withTaxID("617-47-5332").create()
    abPersonBuilder("Sa'a", "Gaoteote", "Z").withHomePhone("408-635-5833").withCellPhone("408-629-6318").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress21).withTaxID("").create()
    abPersonBuilder("Mari", "Takahashi", "B").withHomePhone("650-572-6253").withCellPhone("650-777-7584").withWorkPhone("650-492-4196").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress22).withLicenseNumber("F5781241").withLicenseState(Jurisdiction.TC_CA).withDateOfBirth(makeDate(1974, 11, 03) ).withTaxID("").withAddress(abAddress67).create()

    var durflinger = abPersonBuilder("Geoff", "Durflinger", "D").withHomePhone("925-492-1853").withCellPhone("925-678-1785").withWorkPhone("415-683-4882").withPrimaryPhoneType(PrimaryPhoneType.TC_MOBILE).withPrimaryAddress(abAddress23).withTaxID("").create()
    new ReviewSummaryBuilder().withContact(durflinger).create()

    abPersonBuilder("Ophilia", "Dane", "F").withHomePhone("408-683-1824").withCellPhone("408-759-6833").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress24).withTaxID("524-66-3815").create()
    abPersonBuilder("John", "Smith", "H").withHomePhone("650-255-6933").withCellPhone("650-444-7255").withWorkPhone("707-555-7061").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress25).withLicenseNumber("J5258441").withLicenseState(Jurisdiction.TC_CA).withTaxID("").create()

    new ABAttorneyBuilder().withFirstName("Grace").withLastName("Lee").withMiddleName("J").withWorkPhone("650-394-0127").withPrimaryAddress(abAddress26).withTaxID("44-2585411").withPreferred(true).withW9Received(true).withW9ReceivedDate(makeDate(2010,02,14) ).withW9ValidFrom(makeDate(2010,01,01) ).withW9ValidTo(makeDate(2011,12,31) ).withAttorneyLicense("88224400-FFFAAA").withAttorneySpecialty(LegalSpecialty.TC_GENERALLIABILITY).create()
    var doc = new ABDoctorBuilder().withFirstName("Diane").withLastName("Mendoza").withMiddleName("L").withWorkPhone("650-492-3391").withFaxPhone("650-492-3392").withPrimaryAddress(abAddress27).withTaxID("82-4810233").withPreferred(true).withW9Received(true).withW9ReceivedDate(makeDate(2010,02,14) ).withW9ValidFrom(makeDate(2010,01,01) ).withW9ValidTo(makeDate(2011,12,31) ).withMedicalLicense("59059022771116").withDoctorSpecialty(SpecialtyType.TC_MEDPEDS).create()
    addVendorData(doc, {"medicalcare"})
    new ABPersonVendorBuilder().withFirstName("Mark").withLastName("Dresden").withMiddleName("N").withWorkPhone("408-251-3992").withTaxID("51-3568925").withPreferred(true).withW9Received(true).withW9ReceivedDate(makeDate(2010,02,14) ).
      withW9ValidFrom(makeDate(2010,01,01) ).withW9ValidTo(makeDate(2011,12,31) ).withEFTRecord(new EFTDataBuilder().
      withAccountName("Dresden Commercial Checking").withBankAccountType(BankAccountType.TC_CHECKING).
      withBankAccountNumber("777744553311").withBankName("First National Bank and Substatial Trust").
      withBankRoutingNumber("5892-258114801") ).
      createAndCommit()
    new ABPolicyPersonBuilder().withFirstName("Mary").withLastName("Oldham").withMiddleName("P").withHomePhone("650-295-9158").withCellPhone("650-472-5117").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress28).withTaxID("").create()
    new ABPolicyPersonBuilder().withFirstName("Michael").withLastName("O'Neil").withMiddleName("R").withHomePhone("408-492-3118").withCellPhone("408-580-2015").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withPrimaryAddress(abAddress29).withTaxID("").create()
    new ABAdjudicatorBuilder().withFirstName("Phillip").withLastName("Soares").withMiddleName("T").withCellPhone("408-590-2811").withPrimaryAddress(abAddress30).withTaxID("").withAdjudicatorLicense("595-310AA310").withAdjudicativeDomain(AdjudicativeDomain.TC_APPEALS).createAndCommit()

    // Companies with Multiple Matches
    new ABPolicyCompanyBuilder().withName("AAMCO").withWorkPhone("650-551-4400").withFaxPhone("650-551-4404").withPrimaryAddress(abAddress31).withTaxID("51-5815434").withNotes("A").withAddress(abAddress68).create()
    new ABCompanyBuilder().withName("Braxton Bakery Supply").withWorkPhone("650-249-5800").withFaxPhone("650-249-5800").withPrimaryAddress(abAddress32).withTaxID("46-5891302").withNotes("A").create()
    new ABCompanyBuilder().withName("Braxton Bakery Supply").withWorkPhone("650-482-5813").withFaxPhone("650-582-4821").withPrimaryAddress(abAddress33).withTaxID("46-5891302").withNotes("B").create()
    var campbellAutoA = new ABAutoRepairShopBuilder().withName("Campbell Auto").withWorkPhone("408-582-1823").withFaxPhone("408-582-1864").withPrimaryAddress(abAddress34).withTaxID("40-5814216").withNotes("A").withPreferred(true).withW9Received(true).withW9ReceivedDate(makeDate(2010,02,14) ).withW9ValidFrom(makeDate(2010,01,01) ).withW9ValidTo(makeDate(2011,12,31) ).withAutoRepairLicense("3330004411999").withScore(95).create()
    var campbellAutoB = new ABAutoRepairShopBuilder().withName("Campbell Auto").withWorkPhone("408-582-1823").withPrimaryAddress(abAddress35).withTaxID("40-5814216").withNotes("B").withPreferred(false).withW9Received(false).withW9ReceivedDate(makeDate(2010,05,09) ).withW9ValidFrom(makeDate(2010,04,01) ).withW9ValidTo(makeDate(2011,03,31) ).withAutoRepairLicense("654654654654-12345").withScore(50).create()
    new ReviewSummaryBuilder().withContact(campbellAutoA).create()
    new ReviewSummaryBuilder().withContact(campbellAutoB).create()

    var lawFirmFour = new ABLawFirmBuilder().withName("Dinwiddie and Dunstan").withWorkPhone("650-735-2817").withFaxPhone("650-735-2818").withPrimaryAddress(abAddress36).withTaxID("91-5828164").withNotes("A").withPreferred(false).withW9Received(false).withW9ReceivedDate(makeDate(2010,05,09) ).withW9ValidFrom(makeDate(2010,04,01) ).withW9ValidTo(makeDate(2011,03,31) ).withLawFirmSpecialty(LegalSpecialty.TC_MOTORVEHLIABILITY ).create()
    linkDocument({lawFirmFour}, false)
    linkDocument({lawFirmFour}, true)

    new ABPolicyCompanyBuilder().withName("Eastern Meditation Supply").withWorkPhone("650-426-0581").withFaxPhone("650-426-0588").withPrimaryAddress(abAddress37).withTaxID("91-5828164").withNotes("A").create()
    var franksTowing = new ABAutoTowingAgcyBuilder().withName("Franks Towing").withWorkPhone("650-258-1854").withFaxPhone("650-258-1957").withPrimaryAddress(abAddress38).withTaxID("25-5824156").withNotes("A").withPreferred(false).withW9Received(false).withW9ReceivedDate(makeDate(2010,05,09) ).withW9ValidFrom(makeDate(2010,04,01) ).withW9ValidTo(makeDate(2011,03,31) ).withAutoTowingLicense("AA505111BB-00CC").create()
    addVendorData(franksTowing, {"autoothertowing"})
    new ABCompanyBuilder().withName("Golden Gate Lumber").withWorkPhone("415-559-3584").withFaxPhone("415-559-3591").withPrimaryAddress(abAddress39).withTaxID("44-5825811").withNotes("A").create()
    new ABPolicyCompanyBuilder().withName("Hayward Municipal Airport").withWorkPhone("510-542-1854").withFaxPhone("510-542-1887").withPrimaryAddress(abAddress40).withTaxID("84-2582519").withNotes("A").createAndCommit()

    // var eftData3 = new EFTDataBuilder().withAccountName("IWW Medical Operations").withBankAccountType(BankAccountType.TC_SAVINGS).withBankAccountNumber("5522119911003").withBankName("First National Bank and Substatial Trust").withBankRoutingNumber("5892-258114801").create()
    var mco = new ABMedicalCareOrgBuilder().withName("IWW Medical Group").withWorkPhone("650-662-5914").withFaxPhone("510-542-1887").withPrimaryAddress(abAddress41).withTaxID("24-5892118").withNotes("A").
      withPreferred(false).withW9Received(false).withW9ReceivedDate(makeDate(2010,05,09) ).withW9ValidFrom(makeDate(2010,04,01) ).
      withW9ValidTo(makeDate(2011,03,31) ).withMedicalOrgSpecialty(SpecialtyType.TC_FAMILYPRACTICE ).withEFTRecord(new EFTDataBuilder().
      withAccountName("IWW Medical Operations").withBankAccountType(BankAccountType.TC_SAVINGS).withBankAccountNumber("5522119911003").
      withBankName("First National Bank and Substatial Trust").withBankRoutingNumber("5892-258114801")).
      createAndCommit()
    addVendorData(mco, VendorAvailabilityType.TC_UNAVAILABLE, "Playing golf", {"medicalcare", "homeservemergmakesafe"})
    new ABCompanyBuilder().withName("Jasperlode Precious Stones").withWorkPhone("510-546-6639").withFaxPhone("510-546-6645").withPrimaryAddress(abAddress42).withTaxID("48-2582561").withNotes("A").create()
    new ABCompanyBuilder().withName("Kaspars Hot Dogs").withWorkPhone("408-376-1742").withFaxPhone("510-542-1887").withPrimaryAddress(abAddress43).withTaxID("").withNotes("A").create()
    new ABCompanyVendorBuilder().withName("Lowery Recovery Inc").withWorkPhone("650-257-6614").withPrimaryAddress(abAddress44).withTaxID("47-2585167").withNotes("A").withPreferred(false).withW9Received(false).withW9ReceivedDate(makeDate(2010,05,09) ).withW9ValidFrom(makeDate(2010,04,01) ).withW9ValidTo(makeDate(2011,03,31) ).create()
    new ABCompanyBuilder().withName("Maritime Supply of Santa Clara").withWorkPhone("408-582-1485").withPrimaryAddress(abAddress45).withTaxID("57-2548146").withNotes("A").createAndCommit()
    new ABCompanyBuilder().withName("Nonsuch").withWorkPhone("650-762-6591").withPrimaryAddress(abAddress46).withNotes("A").create()
    new ABPolicyCompanyBuilder().withName("Orchid Restaurant").withWorkPhone("408-736-2811").withFaxPhone("408-754-6617").withPrimaryAddress(abAddress47).withTaxID("62-5724168").withNotes("A").create()
    new ABPolicyCompanyBuilder().withName("Peninsula Paper Supply").withWorkPhone("650-682-4716").withFaxPhone("650-682-4744").withPrimaryAddress(abAddress48).withTaxID("95-6247411").withNotes("A").create()
    new ABPolicyCompanyBuilder().withName("Quiver Archery Range").withWorkPhone("408-476-1751").withPrimaryAddress(abAddress49).withTaxID("43-5166389").withNotes("A").create()


    // Places with matches
    new ABLegalVenueBuilder().withName("Superior Court-Santa Clara County").withWorkPhone("408-803-6600").withFaxPhone("408-882-2690").withPrimaryAddress(abAddress50).withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY}).withNotes("A").createAndCommit()

    new ABLegalVenueBuilder().withName("Superior Court-Santa Mateo County").withWorkPhone("650-573-2885").withFaxPhone("650-573-2951").withPrimaryAddress(abAddress51).withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY}).withNotes("A").create()
    new ABPlaceBuilder().withName("Building Site").withPrimaryAddress(abAddress52).withNotes("A").withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY}).create()
    new ABPlaceBuilder().withName("Property 45-25495").withWorkPhone("650-611-5489").withPrimaryAddress(abAddress53).withNotes("A").withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY}).createAndCommit()

    var primaryContact1 = new ABPersonBuilder().withFirstName("Primary").withLastName("Contact").withAddress(abAddress111).createAndCommit()
    var employee1 = new ABPersonBuilder().withFirstName("Employee").withLastName("Contact").withAddress(abAddress112).createAndCommit()
    var gsoft = new ABCompanyBuilder().withName("GSoft Inc.").withTaxID("66-7654321").withPrimaryAddress(abAddress109)
        .withWorkPhone("650-555-1212").withAddress(abAddress110)
        .withEFTRecord(new EFTDataBuilder().withAccountName("Main Checking").withBankAccountType(BankAccountType.TC_CHECKING).withBankAccountNumber("111333888555").withBankName("First National Bank and Substatial Trust").withBankRoutingNumber("5892-258114801").create())
        .withEFTRecord(new EFTDataBuilder().withAccountName("Cash").withBankAccountType(BankAccountType.TC_OTHER).withBankAccountNumber("111333888666").withBankName("First National Bank and Substatial Trust").withBankRoutingNumber("5892-258114801").create())
        .withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).createAndCommit()
    new ABContactContactBuilder().withSourceContact(employee1).withRelatedContact(gsoft).withRelationship(ContactRel.TC_EMPLOYER).createAndCommit()
    new ABContactContactBuilder().withSourceContact(gsoft).withRelatedContact(primaryContact1).withRelationship(ContactRel.TC_PRIMARYCONTACT).createAndCommit()

  }

  private function createRelationships() {
    new ABContactContactBuilder().withSourceContact(getPerson("Grace","K","Lee")).withRelatedContact(getNonPerson("Dinwiddie and Dunstan","B")).withRelationship(ContactRel.TC_EMPLOYER).createAndCommit()
    new ABContactContactBuilder().withSourceContact(getPerson("Grace","J","Lee")).withRelatedContact(getNonPerson("Dinwiddie and Dunstan","A")).withRelationship(ContactRel.TC_EMPLOYER).createAndCommit()
    new ABContactContactBuilder().withSourceContact(getPerson("Diane","L","Mendoza")).withRelatedContact(getNonPerson("IWW Medical Group","B")).withRelationship(ContactRel.TC_EMPLOYER).createAndCommit()
    new ABContactContactBuilder().withSourceContact(getPerson("Diane","M","Mendoza")).withRelatedContact(getNonPerson("IWW Medical Group","B")).withRelationship(ContactRel.TC_EMPLOYER).createAndCommit()
    new ABContactContactBuilder().withSourceContact(getNonPerson("Campbell Auto","C")).withRelatedContact(getPerson("Erika","M","Miller")).withRelationship(ContactRel.TC_PRIMARYCONTACT).createAndCommit()
    new ABContactContactBuilder().withSourceContact(getNonPerson("Campbell Auto","A")).withRelatedContact(getPerson("Gail","J","Walker")).withRelationship(ContactRel.TC_PRIMARYCONTACT).createAndCommit()
    new ABContactContactBuilder().withSourceContact(getNonPerson("Lowery Recovery Inc","B")).withRelatedContact(getPerson("Ophilia","F","Dane")).withRelationship(ContactRel.TC_PRIMARYCONTACT).createAndCommit()
    new ABContactContactBuilder().withSourceContact(getNonPerson("Superior Court-Santa Clara County","A")).withRelatedContact(getPerson("Marion","C","Takahashi")).withRelationship(ContactRel.TC_PRIMARYCONTACT).createAndCommit()
    new ABContactContactBuilder().withSourceContact(getNonPerson("Superior Court-Santa Clara County","B")).withRelatedContact(getPerson("Marion","C","Takahashi")).withRelationship(ContactRel.TC_PRIMARYCONTACT).createAndCommit()
    new ABContactContactBuilder().withSourceContact(getPerson("Phillip","T","Soares")).withRelatedContact(getPerson("Mari","B","Takahashi")).withRelationship(ContactRel.TC_PRIMARYCONTACT).createAndCommit()
    new ABContactContactBuilder().withSourceContact(getPerson("Wendy","U","Harrison")).withRelatedContact(getPerson("Grace","J","Lee")).withRelationship(ContactRel.TC_GUARDIAN).createAndCommit()
    new ABContactContactBuilder().withSourceContact(getPerson("Lela","W","Masuret")).withRelatedContact(getPerson("Wendy","U","Harrison")).withRelationship(ContactRel.TC_GUARDIAN).createAndCommit()
    new ABContactContactBuilder().withSourceContact(getPerson("Lela","V","Masuret")).withRelatedContact(getPerson("Wendy","T","Harrison")).withRelationship(ContactRel.TC_GUARDIAN).createAndCommit()

  }

  private function getPerson(first : String, middle : String, last : String) : ABPerson {
    return Query.make(ABPerson)
      .and( \ restriction -> {
              restriction.compare(ABPerson#LastName, Relop.Equals, last)
              restriction.compare(ABPerson#FirstName, Relop.Equals, first)
              restriction.compare(ABPerson#MiddleName, Relop.Equals, middle)})
    .select().single()
  }

  private function getNonPerson(name : String, note : String) : ABContact {
    var found = Query.make(entity.ABContact)
        .compare(ABContact#Name, Relop.Equals, name)
        .select()
    // cannot create a ABContact#Note restriction because it's a CLOB. So we can only
    // compare after materializing results of the broader query
    return found.firstWhere(\c -> c.Notes.contentEquals(note))
  }

  private function duplicateContactsAlreadyInserted() : boolean
  {
    var numABContact = Query.make(entity.ABContact).compare("TaxID", Equals, "410-35-1384").select().Count
    return (numABContact > 0)  // returns true if data has already been inserted into the DB
  }

  private function makeDate( year: Double, month: Double, day: Double) : Date {
    return DateUtil.createDateInstance(month as int, day as int, year as int)
  }


  // Time spacer to allow a small but significant amount of time between steps
  private function timeDelay( secs : Double){
    var endTime = DateUtil.currentDate().addSeconds(secs as int)
    do {
      Thread.sleep(1000)
    } while (DateUtil.currentDate() < endTime)
  }

  private function abPersonBuilder(
    firstName : String, lastName : String, middleName : String) : ABPersonBuilder {
    return new ABPersonBuilder()
      .withFirstName(firstName)
      .withLastName(lastName)
      .withMiddleName(middleName)
  }


  /**
   * Add vendor data to the contact.  For each ABCompanyVendor and ABPersonVendor,
   * add the vendor tag and set VendorAvailability
   */
  private function addVendorData(
    contact : ABContact,
    serviceCodes : List<String>) {
    addVendorData(contact, VendorAvailabilityType.TC_AVAILABLE, null, serviceCodes)
  }

  private function addVendorData(
    contact : ABContact,
    availability : VendorAvailabilityType,
    vendorUnavailabilityMessage : String,
    serviceCodes : List<String>) {

    var tags = contact.TagTypes.toSet()
    tags.add(ContactTagType.TC_VENDOR)
    contact.TagTypes = tags?.toTypedArray()
    contact.VendorAvailability = availability
    contact.VendorUnavailableMessage = vendorUnavailabilityMessage
    contact.SpecialistServices = servicesFromCodes(serviceCodes)
  }

}

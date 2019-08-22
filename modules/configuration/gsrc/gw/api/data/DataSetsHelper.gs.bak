package gw.api.data

uses gw.api.database.spatial.SpatialPoint
uses gw.api.databuilder.ABAdjudicatorBuilder
uses gw.api.databuilder.ABAttorneyBuilder
uses gw.api.databuilder.ABAutoRepairShopBuilder
uses gw.api.databuilder.ABCompanyBuilder
uses gw.api.databuilder.ABCompanyVendorBuilder
uses gw.api.databuilder.ABDoctorBuilder
uses gw.api.databuilder.ABLawFirmBuilder
uses gw.api.databuilder.ABMedicalCareOrgBuilder
uses gw.api.databuilder.ABPersonBuilder
uses gw.api.databuilder.ABPolicyPersonBuilder
uses gw.api.databuilder.MessageBuilder
uses gw.api.databuilder.MessageHistoryBuilder
uses gw.api.database.Query
uses gw.api.databuilder.DocumentBuilder
uses gw.api.databuilder.UniqueKeyGenerator
uses gw.api.util.DateUtil

uses java.util.List

@Export
class DataSetsHelper extends DataSetsHelperBase
{
  public static function generateABContactsAndAddressesAndMessages() {
    new DataSetsHelper()._generateABContactsAndAddressesAndMessages()
  }

  
  private construct() {}

  private function _generateABContactsAndAddressesAndMessages() {
    
    var numABContact = Query.make(entity.ABContact).compare("Name", Equals, "3M").select().getCount()
    if (numABContact > 0) {
      return
    }
    
    generateSpecialistServices()
    generateABPersonsAndMessages()
    generateABCompanies()
    generateABCompanyVendors()
    generateABAttorneys()
    generateABDoctors()
    generateABAdjudicators()
    generateABMedicalCareOrgs()
    generateABAutoRepairShops()
    generateABLawFirms()
    generateABPolicyPersons()
  }
  
  private function generateABPersonsAndMessages() {
    var abAddress0 = caHomeAddressBuilder("1253 Paloma Ave", "Arcadia", "91007").create()
                     // withSpatialPoint(new SpatialPoint(-118.04802, 34.12802)).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress1 = caHomeAddressBuilder("435 Duarte Ave", "Arcadia", "91006").create()
    var abAddress2 = caHomeAddressBuilder("435 Duarte Ave", "Arcadia", "91006").create()
    var abAddress3 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress4 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress5 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress6 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress7 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress8 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress9 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress10 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress11 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress12 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress13 = caHomeAddressBuilder("287 Kensington Rd. #1A", "South Pasadena", "91145").create()
    var abAddress14 = caHomeAddressBuilder("1253 Paloma Ave", "Arcadia", "91007").create()
    var abAddress15 = caHomeAddressBuilder("435 Duarte Ave", "Arcadia", "91006").create()
    var abAddress16 = caHomeAddressBuilder("435 Duarte Ave", "Arcadia", "91006").create()
    var abAddress17 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress18 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress19 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress20 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress21 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress22 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress23 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress24 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress25 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress26 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress27 = caHomeAddressBuilder("287 Kensington Rd. #1A", "South Pasadena", "91145").create()
    var abAddress28 = caHomeAddressBuilder("1253 Paloma Ave", "Arcadia", "91007").create()
    var abAddress29 = caHomeAddressBuilder("435 Duarte Ave", "Arcadia", "91006").create()
    var abAddress30 = caHomeAddressBuilder("435 Duarte Ave", "Arcadia", "91006").create()
    var abAddress31 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress32 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress33 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress34 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress35 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress36 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress37 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress38 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress39 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress40 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress41 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress42 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress43 = caHomeAddressBuilder("287 Kensington Rd. #1A", "South Pasadena", "91145").create()
    var abAddress44 = caHomeAddressBuilder("1253 Paloma Ave", "Arcadia", "91007").create()
    var abAddress45 = caHomeAddressBuilder("435 Duarte Ave", "Arcadia", "91006").create()
    var abAddress46 = caHomeAddressBuilder("435 Duarte Ave", "Arcadia", "91006").create()
    var abAddress47 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress48 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress49 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress50 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress51 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress52 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress53 = caHomeAddressBuilder("287 Kensington Rd. #1A", "South Pasadena", "91145").create()
    var abAddress54 = caBusinessAddressBuilder("1253 Paloma Ave", "Arcadia", "91007").create()

    // ABPerson (55)
    var contactStanNewton = new ABPersonBuilder().withFirstName("Stan").withLastName("Newton").withPrimaryAddress(abAddress0).withWorkPhone("818-446-1206").withCellPhone("818-557-2317").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("123-45-6790").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).createAndCommit()
    new ABPersonBuilder().withFirstName("Bo").withLastName("Simpson").withPrimaryAddress(abAddress1).withWorkPhone("701-236-8675").withCellPhone("619-386-3457").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("123-45-6791").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Bo").withLastName("Simpson").withPrimaryAddress(abAddress2).withWorkPhone("619-275-2346").withCellPhone("619-386-3457").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("123-45-6788").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("William").withLastName("Weeks").withPrimaryAddress(abAddress3).withWorkPhone("619-275-5986").withCellPhone("831-555-8239").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("369-15-9908").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("William").withLastName("Andy").withPrimaryAddress(abAddress4).withWorkPhone("209-666-2483").withCellPhone("772-492-6598").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("123-45-6793").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("William").withLastName("William").withPrimaryAddress(abAddress5).withWorkPhone("707-666-9073").withCellPhone("925-777-1742").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withTaxID("123-45-6794").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("William").withLastName("John").withPrimaryAddress(abAddress6).withWorkPhone("408-555-6749").withCellPhone("415-666-9063").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("123-45-6795").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("William").withLastName("David").withPrimaryAddress(abAddress7).withWorkPhone("510-888-7426").withCellPhone("209-444-7419").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withTaxID("123-45-6796").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("William").withLastName("Tim").withPrimaryAddress(abAddress8).withWorkPhone("707-666-2205").withCellPhone("650-777-6127").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("123-45-6797").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("William").withLastName("Dan").withPrimaryAddress(abAddress9).withWorkPhone("650-888-7894").withCellPhone("508-939-4395").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("123-45-6798").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("William").withLastName("Pete").withPrimaryAddress(abAddress10).withWorkPhone("330-752-1925").withCellPhone("267-941-4552").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("123-45-6799").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("William").withLastName("Robert").withPrimaryAddress(abAddress11).withWorkPhone("701-236-8675").withCellPhone("209-555-8745").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("123-45-6800").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("William").withLastName("Matthew").withPrimaryAddress(abAddress12).withWorkPhone("831-777-8472").withCellPhone("415-666-5328").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("123-45-6801").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Ray").withLastName("Timothy").withPrimaryAddress(abAddress13).withWorkPhone("415-666-8481").withCellPhone("650-777-5284").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("631-98-8492").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Michael").withLastName("Simpson").withPrimaryAddress(abAddress14).withWorkPhone("443-235-6539").withCellPhone("707-888-1814").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("138-56-8360").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("David").withLastName("Newton").withPrimaryAddress(abAddress15).withWorkPhone("831-666-4142").withCellPhone("574-912-4369").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withTaxID("766-56-1922").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    var contactRobertSmith = new ABPersonBuilder().withFirstName("Robert").withLastName("Smith").withPrimaryAddress(abAddress16).withWorkPhone("647-569-9708").withCellPhone("707-444-4275").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("634-48-8784").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).createAndCommit()
    new ABPersonBuilder().withFirstName("Daniel").withLastName("Scott").withPrimaryAddress(abAddress17).withWorkPhone("650-888-5849").withCellPhone("925-666-7105").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withTaxID("790-10-3590").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Christopher").withLastName("Pike").withPrimaryAddress(abAddress18).withWorkPhone("252-396-3614").withCellPhone("831-444-8443").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("358-16-1662").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("George").withLastName("Panola").withPrimaryAddress(abAddress19).withWorkPhone("510-555-6962").withCellPhone("415-555-6226").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("905-20-1887").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Charles").withLastName("Washington").withPrimaryAddress(abAddress20).withWorkPhone("831-444-7903").withCellPhone("859-897-7231").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("946-27-8440").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Peter").withLastName("Warren").withPrimaryAddress(abAddress21).withWorkPhone("727-889-5349").withCellPhone("831-666-5610").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("247-93-8062").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Joshua").withLastName("Sharkey").withPrimaryAddress(abAddress22).withWorkPhone("408-555-2954").withCellPhone("408-555-1624").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("540-68-3626").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Jacob").withLastName("Rankin").withPrimaryAddress(abAddress23).withWorkPhone("707-555-3396").withCellPhone("209-666-7457").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("876-76-2759").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Richard").withLastName("Madison").withPrimaryAddress(abAddress24).withWorkPhone("510-888-3923").withCellPhone("510-777-7491").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("786-68-2115").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Edward").withLastName("Perry").withPrimaryAddress(abAddress25).withWorkPhone("770-262-3523").withCellPhone("209-888-9281").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withTaxID("884-23-5984").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Nicholas").withLastName("Quitman").withPrimaryAddress(abAddress26).withWorkPhone("651-833-2561").withCellPhone("707-444-2161").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("369-15-9907").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Mary").withLastName("Leflore").withPrimaryAddress(abAddress27).withWorkPhone("831-777-2553").withCellPhone("408-666-6793").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withTaxID("358-51-1015").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Elizabeth").withLastName("Lincoln").withPrimaryAddress(abAddress28).withWorkPhone("408-444-2346").withCellPhone("831-555-2451").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("296-51-3606").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Mark").withLastName("Stone").withPrimaryAddress(abAddress29).withWorkPhone("260-318-5666").withCellPhone("650-777-4914").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("345-77-9682").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Frank").withLastName("Neshoba").withPrimaryAddress(abAddress30).withWorkPhone("831-555-3176").withCellPhone("925-666-3801").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("336-69-2686").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Ryan").withLastName("Montgomery").withPrimaryAddress(abAddress31).withWorkPhone("925-777-7242").withCellPhone("707-555-4654").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("826-30-6808").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Henry").withLastName("Wilkinson").withPrimaryAddress(abAddress32).withWorkPhone("831-444-5850").withCellPhone("510-555-3856").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("339-42-6259").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Benjamin").withLastName("Noxubee").withPrimaryAddress(abAddress33).withWorkPhone("831-444-7963").withCellPhone("617-309-1885").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("845-45-2028").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Tyler").withLastName("Pontotoc").withPrimaryAddress(abAddress34).withWorkPhone("831-666-2098").withCellPhone("310-650-5944").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("886-51-5166").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Anthony").withLastName("Union").withPrimaryAddress(abAddress35).withWorkPhone("650-666-7779").withCellPhone("415-555-1464").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withTaxID("692-44-4808").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Paul").withLastName("Tate").withPrimaryAddress(abAddress36).withWorkPhone("818-404-3122").withCellPhone("260-703-4098").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("353-92-4437").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Sarah").withLastName("Yazoo").withPrimaryAddress(abAddress37).withWorkPhone("707-777-9049").withCellPhone("325-545-7353").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withTaxID("192-77-1409").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Philip").withLastName("Marion").withPrimaryAddress(abAddress38).withWorkPhone("510-888-7686").withCellPhone("510-555-4262").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("425-31-6222").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Zachary").withLastName("Walthall").withPrimaryAddress(abAddress39).withWorkPhone("925-888-3312").withCellPhone("209-777-5138").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("199-63-9063").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Jonathan").withLastName("Monroe").withPrimaryAddress(abAddress40).withWorkPhone("408-555-7654").withCellPhone("707-444-6070").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("229-37-2100").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Samuel").withLastName("Oktibbeha").withPrimaryAddress(abAddress41).withWorkPhone("510-444-5633").withCellPhone("925-666-1563").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("852-67-6942").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Brandon").withLastName("Prentiss").withPrimaryAddress(abAddress42).withWorkPhone("306-879-4032").withCellPhone("510-777-4077").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("553-56-7076").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Jack").withLastName("Wayne").withPrimaryAddress(abAddress43).withWorkPhone("650-666-1084").withCellPhone("209-777-1941").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("291-81-2118").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Austin").withLastName("Tallahatchie").withPrimaryAddress(abAddress44).withWorkPhone("780-386-1460").withCellPhone("510-555-6689").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("968-84-9919").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    var happyTishomingo = new ABPersonBuilder().withFirstName("Harry").withLastName("Tishomingo").withPrimaryAddress(abAddress45).withWorkPhone("607-859-7458").withCellPhone("831-555-8971").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withTaxID("115-81-9996").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Stephen").withLastName("Marshall").withPrimaryAddress(abAddress46).withWorkPhone("408-666-6419").withCellPhone("408-555-3588").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("686-63-7064").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Luke").withLastName("Lowndes").withPrimaryAddress(abAddress47).withWorkPhone("416-275-3646").withCellPhone("650-555-9171").withPrimaryPhoneType(PrimaryPhoneType.TC_HOME).withTaxID("260-64-2630").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Alexander").withLastName("Tippah").withPrimaryAddress(abAddress48).withWorkPhone("925-444-4238").withCellPhone("331-873-4096").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("105-72-1440").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Donald").withLastName("Sunflower").withPrimaryAddress(abAddress49).withWorkPhone("425-706-9995").withCellPhone("661-831-7771").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("429-42-4380").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Hannah").withLastName("Tunica").withPrimaryAddress(abAddress50).withWorkPhone("925-888-3054").withCellPhone("831-787-8655").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("351-34-3313").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Timothy").withLastName("Yalobusha").withPrimaryAddress(abAddress51).withWorkPhone("507-922-8698").withCellPhone("234-493-5003").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("744-62-5846").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Brian").withLastName("Webster").withPrimaryAddress(abAddress52).withWorkPhone("831-666-2807").withCellPhone("800-872-6046").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("254-79-6170").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Ronald").withLastName("Winston").withPrimaryAddress(abAddress53).withWorkPhone("209-444-2046").withCellPhone("438-658-8771").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("122-16-3059").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()
    new ABPersonBuilder().withFirstName("Adam").withLastName("Hinds").withPrimaryAddress(abAddress54).withWorkPhone("209-888-8124").withCellPhone("650-555-8661").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("739-74-8349").withTags(new ContactTagType[]{ContactTagType.TC_CLIENT}).create()

    // Message and MessageHistory
    var cal = new java.util.GregorianCalendar()
    cal.set( 2007, 11, 12)
    var date = cal.getTime()
    new MessageBuilder().withEventRootKey("abperson:demo_sample:1").withPayload("Payload 1").withEventName("Event 1").withDestinationId(65).withStatus(1).withAckCount(0).withDuplicateCount(0).withRetryCount(0).withSendOrder(6).withCreationTime(date).withABContact(happyTishomingo).create()
    new MessageBuilder().withEventRootKey("abperson:demo_sample:1").withPayload("Payload 2").withEventName("Event 2").withDestinationId(65).withStatus(2).withAckCount(1).withDuplicateCount(0).withRetryCount(1).withSendOrder(5).withCreationTime(date).create()
    new MessageBuilder().withEventRootKey("abperson:demo_sample:1").withPayload("Payload 3").withEventName("Event 3").withDestinationId(65).withStatus(3).withAckCount(1).withDuplicateCount(0).withRetryCount(0).withSendOrder(6).withCreationTime(date).create()
    new MessageBuilder().withEventRootKey("abperson:demo_sample:1").withPayload("Payload 4").withEventName("Event 4").withDestinationId(65).withStatus(4).withAckCount(3).withDuplicateCount(2).withRetryCount(0).withSendOrder(5).withErrorDescription("A retryable error occurred").withCreationTime(date).withABContact(happyTishomingo).create()
    new MessageHistoryBuilder().withEventRootKey("abperson:demo_sample:1").withPayLoad("Payload 6").withEventName("Event 6").withDestinationID(65).withStatus(10).withAckCount(0).withDuplicateCount(0).withRetryCount(0).withSendOrder(1).withOrigMsgID(1).withCreateTime(date).create()
    new MessageHistoryBuilder().withEventRootKey("abperson:demo_sample:1").withPayLoad("Payload 7").withEventName("Event 7").withDestinationID(65).withStatus(11).withAckCount(0).withDuplicateCount(0).withRetryCount(0).withSendOrder(2).withOrigMsgID(2).withCreateTime(date).create()
    new MessageHistoryBuilder().withEventRootKey("abperson:demo_sample:1").withPayLoad("Payload 8").withEventName("Event 8").withDestinationID(65).withStatus(12).withAckCount(0).withDuplicateCount(0).withRetryCount(0).withSendOrder(3).withOrigMsgID(3).withCreateTime(date).create()
    new MessageHistoryBuilder().withEventRootKey("abperson:demo_sample:1").withPayLoad("Payload 9").withEventName("Event 9").withDestinationID(65).withStatus(13).withAckCount(0).withDuplicateCount(0).withRetryCount(0).withSendOrder(4).withOrigMsgID(4).withCreateTime(date).createAndCommit()
  }

  private function generateABCompanies() {
    var abAddress55 = caBusinessAddressBuilder("435 Duarte Ave", "Arcadia", "91006").create()
    var abAddress56 = caBusinessAddressBuilder("435 Duarte Ave", "Arcadia", "91006").create()
    var abAddress57 = caBusinessAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress58 = caBusinessAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress59 = caBusinessAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress60 = caBusinessAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress61 = caBusinessAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress62 = caBusinessAddressBuilder("345 Fir Lane", "La Canada", "91352").create()

    // ABCompany (8)
    new ABCompanyBuilder().withName("Fresh Choice").withPrimaryAddress(abAddress55).withEmailAddress1("info@FreshChoice.com").withWorkPhone("607-859-7458").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("79-0103590").withFaxPhone("209-555-7189").withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY, ContactTagType.TC_CLIENT}).create()
    new ABCompanyBuilder().withName("Sysco").withPrimaryAddress(abAddress56).withEmailAddress1("info@Sysco.com").withWorkPhone("209-555-4243").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("35-8161663").withFaxPhone("408-666-7597").withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY, ContactTagType.TC_CLIENT}).create()
    new ABCompanyBuilder().withName("Whole Foods").withPrimaryAddress(abAddress57).withEmailAddress1("info@WholeFoods.com").withWorkPhone("416-275-3646").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("90-5201887").withFaxPhone("209-444-4832").withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY, ContactTagType.TC_CLIENT}).create()
    new ABCompanyBuilder().withName("Safeway").withPrimaryAddress(abAddress58).withEmailAddress1("info@Safeway.com").withWorkPhone("510-444-8719").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("94-6278440").withFaxPhone("831-555-6114").withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY, ContactTagType.TC_CLIENT}).create()
    new ABCompanyBuilder().withName("Intel").withPrimaryAddress(abAddress59).withEmailAddress1("info@Intel.com").withWorkPhone("425-706-9995").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("24-7938063").withFaxPhone("415-666-1443").withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY, ContactTagType.TC_CLIENT}).create()
    new ABCompanyBuilder().withName("Albertson's").withPrimaryAddress(abAddress60).withEmailAddress1("info@Albertsons.com").withWorkPhone("408-444-3639").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("54-0683626").withFaxPhone("831-555-3959").withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY, ContactTagType.TC_CLIENT}).create()
    new ABCompanyBuilder().withName("Smart Final").withPrimaryAddress(abAddress61).withEmailAddress1("info@SmartFinal.com").withWorkPhone("507-922-8698").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("87-6762759").withFaxPhone("415-777-9586").withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY, ContactTagType.TC_CLIENT}).create()
    new ABCompanyBuilder().withName("QFC").withPrimaryAddress(abAddress62).withEmailAddress1("info@QFC.com").withWorkPhone("650-666-3630").withPrimaryPhoneType(PrimaryPhoneType.TC_WORK).withTaxID("78-6682115").withFaxPhone("617-309-1885").withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY, ContactTagType.TC_CLIENT}).createAndCommit()
  }

  private function generateABCompanyVendors() {
    var abAddress73 = caBusinessAddressBuilder("8982 Merrydale Dr", "San Francisco", "94104").
        withSpatialPoint(new SpatialPoint(-122.40209, 37.79159)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress63 = caBusinessAddressBuilder("287 Kensington Rd. #1A", "South Pasadena", "91145").
        withSpatialPoint(new SpatialPoint(-118.11514, 34.11879)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress64 = caBusinessAddressBuilder("1253 Paloma Ave", "Arcadia", "91007").
        withSpatialPoint(new SpatialPoint(-118.04802, 34.12802)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).createAndCommit()

    // ABCompanyVendor (2)
    createABCompanyVendor("United Natural Foods Inc", abAddress63, "info@WalMart.com", "425-706-9995", PrimaryPhoneType.TC_WORK, "88-4235984", "415-555-1251", {})
    createABCompanyVendor("3M", abAddress64, "info@RiteAid.com", "831-555-8446", PrimaryPhoneType.TC_WORK, "36-9159908", "650-555-8856", {})
    createABCompanyVendorWithPublicId("absample:3", "AB Construction", abAddress73, "info@abconstruction.com", "415-555-1212", PrimaryPhoneType.TC_WORK, "55-1212121", "415-555-1213",
        {"propinspectindependent","propconstrservflooring","propconstrservcarpentry","propconstrservpainting","propconstrservplaster","propconstrservplumber","propconstrservdrying"})

  }

  private function generateABAttorneys() {
    var abAddress65 = caBusinessAddressBuilder("2305 Franklin Dr ", "San Francisco", "94104").
        withSpatialPoint(new SpatialPoint(-122.40209, 37.79159)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress66 = caBusinessAddressBuilder("3800 Geary Ave", "San Francisco", "94104").
        withSpatialPoint(new SpatialPoint(-122.40209, 37.79159)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).createAndCommit()

    // ABAttorney (2)
    createABAttorney("Lily", "Watson", abAddress65, "lwatson@law.com", "805-234-9078", PrimaryPhoneType.TC_WORK, "13-2456902", "805-234-9070", "J12-13562")
    createABAttorney("James", "Andersen", abAddress66, "jandersen@elegal.com", "201-970-2340", PrimaryPhoneType.TC_WORK, "35-0023899", "201-970-2300", "S20-82325")
  }

  private function generateABDoctors() {
    var abAddress67 = caBusinessAddressBuilder("3901 Montgomery Rd", "San Francisco", "94104").
        withSpatialPoint(new SpatialPoint(-122.40209, 37.79159)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress68 = caBusinessAddressBuilder("3220 Beale St", "San Francisco", "94104").
        withSpatialPoint(new SpatialPoint(-122.39725, 37.79249)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).createAndCommit()

    // ABDoctor (2)
    createABDoctorWithPublicId("absample:1", "Samantha", "Andrews", abAddress67, "sandrews@andrewsmd.com", "323-897-2233", PrimaryPhoneType.TC_WORK, "12-0092343", "323-897-2200", { "medicalcare" })
    createABDoctor("Rebecca", "Stevens", abAddress68, "rstevens@stevensmed.com", "343-234-9009", PrimaryPhoneType.TC_WORK, "90-1343134", "343-234-9000", { "medicalcare" })
  }

  private function generateABAdjudicators() {
    var abAddress69 = caBusinessAddressBuilder("1930 Jefferson Lane", "San Francisco", "94104").
        withSpatialPoint(new SpatialPoint(-122.40209, 37.79159)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress70 = caBusinessAddressBuilder("5190 Broadway Blvd", "San Francisco", "94104").
        withSpatialPoint(new SpatialPoint(-122.40209, 37.79159)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).createAndCommit()

    // ABAdjudicator (2)
    createABAdjudicator("James", "Smythe", abAddress69, "jsmythe@arbitrate.com", "707-666-3326", PrimaryPhoneType.TC_WORK, "134-23-2343", "408-666-6880")
    createABAdjudicator("Paul", "Peterson", abAddress70, "ppeterson@peterson.com", "323-234-9094", PrimaryPhoneType.TC_WORK, "", "323-234-9090")
  }

  private function generateABMedicalCareOrgs() {
    var abAddress71 = caBusinessAddressBuilder("9032 Market Str", "San Francisco", "94104").
        withSpatialPoint(new SpatialPoint(-122.40196, 37.78879)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress72 = caBusinessAddressBuilder("2099 Jones Ave", "San Francisco", "94104").
        withSpatialPoint(new SpatialPoint(-122.40209, 37.79159)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).createAndCommit()

    // ABMedicalCareOrg (2)
    createABMedicalCareOrg("Health South", abAddress71, "info@healthsouth.com", "415-234-2341", PrimaryPhoneType.TC_WORK, "82-9085320", "415-234-2342", SpecialtyType.TC_ANESTHESIOLOGY, { "medicalcare" })
    createABMedicalCareOrg("Pacific Health Center", abAddress72, "info@pachealth.com", "916-234-9870", PrimaryPhoneType.TC_WORK, "73-2348973", "916-234-9872", null, { "medicalcare" })
  }

  private function generateABAutoRepairShops() {
    var abAddress73 = caBusinessAddressBuilder("8982 Merrydale Dr", "San Francisco", "94104").
        withSpatialPoint(new SpatialPoint(-122.40209, 37.79159)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress74 = caBusinessAddressBuilder("9721 Whistler Dr", "San Francisco", "94104").
        withSpatialPoint(new SpatialPoint(-122.40209, 37.79159)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress77 = caBusinessAddressBuilder("2165 Palm Ave", "San Mateo", "").
        withSpatialPoint(new SpatialPoint(-122.30694, 37.54781)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress78 = caBusinessAddressBuilder("825 N San Mateo Dr", "Burlingame", "94401").
        withSpatialPoint(new SpatialPoint(-122.33742, 37.57623)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress79 = caBusinessAddressBuilder("1200 El Camino Real", "Menlo Park", "94025").
        withSpatialPoint(new SpatialPoint(-122.18443, 37.4543)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress80 = caBusinessAddressBuilder("10625 N De Anza Blvd", "Cupertino", "95014").
        withSpatialPoint(new SpatialPoint(-122.03239, 37.33116)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress81 = caBusinessAddressBuilder("531 W San Carlos St", "San Jose", "95126").
        withSpatialPoint(new SpatialPoint(-121.89927, 37.32531)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress82 = caBusinessAddressBuilder("16455 Church St #C", "Morgan Hill", "").
        withSpatialPoint(new SpatialPoint(-121.64444, 37.11926)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress83 = caBusinessAddressBuilder("759 San Benito St", "Holllister", "").
        withSpatialPoint(new SpatialPoint(-121.40216, 36.84862)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress84 = caBusinessAddressBuilder("2191 Fremont St", "Monterey", "").
        withSpatialPoint(new SpatialPoint(-121.85913, 36.59656)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress85 = caBusinessAddressBuilder("3328 Spring St", "Paso Robles", "93446").
        withSpatialPoint(new SpatialPoint(-120.69327, 35.64883)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress86 = caBusinessAddressBuilder("667 Marsh St #A", "San Luis Obispo", "").
        withSpatialPoint(new SpatialPoint(-120.66425, 35.27786)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress87 = caBusinessAddressBuilder("401 S Hope Ave", "Santa Barbara", "").
        withSpatialPoint(new SpatialPoint(-119.74699, 34.43524)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress88 = caBusinessAddressBuilder("6360 Leland Dr", "Ventura", "").
        withSpatialPoint(new SpatialPoint(-119.20247, 34.24717)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress89 = caBusinessAddressBuilder("939 Goodrich Blvd", "Los Angeles", "").
        withSpatialPoint(new SpatialPoint(-118.15416, 34.01864)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress90 = caBusinessAddressBuilder("5910 Mission Gorge Rd", "San Diego", "").
        withSpatialPoint(new SpatialPoint(-117.09996, 32.78236)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress91 = addressBuilder(AddressType.TC_BUSINESS, "787 11th Ave", "New York", State.TC_NY, "", Country.TC_US).
        withSpatialPoint(new SpatialPoint(-73.99233, 40.76899)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).createAndCommit()

    // ABAutoRepairShop (17)
    createABAutoRepairShopWithPublicId("absample:2", "Express Auto", abAddress73, "service@expressauto.com", "209-234-8728", PrimaryPhoneType.TC_WORK, "77-7752421", "209-234-8727",
        { "autoadjudicate", "autoappraise", "autoinsprepairaudio", "autoinsprepairbody", "autoinsprepairglass", "autoothertowing" })
    createABAutoRepairShop("European Autoworks", abAddress74, "service@europeanautoworks.com", "514-249-7396", PrimaryPhoneType.TC_WORK, "88-1529123", "514-249-7395",
        { "autoinsprepairbody", "autoinsprepairglass", "autoothercourtesycar" })
    createABAutoRepairShop("M B Garage", abAddress77, "", "", PrimaryPhoneType.TC_WORK, "99-2930405", "",
        { "autootherrental" })
    createABAutoRepairShop("Burlingame Saab", abAddress78, "", "", PrimaryPhoneType.TC_WORK, "77-2837465", "",
        { "autootherroadassist" })
    createABAutoRepairShop("Menlo Park Chevron", abAddress79, "", "", PrimaryPhoneType.TC_WORK, "44-2736465", "",
        { "autoothersalvage" })
    createABAutoRepairShop("Cupertino's Smog Pro and Auto Repair", abAddress80, "", "", PrimaryPhoneType.TC_WORK, "46-2746532", "",
        { "autoothertowing" })
    createABAutoRepairShop("Meinecke Car Care Center", abAddress81, "", "", PrimaryPhoneType.TC_WORK, "46-2746371", "",
        { "autoappraise", "autoothertowing", "autoinsprepairbody" })
    createABAutoRepairShop("Morgan Hill Auto Body", abAddress82, "", "", PrimaryPhoneType.TC_WORK, "10-2535141", "",
        { "autoappraise", "autoothertowing", "autoinsprepairbody" })
    createABAutoRepairShop("Hollister Muffler and Quick Lube", abAddress83, "", "", PrimaryPhoneType.TC_WORK, "97-3727194", "",
        { "autoappraise", "autoothertowing", "autoinsprepairbody" })
    createABAutoRepairShop("Monterey Beacon Village Motor Works", abAddress84, "", "", PrimaryPhoneType.TC_WORK, "46-3746251", "",
        { "autoappraise", "autoothertowing", "autoinsprepairbody" })
    createABAutoRepairShop("Paso Robles Ford", abAddress85, "", "", PrimaryPhoneType.TC_WORK, "46-3737373", "", {})
    createABAutoRepairShop("Kragen Auto Parts: San Luis Obispo", abAddress86, "", "", PrimaryPhoneType.TC_WORK, "49-4846746", "", {})
    createABAutoRepairShop("Santa Barbara Auto Group", abAddress87, "", "", PrimaryPhoneType.TC_WORK, "38-4747474", "", {})
    createABAutoRepairShop("Ventura Toyota", abAddress88, "", "", PrimaryPhoneType.TC_WORK, "37-3737373", "", {})
    createABAutoRepairShop("L. A. Auto Repair", abAddress89, "", "", PrimaryPhoneType.TC_WORK, "45-6789012", "", {})
    createABAutoRepairShop("Toyota San Diego", abAddress90, "", "", PrimaryPhoneType.TC_WORK, "34-6543210", "", {})
    createABAutoRepairShop("Manhattan Ford Lincoln Mercury", abAddress91, "", "", PrimaryPhoneType.TC_WORK, "43-5432128", "", {})
  }

  private function generateABLawFirms() {
    var abAddress75 = caBusinessAddressBuilder("1990 Lombard St", "San Francisco", "94104").
        withSpatialPoint(new SpatialPoint(-122.43426, 37.80009)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).create()
    var abAddress76 = caBusinessAddressBuilder("2340 Jones St", "San Francisco", "94105").
        withSpatialPoint(new SpatialPoint(-122.41641, 37.80281)).withBatchGeocode(true).withGeocodeStatus(GeocodeStatus.TC_EXACT).createAndCommit()

    // ABLawFirm (2)
    createABLawFirm("Allendale, Myers & Associates", abAddress75, "info@ama.com", "505-290-7230", PrimaryPhoneType.TC_WORK, "23-9348902", "505-290-7200", true)
    createABLawFirm("Leland Associates", abAddress76, "info@leland.com", "909-293-4592", PrimaryPhoneType.TC_WORK, "49-9238290", "909-293-4592", false)
  }

  private function generateABPolicyPersons() {
    var abAddress92 = caHomeAddressBuilder("1253 Paloma Ave", "Arcadia", "91007").create()
    var abAddress93 = caHomeAddressBuilder("435 Duarte Ave", "Arcadia", "91006").create()
    var abAddress94 = caHomeAddressBuilder("435 Duarte Ave", "Arcadia", "91006").create()
    var abAddress95 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress96 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress97 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress98 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress99 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress100 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress101 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress102 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress103 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress104 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress105 = caHomeAddressBuilder("287 Kensington Rd. #1A", "South Pasadena", "91145").create()
    var abAddress106 = caHomeAddressBuilder("1253 Paloma Ave", "Arcadia", "91007").create()
    var abAddress107 = caHomeAddressBuilder("435 Duarte Ave", "Arcadia", "91006").create()
    var abAddress108 = caHomeAddressBuilder("435 Duarte Ave", "Arcadia", "91006").create()
    var abAddress109 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress110 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress111 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress112 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress113 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress114 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress115 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress116 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress117 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress118 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress119 = caHomeAddressBuilder("287 Kensington Rd. #1A", "South Pasadena", "91145").create()
    var abAddress120 = caHomeAddressBuilder("1253 Paloma Ave", "Arcadia", "91007").create()
    var abAddress121 = caHomeAddressBuilder("435 Duarte Ave", "Arcadia", "91006").create()
    var abAddress122 = caHomeAddressBuilder("435 Duarte Ave", "Arcadia", "91006").create()
    var abAddress123 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress124 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress125 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress126 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress127 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress128 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress129 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress130 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress131 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress132 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress133 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress134 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress135 = caHomeAddressBuilder("287 Kensington Rd. #1A", "South Pasadena", "91145").create()
    var abAddress136 = caHomeAddressBuilder("1253 Paloma Ave", "Arcadia", "91007").create()
    var abAddress137 = caHomeAddressBuilder("435 Duarte Ave", "Arcadia", "91006").create()
    var abAddress138 = caHomeAddressBuilder("435 Duarte Ave", "Arcadia", "91006").create()
    var abAddress139 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress140 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress141 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress142 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress143 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress144 = caHomeAddressBuilder("345 Fir Lane", "La Canada", "91352").create()
    var abAddress145 = caHomeAddressBuilder("287 Kensington Rd. #1A", "South Pasadena", "91145").create()
    var abAddress146 = caBusinessAddressBuilder("1253 Paloma Ave", "Arcadia", "91007").createAndCommit()

    // ABPolicyPerson (55)
    createABPolicyPerson("Alex", "Newton", abAddress92, "818-446-1206", PrimaryPhoneType.TC_WORK, "123-84-7700", "818-557-2317")
    createABPolicyPerson("Bert", "Simpson", abAddress93, "701-236-8675", PrimaryPhoneType.TC_WORK, "123-84-7701", "619-386-3457")
    createABPolicyPerson("Charles", "Simpson", abAddress94, "619-275-2346", PrimaryPhoneType.TC_WORK, "123-84-7702", "619-386-3457")
    createABPolicyPerson("David", "Weeks", abAddress95, "619-275-5986", PrimaryPhoneType.TC_WORK, "123-84-7703", "650-666-9665")
    createABPolicyPerson("Eric", "Andy", abAddress96, "650-666-8023", PrimaryPhoneType.TC_WORK, "123-84-7704", "772-492-6598")
    createABPolicyPerson("Flin", "William", abAddress97, "510-777-1512", PrimaryPhoneType.TC_HOME, "123-84-7705", "408-777-5362")
    createABPolicyPerson("Geoff", "John", abAddress98, "510-555-6062", PrimaryPhoneType.TC_WORK, "123-84-7706", "650-555-1892")
    createABPolicyPerson("Harper", "David", abAddress99, "408-888-4871", PrimaryPhoneType.TC_HOME, "123-84-7707", "209-666-2083")
    createABPolicyPerson("Ian", "Tim", abAddress100, "707-666-2085", PrimaryPhoneType.TC_WORK, "123-84-7708", "415-444-7949")
    createABPolicyPerson("John", "Dan", abAddress101, "415-555-3251", PrimaryPhoneType.TC_WORK, "123-84-7709", "508-939-4395")
    createABPolicyPerson("Kelly", "Pete", abAddress102, "330-752-1925", PrimaryPhoneType.TC_WORK, "123-84-7710", "267-941-4552")
    createABPolicyPerson("Liam", "Robert", abAddress103, "701-236-8675", PrimaryPhoneType.TC_WORK, "123-84-7711", "650-888-1477")
    createABPolicyPerson("Mart", "Matthew", abAddress104, "707-888-3771", PrimaryPhoneType.TC_WORK, "123-84-7712", "831-888-3568")
    createABPolicyPerson("Nate", "Timothy", abAddress105, "408-888-4467", PrimaryPhoneType.TC_WORK, "123-84-7713", "510-888-1655")
    createABPolicyPerson("Olaf", "Simpson", abAddress106, "443-235-6539", PrimaryPhoneType.TC_WORK, "123-84-7714", "510-777-1766")
    createABPolicyPerson("Perry", "Newton", abAddress107, "650-666-1626", PrimaryPhoneType.TC_HOME, "123-84-7715", "574-912-4369")
    createABPolicyPerson("Quaiche", "Smith", abAddress108, "647-569-9708", PrimaryPhoneType.TC_WORK, "123-84-7716", "510-777-2165")
    createABPolicyPerson("Randolf", "Scott", abAddress109, "707-666-8406", PrimaryPhoneType.TC_HOME, "123-84-7717", "707-555-2729")
    createABPolicyPerson("Stu", "Pike", abAddress110, "252-396-3614", PrimaryPhoneType.TC_WORK, "123-84-7718", "707-888-5206")
    createABPolicyPerson("Tyler", "Panola", abAddress111, "510-444-7856", PrimaryPhoneType.TC_WORK, "123-84-7719", "650-555-2751")
    createABPolicyPerson("Uno", "Washington", abAddress112, "415-444-8381", PrimaryPhoneType.TC_WORK, "123-84-7720", "859-897-7231")
    createABPolicyPerson("Vern", "Warren", abAddress113, "727-889-5349", PrimaryPhoneType.TC_WORK, "123-84-7721", "415-888-9953")
    createABPolicyPerson("Warren", "Sharkey", abAddress114, "650-555-6376", PrimaryPhoneType.TC_WORK, "123-84-7722", "831-888-4895")
    createABPolicyPerson("Yoan", "Rankin", abAddress115, "707-666-7209", PrimaryPhoneType.TC_WORK, "123-84-7723", "707-666-2835")
    createABPolicyPerson("Zachary", "Madison", abAddress116, "707-444-3837", PrimaryPhoneType.TC_WORK, "123-84-7724", "831-555-1564")
    createABPolicyPerson("Adam", "Perry", abAddress117, "770-262-3523", PrimaryPhoneType.TC_HOME, "123-84-7725", "650-666-6971")
    createABPolicyPerson("Bart", "Quitman", abAddress118, "651-833-2561", PrimaryPhoneType.TC_WORK, "123-84-7726", "650-666-2752")
    createABPolicyPerson("Corrie", "Leflore", abAddress119, "209-777-6369", PrimaryPhoneType.TC_HOME, "123-84-7727", "650-444-9518")
    createABPolicyPerson("Danielle", "Lincoln", abAddress120, "510-777-2163", PrimaryPhoneType.TC_WORK, "123-84-7728", "510-444-7743")
    createABPolicyPerson("Ermin", "Stone", abAddress121, "260-318-5666", PrimaryPhoneType.TC_WORK, "123-84-7729", "650-777-8476")
    createABPolicyPerson("Frank", "Neshoba", abAddress122, "831-444-7902", PrimaryPhoneType.TC_WORK, "123-84-7730", "650-777-5552")
    createABPolicyPerson("George", "Montgomery", abAddress123, "650-444-9791", PrimaryPhoneType.TC_WORK, "123-84-7731", "707-777-9225")
    createABPolicyPerson("Henry", "Wilkinson", abAddress124, "831-888-1811", PrimaryPhoneType.TC_WORK, "123-84-7732", "408-888-7203")
    createABPolicyPerson("Ilam", "Noxubee", abAddress125, "415-444-3987", PrimaryPhoneType.TC_WORK, "323-84-7733", "617-309-1885")
    createABPolicyPerson("Jon ", "Pontotoc", abAddress126, "925-666-9802", PrimaryPhoneType.TC_WORK, "123-84-7734", "310-650-5944")
    createABPolicyPerson("Ken", "Union", abAddress127, "209-888-4838", PrimaryPhoneType.TC_HOME, "123-84-7735", "415-555-8731")
    createABPolicyPerson("Lannie", "Tate", abAddress128, "818-404-3122", PrimaryPhoneType.TC_WORK, "123-84-7736", "260-703-4098")
    createABPolicyPerson("Mia", "Yazoo", abAddress129, "707-555-5365", PrimaryPhoneType.TC_HOME, "123-84-7737", "325-545-7353")
    createABPolicyPerson("Norbert", "Marion", abAddress130, "925-444-8056", PrimaryPhoneType.TC_WORK, "123-84-7738", "415-888-7143")
    createABPolicyPerson("Ojai", "Walthall", abAddress131, "650-444-6514", PrimaryPhoneType.TC_WORK, "123-84-7739", "707-666-4740")
    createABPolicyPerson("Paul", "Monroe", abAddress132, "510-444-4903", PrimaryPhoneType.TC_WORK, "123-84-7740", "415-777-7467")
    createABPolicyPerson("Rianna", "Oktibbeha", abAddress133, "415-888-2316", PrimaryPhoneType.TC_WORK, "123-84-7741", "209-444-2086")
    createABPolicyPerson("Stuart", "Prentiss", abAddress134, "306-879-4032", PrimaryPhoneType.TC_WORK, "123-84-7742", "209-555-1062")
    createABPolicyPerson("Tia", "Wayne", abAddress135, "831-444-1079", PrimaryPhoneType.TC_WORK, "123-84-7743", "707-777-8471")
    createABPolicyPerson("Ulia", "Tallahatchie", abAddress136, "780-386-1460", PrimaryPhoneType.TC_WORK, "123-84-7744", "510-444-1516")
    createABPolicyPerson("Via", "Tishomingo", abAddress137, "607-859-7458", PrimaryPhoneType.TC_HOME, "123-84-7745", "925-666-4718")
    createABPolicyPerson("Wylan", "Marshall", abAddress138, "650-555-3172", PrimaryPhoneType.TC_WORK, "123-84-7746", "831-444-6794")
    createABPolicyPerson("Xenyu", "Lowndes", abAddress139, "416-275-3646", PrimaryPhoneType.TC_HOME, "123-84-7747", "831-555-1098")
    createABPolicyPerson("Yora", "Tippah", abAddress140, "707-666-9445", PrimaryPhoneType.TC_WORK, "123-84-7748", "331-873-4096")
    createABPolicyPerson("Zela", "Sunflower", abAddress141, "425-706-9995", PrimaryPhoneType.TC_WORK, "123-84-7749", "661-831-7771")
    createABPolicyPerson("Aliana", "Tunica", abAddress142, "650-888-8946", PrimaryPhoneType.TC_WORK, "123-84-7750", "831-787-8655")
    createABPolicyPerson("Betty", "Yalobusha", abAddress143, "507-922-8698", PrimaryPhoneType.TC_WORK, "123-84-7751", "234-493-5003")
    createABPolicyPerson("Christy", "Webster", abAddress144, "650-777-4869", PrimaryPhoneType.TC_WORK, "123-84-7752", "800-872-6046")
    createABPolicyPerson("Dina", "Winston", abAddress145, "415-444-5635", PrimaryPhoneType.TC_WORK, "123-84-7753", "438-658-8771")
    createABPolicyPerson("Erica", "Hinds", abAddress146, "831-888-4033", PrimaryPhoneType.TC_WORK, "323-84-7754", "707-888-3745")
  }

  private function createABCompanyVendor(
    name:String,
    address:Address,
    email:String,
    workPhone:String,
    primaryPhoneType:PrimaryPhoneType,
    taxId:String,
    faxPhone:String,
    serviceCodes : List<String>) {

    createABCompanyVendorWithPublicId(null,
        name,
        address,
        email,
        workPhone,
        primaryPhoneType,
        taxId,
        faxPhone,
        serviceCodes)
  }

  private function createABCompanyVendorWithPublicId(publicId : String,
    name:String,
    address:Address,
    email:String,
    workPhone:String,
    primaryPhoneType:PrimaryPhoneType,
    taxId:String,
    faxPhone:String,
    serviceCodes : List<String>) {

    var abCompanyVendor : ABContact
    gw.transaction.Transaction.runWithNewBundle( \b -> {

      abCompanyVendor = new ABCompanyVendorBuilder()
          .withPublicId(publicId)
          .withName(name)
          .withPrimaryAddress(address)
          .withEmailAddress1(email)
          .withWorkPhone(workPhone)
          .withWorkPhoneCountry(PhoneCountryCode.TC_US)
          .withPrimaryPhoneType(primaryPhoneType)
          .withTaxID(taxId)
          .withFaxPhone(faxPhone)
          .withFaxPhoneCountry(PhoneCountryCode.TC_US)
          .withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY, ContactTagType.TC_VENDOR})
          .withVendorAvailability(VendorAvailabilityType.TC_AVAILABLE)
          .withSpecialistServices(servicesFromCodes(serviceCodes))
          .create(b)
    })

    gw.transaction.Transaction.runWithNewBundle( \b -> {
      abCompanyVendor = b.add(abCompanyVendor)
      linkDocument({abCompanyVendor}, false)
      linkDocument({abCompanyVendor}, false)
    })

  }

  private function createABAttorney(
    firstName:String,
    lastName:String,
    address:Address,
    email:String,
    workPhone:String,
    primaryPhoneType:PrimaryPhoneType,
    taxId:String,
    faxPhone:String,
    attorneyLicense:String) {

    var abAttorney : ABAttorney
    gw.transaction.Transaction.runWithNewBundle( \b -> {

      abAttorney = new ABAttorneyBuilder()
        .withFirstName(firstName)
        .withLastName(lastName)
        .withPrimaryAddress(address)
        .withEmailAddress1(email)
        .withWorkPhone(workPhone)
        .withWorkPhoneCountry(PhoneCountryCode.TC_US)
        .withPrimaryPhoneType(primaryPhoneType)
        .withTaxID(taxId)
        .withFaxPhone(faxPhone)
        .withFaxPhoneCountry(PhoneCountryCode.TC_US)
        .withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY, ContactTagType.TC_VENDOR})
        .withVendorAvailability(VendorAvailabilityType.TC_AVAILABLE)
        .withAttorneyLicense(attorneyLicense)
        .create(b)
    })

    gw.transaction.Transaction.runWithNewBundle( \b -> {
      abAttorney = b.add(abAttorney)
      linkDocument({abAttorney}, false)
    })

  }

  private function createABDoctor(firstName:String,
                                         lastName:String,
                                         address:Address,
                                         email:String,
                                         workPhone:String,
                                         primaryPhoneType:PrimaryPhoneType,
                                         taxId:String,
                                         faxPhone:String,
                                         serviceCodes : List<String>) {
    createABDoctorWithPublicId(null,firstName,
                                         lastName,
                                         address,
                                         email,
                                         workPhone,
                                         primaryPhoneType,
                                         taxId,
                                         faxPhone,
                                         serviceCodes)
  }

  private function createABDoctorWithPublicId(publicId : String,
                                         firstName:String,
                                         lastName:String,
                                         address:Address,
                                         email:String,
                                         workPhone:String,
                                         primaryPhoneType:PrimaryPhoneType,
                                         taxId:String,
                                         faxPhone:String,
                                         serviceCodes : List<String>) {
    gw.transaction.Transaction.runWithNewBundle( \b -> {
      new ABDoctorBuilder()
        .withPublicId(publicId)
        .withFirstName(firstName)
        .withLastName(lastName)
        .withPrimaryAddress(address)
        .withEmailAddress1(email)
        .withWorkPhone(workPhone)
        .withWorkPhoneCountry(PhoneCountryCode.TC_US)
        .withPrimaryPhoneType(primaryPhoneType)
        .withTaxID(taxId)
        .withFaxPhone(faxPhone)
        .withFaxPhoneCountry(PhoneCountryCode.TC_US)
        .withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY, ContactTagType.TC_VENDOR})
        .withVendorAvailability(VendorAvailabilityType.TC_AVAILABLE)
        .withSpecialistServices(servicesFromCodes(serviceCodes))
        .create(b)
    })
  }



  private function createABAdjudicator(firstName:String,
                                         lastName:String,
                                         address:Address,
                                         email:String,
                                         workPhone:String,
                                         primaryPhoneType:PrimaryPhoneType,
                                         taxId:String,
                                         faxPhone:String) {
    gw.transaction.Transaction.runWithNewBundle( \b -> {
      new ABAdjudicatorBuilder()
        .withFirstName(firstName)
        .withLastName(lastName)
        .withPrimaryAddress(address)
        .withEmailAddress1(email)
        .withWorkPhone(workPhone)
        .withWorkPhoneCountry(PhoneCountryCode.TC_US)
        .withPrimaryPhoneType(primaryPhoneType)
        .withTaxID(taxId)
        .withFaxPhone(faxPhone)
        .withFaxPhoneCountry(PhoneCountryCode.TC_US)
        .withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY, ContactTagType.TC_VENDOR})
        .withVendorAvailability(VendorAvailabilityType.TC_AVAILABLE)
        .create(b)
    })
  }

  private function createABMedicalCareOrg(name:String,
                                         address:Address,
                                         email:String,
                                         workPhone:String,
                                         primaryPhoneType:PrimaryPhoneType,
                                         taxId:String,
                                         faxPhone:String,
                                         medicalOrgSpecialty:SpecialtyType,
                                         serviceCodes : List<String>) {
    gw.transaction.Transaction.runWithNewBundle( \b -> {
      new ABMedicalCareOrgBuilder()
        .withName(name)
        .withPrimaryAddress(address)
        .withEmailAddress1(email)
        .withWorkPhone(workPhone)
        .withWorkPhoneCountry(PhoneCountryCode.TC_US)
        .withPrimaryPhoneType(primaryPhoneType)
        .withTaxID(taxId)
        .withFaxPhone(faxPhone)
        .withFaxPhoneCountry(PhoneCountryCode.TC_US)
        .withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY, ContactTagType.TC_VENDOR})
        .withVendorAvailability(VendorAvailabilityType.TC_UNAVAILABLE)
        .withVendorUnavailableMessage("Shut down by OSHA")
        .withMedicalOrgSpecialty(medicalOrgSpecialty)
        .withSpecialistServices(servicesFromCodes(serviceCodes))
        .create(b)
    })
  }

  private function createABAutoRepairShopWithPublicId(publicId : String,
                                         name:String,
                                         address:Address,
                                         email:String,
                                         workPhone:String,
                                         primaryPhoneType:PrimaryPhoneType,
                                         taxId:String,
                                         faxPhone:String,
                                         serviceCodes : List<String>) {
    gw.transaction.Transaction.runWithNewBundle( \b -> {
      new ABAutoRepairShopBuilder()
        .withPublicId(publicId)
        .withName(name)
        .withPrimaryAddress(address)
        .withEmailAddress1(email)
        .withWorkPhone(workPhone)
        .withWorkPhoneCountry(PhoneCountryCode.TC_US)
        .withPrimaryPhoneType(primaryPhoneType)
        .withTaxID(taxId)
        .withFaxPhone(faxPhone)
        .withFaxPhoneCountry(PhoneCountryCode.TC_US)
        .withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY, ContactTagType.TC_VENDOR})
        .withVendorAvailability(VendorAvailabilityType.TC_AVAILABLE)
        .withSpecialistServices(servicesFromCodes(serviceCodes))
        .create(b)
    })
  }

  private function createABAutoRepairShop(name:String,
                                         address:Address,
                                         email:String,
                                         workPhone:String,
                                         primaryPhoneType:PrimaryPhoneType,
                                         taxId:String,
                                         faxPhone:String,
                                         serviceCodes : List<String>) {

    createABAutoRepairShopWithPublicId(null, name,
                                         address,
                                         email,
                                         workPhone,
                                         primaryPhoneType,
                                         taxId,
                                         faxPhone,
                                         serviceCodes)
  }

  private function createABLawFirm(name:String,
                                         address:Address,
                                         email:String,
                                         workPhone:String,
                                         primaryPhoneType:PrimaryPhoneType,
                                         taxId:String,
                                         faxPhone:String,
                                         preferred:boolean) {
    gw.transaction.Transaction.runWithNewBundle( \b -> {
      new ABLawFirmBuilder()
        .withName(name)
        .withPrimaryAddress(address)
        .withEmailAddress1(email)
        .withWorkPhone(workPhone)
        .withWorkPhoneCountry(PhoneCountryCode.TC_US)
        .withPrimaryPhoneType(primaryPhoneType)
        .withTaxID(taxId)
        .withFaxPhone(faxPhone)
        .withFaxPhoneCountry(PhoneCountryCode.TC_US)
        .withPreferred(preferred)
        .withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY, ContactTagType.TC_VENDOR})
        .withVendorAvailability(VendorAvailabilityType.TC_AVAILABLE)
        .create(b)
    })
  }

  private function createABPolicyPerson(firstName:String,
                                         lastName:String,
                                         address:Address,
                                         workPhone:String,
                                         primaryPhoneType:PrimaryPhoneType,
                                         taxId:String,
                                         cellPhone:String) {
    gw.transaction.Transaction.runWithNewBundle( \b -> {
      new ABPolicyPersonBuilder()
        .withFirstName(firstName)
        .withLastName(lastName)
        .withPrimaryAddress(address)
        .withWorkPhone(workPhone)
        .withWorkPhoneCountry(PhoneCountryCode.TC_US)
        .withPrimaryPhoneType(primaryPhoneType)
        .withTaxID(taxId)
        .withCellPhone(cellPhone)
        .withCellPhoneCountry(PhoneCountryCode.TC_US)
        .withTags(new ContactTagType[]{ContactTagType.TC_CLAIMPARTY})
        .create(b)
    })
  }

}

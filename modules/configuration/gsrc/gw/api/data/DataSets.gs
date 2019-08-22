package gw.api.data

uses gw.api.databuilder.AddressBuilder
uses gw.api.databuilder.CredentialBuilder
uses gw.api.databuilder.CompanyBuilder
uses gw.api.databuilder.UserBuilder
uses gw.api.databuilder.UserContactBuilder
uses gw.api.databuilder.UserSettingsBuilder
uses gw.api.util.SampleDataGenerator

@Export
class DataSets {

  // Instance variable initialized by the constructor and set by the UI
  private var _dataSetGenerationMethod : String;

  // Constructor - only a single no-arg constructor allowed
  construct() {
    _dataSetGenerationMethod = getDataSetGenerationMethods()[0];
  }

  // Methods used to support data generation from the UI
  function getDataSetGenerationMethod() : String {
    return _dataSetGenerationMethod;
  }

  function setDataSetGenerationMethod(dataSetGenerationMethod : String) {
     _dataSetGenerationMethod = dataSetGenerationMethod;
  }

  function createSampleData() {
    SampleDataGenerator.generateSampleData(this, _dataSetGenerationMethod);
  }

  // Method used to display available data set methods to the UI.  Add any new data set methods to the returned array
  final function getDataSetGenerationMethods() : String[] {
    return new String[] { "createDefaultSampleData"};
  }

  // Data set methods - add custom data sets here, always passing the dataGenerator as the first parameter
  function createDefaultSampleData(dataGenerator : DataGenerator) {
    generateCommunity()
    DataSetsHelper.generateABContactsAndAddressesAndMessages()
  }
  
  // ============================================================================= generateCommunity()
  
  private function generateCommunity() {
    var group = SampleGroup.Enigma.generate()
    var org = SampleOrganization.DefaultOrg.generate()
    
    var address0 = new AddressBuilder().withAddressType(AddressType.TC_BUSINESS).withDescription("Work address").withAddressLine1("143 Lake Ave. Suite 501").withCity("Pasadena").withState(State.TC_CA).withPostalCode("91253").withCountry(Country.TC_US).create()
    var address1 = new AddressBuilder().withAddressType(AddressType.TC_BUSINESS).withDescription("Work address").withAddressLine1("143 Lake Ave. Suite 501").withCity("Pasadena").withState(State.TC_CA).withPostalCode("91253").withCountry(Country.TC_US).create()
    var address2 = new AddressBuilder().withAddressType(AddressType.TC_BUSINESS).withDescription("Work address").withAddressLine1("143 Lake Ave. Suite 501").withCity("Pasadena").withState(State.TC_CA).withPostalCode("91253").withCountry(Country.TC_US).create()
    var address3 = new AddressBuilder().withAddressType(AddressType.TC_BUSINESS).withDescription("Work address").withAddressLine1("143 Lake Ave. Suite 501").withCity("Pasadena").withState(State.TC_CA).withPostalCode("91253").withCountry(Country.TC_US).create()
    var address4 = new AddressBuilder().withAddressType(AddressType.TC_BUSINESS).withDescription("Work address").withAddressLine1("143 Lake Ave. Suite 501").withCity("Pasadena").withState(State.TC_CA).withPostalCode("91253").withCountry(Country.TC_US).create()
    var address5 = new AddressBuilder().withAddressType(AddressType.TC_BUSINESS).withDescription("Work address").withAddressLine1("143 Lake Ave. Suite 501").withCity("Pasadena").withState(State.TC_CA).withPostalCode("91253").withCountry(Country.TC_US).create()
    var address6 = new AddressBuilder().withAddressType(AddressType.TC_BUSINESS).withDescription("Work address").withAddressLine1("143 Lake Ave. Suite 501").withCity("Pasadena").withState(State.TC_CA).withPostalCode("91253").withCountry(Country.TC_US).create()
    var address7 = new AddressBuilder().withAddressType(AddressType.TC_BUSINESS).withDescription("Work address").withAddressLine1("143 Lake Ave. Suite 501").withCity("Pasadena").withState(State.TC_CA).withPostalCode("91253").withCountry(Country.TC_US).create()
    var address8 = new AddressBuilder().withAddressType(AddressType.TC_BUSINESS).withDescription("Work address").withAddressLine1("143 Lake Ave. Suite 501").withCity("Pasadena").withState(State.TC_CA).withPostalCode("91253").withCountry(Country.TC_US).create()
    var address9 = new AddressBuilder().withAddressType(AddressType.TC_BUSINESS).withDescription("Work address").withAddressLine1("143 Lake Ave. Suite 501").withCity("Pasadena").withState(State.TC_CA).withPostalCode("91253").withCountry(Country.TC_US).create()
    var address10 = new AddressBuilder().withAddressType(AddressType.TC_BUSINESS).withDescription("Work address").withAddressLine1("610 Fifth Avenue").withCity("Indianapolis").withState(State.TC_IN).withPostalCode("46201").withCountry(Country.TC_US).create()
    var address11 = new AddressBuilder().withAddressType(AddressType.TC_BUSINESS).withDescription("Work address").withAddressLine1("4460 Boulder Drive").withCity("Tampa").withState(State.TC_FL).withPostalCode("33605").withCountry(Country.TC_US).create()
    var address12 = new AddressBuilder().withAddressType(AddressType.TC_BUSINESS).withDescription("Work address").withAddressLine1("143 Lake Ave. Suite 501").withCity("Pasadena").withState(State.TC_CA).withPostalCode("91253").withCountry(Country.TC_US).create()



    var userContact0 = createUserContact("Alice", "Applegate", address0, true, "213-555-8164", "aapplegate@enigma_fc.com")
    var userContact1 = createUserContact("Steve", "Smith", address1, true, "213-555-8164", "ssmith@enigma_fc.com")
    var userContact2 = createUserContact("Mary", "Maples", address2, true, "213-555-8164", "mmaples@enigma_fc.com")
    var userContact3 = createUserContact("Edward", "Lee", address3, true, "213-555-8164", "elee@enigma_fc.com")
    var userContact4 = createUserContact("Carl", "Clark", address4, true, "213-555-8164", "cclark@enigma_fc.com")
    var userContact5 = createUserContact("System", "Admin", address5, true, "213-555-8164", "admin@enigma_fc.com")
    var userContact6 = createUserContact("Super", "Visor", address6, true, "213-555-8164", "svisor@enigma_fc.com")
    var userContact7 = createUserContact("Bruce", "Baker", address7, true, "213-555-8164", "bbaker@enigma_fc.com")
    var userContact8 = createUserContact("Christine", "Craft", address8, true, "213-555-8164", "ccraft@enigma_fc.com")
    var userContact9 = createUserContact("Danielle", "Henson", address9, true, "213-555-8164", "dhenson@enigma_fc.com")


    var userContact10 = createUserContact("ClientAppCC", "CC", null, false, null, null)
    var userContact11 = createUserContact("ClientAppPC", "PC", null, false, null, null)
    var userContact12 = createUserContact("ClientAppBC", "BC", null, false, null, null)
    var userContact13 =  createUserContact("DataProtection", "Officer", address12, true, "213-555-8164", "dpofficer@enigma_fc.com")


    createUser("aapplegate", "gw", userContact0, org, new Group[]{group}, new String[]{SystemRole.ContactManager.PublicId})
    createUser("ssmith", "gw", userContact1, org, new Group[]{group}, new String[]{SystemRole.ContactViewer.PublicId})
    createUser("mmaples", "gw", userContact2, org, new Group[]{group}, new String[]{SystemRole.ContactManager.PublicId})
    createUser("elee", "gw", userContact3, org, new Group[]{group}, new String[]{SystemRole.ContactManager.PublicId})
    createUser("cclark", "gw", userContact4, org, new Group[]{group}, new String[]{SystemRole.ContactManager.PublicId})
    createUser("admin", "gw", userContact5, org, new Group[]{group}, new String[]{SystemRole.UserAdmin.PublicId})
    createUser("svisor", "gw", userContact6, org, new Group[]{group}, new String[]{SystemRole.ContactManager.PublicId})
    createUser("bbaker", "gw", userContact7, org, new Group[]{group}, new String[]{SystemRole.ContactManager.PublicId})
    createUser("ccraft", "gw", userContact8, org, new Group[]{group}, new String[]{SystemRole.ContactManager.PublicId})
    createUser("dhenson", "gw", userContact9, org, new Group[]{group}, new String[]{SystemRole.ContactManager.PublicId})
    createUser("ClientAppCC", "gw", userContact10, org, new Group[]{group}, new String[]{SystemRole.ClientApp.PublicId})
    createUser("ClientAppPC", "gw", userContact11, org, new Group[]{group}, new String[]{SystemRole.ClientApp.PublicId})
    createUser("ClientAppBC", "gw", userContact12, org, new Group[]{group}, new String[]{SystemRole.ClientApp.PublicId})
    createUser("dpofficer", "gw", userContact13, org, new Group[]{group}, new String[]{SystemRole.DataProtectionOfficer.PublicId})

    createCompany("Manning and Sons", address10, "317-333-5900", "contact@manning.com")
    createCompany("Kennedy Insurance Group", address11, "317-333-5900", "info@kennedygroup.com")
  }
  
  private function createUser(userName:String, password:String, userContact:UserContact, org: Organization, groups:Group[], roles: String[]) : User {
    var cred = gw.api.database.Query.make(entity.Credential).compare("UserName", Equals, userName).select().AtMostOneRow
    if (cred == null) {
      var ub = new UserBuilder()
        .withContact( userContact )
        .withCredential( new CredentialBuilder().withUserName(userName).withPassword(password).create() )
        .withUserSettings(new UserSettingsBuilder().create())
      if (org != null) { 
        ub = ub.withOrganization( org )
      }
      for (group in groups) {
         ub.withGroup( group )
      }
      for (role in roles) {
        ub = ub.withRoleByPublicId( role )
      }
      return ub.createAndCommit()
    }
    return null
  }
  
  private function createUserContact(firstName:String, lastName:String, address:Address, workPhonePrimary:Boolean, workPhone:String, email:String) : UserContact {
    var uc = gw.api.database.Query.make(entity.UserContact).compare("FirstName", Equals, firstName).compare("LastName", Equals, lastName).select().AtMostOneRow
    if (uc == null) {
      var builder =  new UserContactBuilder()
            .withFirstName(firstName)
            .withLastName(lastName)
            .withPrimaryAddress(address)
            .withWorkPhone(workPhone)
            .withEmailAddress1(email)
      if (workPhonePrimary) {
        builder.withPrimaryPhoneType(PrimaryPhoneType.TC_WORK)
      }
      return builder.createAndCommit()
    }
    return uc
  }
  
  private function createCompany(name:String, address:Address, fax:String, email:String) : Company {
    var company = gw.api.database.Query.make(entity.Company).compare("Name", Equals, name).select().AtMostOneRow
    if (company == null) {
      return new CompanyBuilder()
            .withName(name)
            .withPrimaryAddress(address)
            .withFax(fax)
            .withEmailAddress1(email)
            .createAndCommit()
    }
    return company
  }
}
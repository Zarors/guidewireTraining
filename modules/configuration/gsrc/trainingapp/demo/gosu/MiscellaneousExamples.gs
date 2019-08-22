package trainingapp.demo.gosu
uses java.util.Date
uses java.util.ArrayList
uses java.util.HashMap
uses java.io.File
uses gw.xml.XmlElement
uses javax.xml.namespace.QName
uses java.io.BufferedWriter
uses java.io.FileWriter
uses gw.api.util.TypecodeMapperUtil
uses trainingapp.base.QueryUtil

uses java.lang.Integer



class MiscellaneousExamples {

/* This is an example of a basic interval.
*/
  static function intervalExample () : void {
    
    for (i in 0..10) {
      print ("The value of i is " + i )
    }
    
  }

/* This is an example of null-safe operators. NOTE: This
   code will throw a null-pointer exception!
*/
/*  static function nullSafeOperatorExample () : void {
    
    var aContact = ta.QueryUtil.findContact("ab:5")
    print (aContact + "'s score is: " + aContact.Score)
    
    var scoreModifier : float = 0.175
    
    print (aContact.Score ?* scoreModifier) // returns null
    print (aContact.Score  * scoreModifier) // throws NPE
    
  }*/ //TODO: not working in 9.0


/* This is an example of using an enum.
*/
  static function usingEnumExample () : void {
    
    var aShapeColor = trainingapp.demo.gosu.ColorType.yellow
    print (aShapeColor.Name)
    print (aShapeColor.Code)
    print (aShapeColor.Ordinal)
    
  }


/* This is an example of using a custom annotation (@Author).
*/

  @Param("maxNumber", "the maximum number that could be returned")
  @Returns("A random number from 1 to a specified max")
  @Author("Edward Nygma", "2011-04-01") 
  static function pickRandomNumber ( maxNumber : int ) : int {

    var generator = new java.util.Random()
    // get a random integer from 0 to (maxNumber-1)
    var randomInteger : int = generator.nextInt(maxNumber)
    return (randomInteger+1)
  }


/* This is an example of using a list.
*/

  static function listExample () : void {

    var invalidIDlist = new ArrayList<String>(){"111", "222", "333"}      
    invalidIDlist.add("444")
    for (x in invalidIDlist) {
      print (x)
    }

    var invalidIDarray = new String[]{"111", "222", "333"}
    // no mechanism for adding a 4th value
    for (x in invalidIDarray) {
      print (x)
    }
  }


/* This is an example of using a hashmap.
*/

  static function hashmapExample () : void {
  
    var standardHourlyRate = new HashMap<String, java.lang.Integer>()
    // set values in hash map
    standardHourlyRate.put("generalliability", 262)
    standardHourlyRate.put("motorvehliability", 295)
    standardHourlyRate.put("personalinjury", 333)

    // look up value for specific law firm
    var lawFirm = QueryUtil.findLawFirm("ab:91")
    print ("Standard rate for " + lawFirm.Name + ": $" +
      standardHourlyRate.get(lawFirm.LawFirmSpecialty as java.lang.String)) 

  }
  

/* This is an example of using a generic method.
*/
  static function usingGenericsExample () : void {

    var stringList = new ArrayList<String>(){"abc", "def", "ghi"}
    var genericsWithString = new trainingapp.demo.gosu.GenericsExamples<String>()
    var lastString = genericsWithString.printAndReturnLastMember( stringList )

    var integerList = new ArrayList<Integer>(){123, 456, 789}
    var genericsWithInteger = new trainingapp.demo.gosu.GenericsExamples<Integer>()
    var lastInteger = genericsWithInteger.printAndReturnLastMember( integerList )

    print ("Returned values: " + lastString + ", " + lastInteger)
    
  }  


/* This is an example of parsing untyped XML.
*/
  static function parseXMLExample () : void {
    
    var xmlFile = new File("modules/configuration/config/examples/xml/sampleAutoPolicy.xml")
    var xml = XmlElement.parse(xmlFile)
    var vehiclesOnPolicy = xml.$Children.singleWhere(\ el -> el.$QName.LocalPart == "Vehicles")
    for (currentVehicle in vehiclesOnPolicy.$Children) {
      var year = currentVehicle.$Children.singleWhere(\ el -> el.$QName.LocalPart == "Year").$Text
      var make = currentVehicle.$Children.singleWhere(\ el -> el.$QName.LocalPart == "Make").$Text
      var model = currentVehicle.$Children.singleWhere(\ el -> el.$QName.LocalPart == "Model").$Text
      print (year + " " + make + " " + model)
    }
    
  }
  
  
/* This is an example of modifying and exporting untyped XML.
*/
  static function exportXMLExample () : void {
    
    var xmlFile = new File("modules/configuration/config/examples/xml/sampleAutoPolicy.xml")
    var xml = XmlElement.parse(xmlFile)
    var vehiclesOnPolicy = xml.$Children.singleWhere(\ el -> el.$QName.LocalPart == "Vehicles")
    for (currentVehicle in vehiclesOnPolicy.$Children) {
      var year = currentVehicle.$Children.singleWhere(\ el -> el.$QName.LocalPart == "Year").$Text
      var make = currentVehicle.$Children.singleWhere(\ el -> el.$QName.LocalPart == "Make").$Text
      var model = currentVehicle.$Children.singleWhere(\ el -> el.$QName.LocalPart == "Model").$Text
      var summary = new XmlElement(new QName(
                 "http://guidewire.com/ab/gx/external.pas.paspersonalautopolicymodel", "Summary"))
      summary.set$Text(year + " " + make + " " + model)
      currentVehicle.addChild(summary)
    }
    var outputAsUTFStringFile = "modules/configuration/config/examples/xml/sampleAutoPolicyModified.xml"
    var outputAsUTFString = new BufferedWriter(new FileWriter(new File(outputAsUTFStringFile)))
    outputAsUTFString.write(xml.asUTFString())
    outputAsUTFString.close()
    
  }


/* This is an example of using the Typecode Mapper utility.
*/
  static function usingTypecodeMapperExample () : void {
    
    var caseTypeList = new ArrayList<String>(){"fraud", "medicalMalpractice",
                   "personalNegligence", "corporateNegligence", "wrongfulDeath"}              

    for (currentCode in caseTypeList) {
       print (TypecodeMapperUtil.getTypecodeMapper().getInternalCodeByAlias(
                                    "LegalCaseType", "acme:legal", currentCode))
    }
  }


/* This is an example of creating (and discarding) a user contact
   using entity builders.
*/

  static function createSampleUserContact () : void {
        
    var sampleAddress = new gw.api.databuilder.AddressBuilder()
      .withCity("SampleCity")
      .withState(State.TC_AB)
      .create()
      
    var sampleUser = new gw.api.databuilder.UserContactBuilder()
      .withFirstName("Test")
      .withLastName("User")
      .withPrimaryAddress(sampleAddress)
      .create()
      
    print (sampleUser.PrimaryAddress.City)

  }


/* This is an example of creating and committing a user contact
   using entity builders.
*/

  static function createSampleUserContactAndCommit () : void {
   
    var sampleAddress = new gw.api.databuilder.AddressBuilder()
      .withCity("SampleCity")
      .withState(State.TC_AB)
      .createAndCommit()
      
    var sampleUser = new gw.api.databuilder.UserContactBuilder()
      .withFirstName("Test")
      .withLastName("User")
      .withPrimaryAddress(sampleAddress)
      .createAndCommit()
      
    print (sampleUser.PrimaryAddress.City)

  }


/* This is an example of a function that you might want to test
   using a GUnit test. (The test is in Tests -> SampleTest ->
   BirthdayTest
*/

  public static function isBirthdayInFuture (anABContact: ABContact) : Boolean {
    return anABContact typeis ABPerson and
           anABContact.DateOfBirth != null and
           anABContact.DateOfBirth > gw.api.util.DateUtil.currentDate()
  }
  
 
/* When testing code, you may have situations where you want the system to
   do nothing for a set period of time. (For example, perhaps you want to
   trigger some other process and have it complete while the first process
   is in action.) You can do this in Gosu by using the Java Thread.sleep()
   method. The following code will force a Gosu process to wait X
   seconds (and verify with print statements that it is waiting).
*/  
  static function waitForXSeconds( waitTime : int, mustPrint : boolean) : void {
    var output = ""
    for (x in 1..waitTime) {
      output += "Suspended - second #: " + x
      java.lang.Thread.sleep(1000); // do nothing for 1000 miliseconds (1 sec)
    }
    if (mustPrint==true) {
       print(output)
    }
  }


/* This code returns the current date.
*/ 
  static function getCurrentDate () : Date {

    return (gw.api.util.DateUtil.currentDate())
  }

}

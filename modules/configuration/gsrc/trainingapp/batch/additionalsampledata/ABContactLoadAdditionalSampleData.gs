package trainingapp.batch.additionalsampledata

uses java.io.BufferedReader
uses java.io.File
uses java.io.FileReader
uses java.io.IOException

uses gw.api.databuilder.ABPersonBuilder
uses gw.api.databuilder.AddressBuilder
uses gw.pl.exception.GWConfigurationException
uses gw.transaction.Transaction

/**
 * Created by training.
 */
class ABContactLoadAdditionalSampleData {

  static function loadDataFromCSV() : String {

    var path = "./training/AdditionalTrainingSampleData.csv"
    var br: BufferedReader = null;
    var elems : String[]
    var addr : Address
    var pers : ABPerson
    var ct : int
    try {

      var sCurrentLine: String

      var f = new File(path);
      if(!f.exists()) {
        throw new GWConfigurationException("AdditionalTrainingSampleData.csv does not exist in TrainingApp directory")
      }

      br = new BufferedReader(new FileReader(path))

      do {
        sCurrentLine = br.readLine()
        if(sCurrentLine != null) {
          Transaction.runWithNewBundle(\b -> {
            elems = sCurrentLine.split(',')
            addr = new AddressBuilder()
                .withAddressType(AddressType.TC_HOME)
                .withAddressLine1(elems[3])
                .withCity(elems[4])
                .withState(typekey.State.get(elems[5]))
                .withPostalCode(elems[6])
                .create(b)

            pers = new ABPersonBuilder()
                .withPublicId(elems[0])
                .withFirstName(elems[1])
                .withLastName(elems[2])
                .withPrimaryAddress(addr)
                .create(b)
            ct++
            print(ct + ".  " + pers.DisplayName)

          }, "su")
        }
      }

      while (sCurrentLine != null)

    } catch (e : IOException) {
      e.printStackTrace();
    } finally {
      try {
        if (br != null) br.close();
      } catch (ex : IOException) {
        ex.printStackTrace();
      }
    }
    return ct + " additional ABPerson contacts successfully loaded"
  }
}

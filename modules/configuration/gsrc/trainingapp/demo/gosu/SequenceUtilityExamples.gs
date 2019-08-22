package trainingapp.demo.gosu
uses gw.api.system.database.SequenceUtil

class SequenceUtilityExamples {

  public static function printTwoSequenceNumbers (seqString : String) : void {
    var firstNum = SequenceUtil.next(1, seqString)
    print (seqString + "-" + firstNum)
    var nextNum = SequenceUtil.next(1, seqString)      
    print (seqString + "-" + nextNum)
  }

  public static function printSeqNumAsSixCharString (seqString : String) : void {
    var sequenceNum = SequenceUtil.next(1, seqString)
    // formatNumber() with a second parameter of "000000" formats the number
    // as a six-character string with left-padded 0s as needed
    var sequenceString = gw.api.util.StringUtil.formatNumber(sequenceNum, "000000")
    print (sequenceString)
  }
  
}


package gw.api.address

uses java.lang.StringBuilder

@Export
class PostalCodeInputFormatter {

  /** Normalize user input for postal codes.  */
  public static function convertPostalCode(postalCode : String, country : Country) : String {
    if (postalCode == null) {
      return null
    }
    postalCode = normalizeJapaneseCharacters(postalCode)
    postalCode = postalCode.toUpperCase()

    if (country == Country.TC_CA and postalCode.length == 6 and not postalCode.contains(" ")) {
      // add a space if needed, e.g. "A1A1A1" -> "A1A 1A1"
      postalCode = postalCode.substring(0, 3) + " " + postalCode.substring(3)
    } else if (country == Country.TC_JP and postalCode.length == 7 and not postalCode.contains("-")) {
      // add a dash if needed, e.g. "1234567" -> "123-4567"
      postalCode = postalCode.substring(0, 3) + "-" + postalCode.substring(3)
    } else if (country == Country.TC_US and postalCode.length == 9 and not postalCode.contains("-")) {
      // add a dash if needed, e.g. "123456789" -> "12345-6789"
      postalCode = postalCode.substring(0, 5) + "-" + postalCode.substring(5)
    }
    return postalCode
  }

  private static var inputChar   = "　０１２３４５６７８９ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺー―－‐" // U+30FC, U+2015, U+FF0D, U+2010
  private static var outputChar  = " 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ----"

  private static function normalizeJapaneseCharacters(value: String) : String {
    var sb = new StringBuilder()
    for (ch in value.toCharArray()) {
      var ind = inputChar.indexOf( ch )
      sb.append(ind >= 0 ? outputChar[ind] : ch )
    }
    return sb.toString()
  }

}
package gw.api.privacy
uses java.lang.StringBuilder
uses java.lang.Character

@Export
class EncryptionMaskExpressions {

  private construct() {}
  static final var MASK = "*"
  static final var MASK_CHAR = MASK.charAt(0)
  
  /**
   * Masks the first five digits of a given Tax ID. This method only applies
   * if the Tax ID is of the US format xxx-xx-xxxx -- any other input is
   * invalid (in addition the field validators on TaxID input fields will 
   * enforce this). 
   * 
   * If another format is defined and used, you must create your own masking function.
   * 
   */
  static function maskTaxId(val : String) : String {
    return maskString(val, 5, 4)
  }

  /**
   * Masks all but the last three digits of a given bank account number. If
   * the number has four digits or less, the entire account number is masked.
   */
  static function maskBankAccountNumber(val : String) : String {
    var result : String
    final var MASK_LENGTH = 7
    final var VISIBLE_CHARS = 3
    final var MINIMUM_CHARS_BEFORE_MASKING = VISIBLE_CHARS + 1
  
    if (val != null) {
      if (val.length > MINIMUM_CHARS_BEFORE_MASKING) {
        result = MASK.repeat(MASK_LENGTH - VISIBLE_CHARS)
                + val.substring(val.length - VISIBLE_CHARS, val.length)
      } else {
        result = MASK.repeat(MASK_LENGTH)
      }
    } else {
      result =  null
    }
  
    return result
  }


  static function maskString(val : String, maskLen : int, numVis : int) : String {
    if (val == null) {
      return null
    }
    var rtn = new StringBuilder(val)
    if (val.length < numVis + 1) {
      return MASK.repeat(maskLen)
    }
    for (i in 0..|(val.length - numVis)) {
      if (Character.isLetterOrDigit(rtn.charAt(i))) {
        rtn.setCharAt(i, MASK_CHAR)
      }
    }
    return rtn.toString()
  }
}

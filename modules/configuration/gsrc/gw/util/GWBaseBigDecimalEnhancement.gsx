package gw.util

 uses gw.api.util.LocaleUtil

 enhancement GWBaseBigDecimalEnhancement : java.math.BigDecimal {

   /**
    * Converts the BigDecimal to a localized string.
    **/
   property get DisplayValue() : String {
     return this != null ? LocaleUtil.CurrentLocale.getNumberFormat(this.scale()).getJavaNumberFormat().format(this) : null
   }
 }
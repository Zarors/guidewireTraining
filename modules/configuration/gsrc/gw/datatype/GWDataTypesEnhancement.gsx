package gw.datatype
uses gw.lang.reflect.IPropertyInfo
uses java.math.BigDecimal
uses java.math.RoundingMode

enhancement GWDataTypesEnhancement : gw.datatype.DataTypes {
  
  /**
   * Rounds the given decimal value to the scale required by the datatype associated with the given property, if any.
   * If the property has no datatype, or if its datatype does not have a maximum scale, then <tt>value</tt> is returned.
   * Otherwise, <tt>value</tt> is rounded according to <tt>roundingMode</tt> and returned.
   */
  static function round(ctx : Object, prop : IPropertyInfo, value : BigDecimal, roundingMode : RoundingMode) : BigDecimal {
    var dataType = DataTypes.get(prop)
    if (dataType != null) {
      value = dataType.asConstrainedDataType().round(ctx, prop, value, roundingMode)
    }
    return value
  }
}

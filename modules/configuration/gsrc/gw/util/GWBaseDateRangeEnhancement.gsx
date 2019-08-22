package gw.util
uses java.util.Date
uses java.util.Iterator
uses gw.api.util.DateUtil

enhancement GWBaseDateRangeEnhancement : gw.util.DateRange 
{
  function byBusinessDay() : Iterator<Date>
  {
    this.setIncr( \ d -> DateUtil.addBusinessDays(d, this.IncrementAmount) )
    return this
  }  
}

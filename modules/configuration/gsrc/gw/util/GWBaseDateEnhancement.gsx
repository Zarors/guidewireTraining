package gw.util;
uses java.util.Date;
uses gw.api.util.DateUtil;
uses gw.api.util.StringUtil
uses gw.i18n.DateTimeFormat

enhancement GWBaseDateEnhancement : Date {

  /**
     * Converts the date portion of this date into a string, using the "short" date format, in the current locale.
     * @deprecated Use formatDate(gw.i18n.DateTimeFormat) instead.
     */
  function formatToUIStyle() : String {
      return StringUtil.formatDate(this, "short")
  }

  /**
   * Converts this date into a string, using the given date and time formats, in the current locale.
   */
  function formatDateTime(dateComponent : DateTimeFormat, timeComponent : DateTimeFormat) : String {
    if( dateComponent == null )
    {
      return StringUtil.formatTime( this, timeComponent as String );
    }

    if( timeComponent == null )
    {
      return StringUtil.formatDate( this, dateComponent as String );
    }

    return StringUtil.formatDate( this, dateComponent as String) + " " +
           StringUtil.formatTime( this, timeComponent as String);
  }
  
  /**
   * Converts the date portion of this date into a string, using the given date format, in the current locale.
   */
  function formatDate(dateFormat : DateTimeFormat) : String {
    return formatDateTime(dateFormat, null)
  }
  
  /**
   * Converts the time portion of this date into a string, using the given time format, in the current locale.
   */
  function formatTime(timeFormat : DateTimeFormat) : String {
    return formatDateTime(null, timeFormat)
  }

  /**
     * The name of the month of the year.
     *
     * @return The name of the month of the year.
     */
  property get MonthName() : String {
      return Date.getMonthName(DateUtil.getMonth(this))
  }

  static function now() : String {
    var now = com.guidewire.pl.system.dependency.PLDependencies.getSystemClock().getDateTime()
    return gw.config.CommonServices.getCoercionManager().formatDate( now, "medium" ) + " " +
           gw.config.CommonServices.getCoercionManager().formatTime( now, "short" );
  }

}

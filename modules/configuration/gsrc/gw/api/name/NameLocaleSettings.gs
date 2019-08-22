package gw.api.name
uses com.guidewire.commons.metadata.i18n.config.GWLocale

uses java.util.*

uses gw.api.system.PLLoggerCategory
uses gw.api.util.LocaleUtil

@Export
/**
 * Provides locale-specific name settings
 */
class NameLocaleSettings {
  private static final var validPCFModes : Set<String> = { "default", "Japan", "", null }
  private static final var validTextFormatModes : Set<String> = { "default", "France", "Japan", "", null }

  private static final var field = NameOwnerFieldId

  // default fields shown when editing a name (if not specified for the locale)
  private static final var DEFAULT_FIELDS : Set<NameOwnerFieldId> = new HashSet<NameOwnerFieldId>() {
    field.PREFIX, field.FIRSTNAME, field.MIDDLENAME, field.LASTNAME, field.SUFFIX, field.NP_NAME
          }.freeze()

  // fields shown in display names
  @Deprecated("Please use NameOwnerFieldId.DISPLAY_NAME_FIELDS instead")
  public static final var DEFAULT_DISPLAY_NAME_FIELDS : Set<NameOwnerFieldId> = NameOwnerFieldId.DISPLAY_NAME_FIELDS

  static property get Locale() : GWLocale {
    var _locale = LocaleUtil.getCurrentLocale()
    init(_locale)
    return _locale
  }

  static private function init(_locale : GWLocale) {
    if (_locale.NameOwnerFieldIds == null) {
      if (not validPCFModes.contains(_locale.PCFMode)) {
        PLLoggerCategory.GLOBALIZATION_CONFIG.error("Error: In ${_locale.Code}/localization.xml, \"${_locale.PCFMode}\" is not a valid PCFMode")
      }
      if (not validTextFormatModes.contains(_locale.TextFormatMode)) {
        PLLoggerCategory.GLOBALIZATION_CONFIG.error("Error: In ${_locale.Code}/localization.xml, \"${_locale.TextFormatMode}\" is not a valid textFormatMode")
      }
      var fieldSet : Set<NameOwnerFieldId> = { }
      for (visibleField in _locale.VisibleFields) {
        var fieldId = NameOwnerFieldId.ALL_PCF_FIELDS.firstWhere( \ elt -> elt.Name == visibleField)
        fieldSet.add(fieldId)
        if (fieldId == null) {
          PLLoggerCategory.GLOBALIZATION_CONFIG.error("Error: In ${_locale.Code}/localization.xml, \"${visibleField}\" is not a valid visibleField name")
        }
      }
      _locale.NameOwnerFieldIds = fieldSet
    }
  }

  /**
   * The list of fields that appear in names for the current locale
   */
  public static property get VisibleFields() : Set<NameOwnerFieldId> {
    var fields = Locale.NameOwnerFieldIds as Set<NameOwnerFieldId>
    return fields.HasElements ? fields : DEFAULT_FIELDS
  }

  /**
   * The PCF mode to use for the current locale
   */
  public static property get PCFMode() : String {
    var mode = Locale.PCFMode
    return mode.HasContent ? mode : "default"
  }

  /**
   * The TextFormatting mode to use for the current locale
   */
  public static property get TextFormatMode() : String {
    var mode = Locale.TextFormatMode
    return mode.HasContent ? mode : "default"
  }
}

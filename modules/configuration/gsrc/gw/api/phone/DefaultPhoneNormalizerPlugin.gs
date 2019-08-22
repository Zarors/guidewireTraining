package gw.api.phone

uses java.util.Arrays
uses java.util.Collections
uses java.util.HashSet
uses java.lang.Character
uses java.util.Map
uses java.util.Map.Entry
uses java.util.List
uses java.util.regex.Pattern
uses java.lang.StringBuilder
uses gw.plugin.phone.IPhoneNormalizerPlugin
uses java.lang.StringBuffer
uses gw.api.util.phone.GWPhoneNumber
uses gw.api.util.PhoneUtil

uses gw.api.util.phone.EntityPhoneMapper
uses gw.entity.IEntityType
uses java.util.HashMap
uses java.util.ArrayList
uses gw.util.concurrent.LockingLazyVar
uses java.util.Iterator

uses org.apache.commons.lang.StringUtils


uses gw.lang.reflect.ReflectUtil

uses gw.api.archiving.upgrade.IArchivedEntity
uses gw.api.util.phone.PhoneColumnProperties
uses gw.api.archiving.upgrade.IArchivedTypekey

uses com.guidewire.pl.domain.archiving.upgrade.ArchivedDocumentUpgradeContext
uses gw.api.system.PLLoggerCategory

@Export
class DefaultPhoneNormalizerPlugin extends AbstractPhoneNormalizerPlugin {

  /**
   * Adds the default mappers for Contact and subtypes.
   */
  override property get EntityPhoneMapperEntries() : Map<IEntityType, List<EntityPhoneMapper>> {
      var phoneMapper = new HashMap<IEntityType, List<EntityPhoneMapper>>()
      ContactPhoneMappers.addContactPhoneMappers(phoneMapper)
      return phoneMapper
  }

}


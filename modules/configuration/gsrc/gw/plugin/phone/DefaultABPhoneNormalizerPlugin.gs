package gw.plugin.phone

uses gw.api.phone.DefaultPhoneNormalizerPlugin
uses gw.api.util.phone.EntityPhoneMapper
uses gw.entity.IEntityType
uses gw.util.concurrent.LockingLazyVar

uses java.util.ArrayList
uses java.util.HashMap
uses java.util.Map
uses java.util.List

/**
 * This is the default AB implementation of the IPhoneNormalizerPlugin interface. It extends the DefaultPhoneNormalizerPlugin
 * adding support for updating phone numbers in ABContact and ABPerson.
 * If you have modified the logic in DefaultPhoneNormalizerPlugin for your configuration, just copy that new version
 * in place, but still register this plugin implementation as the plugin for AB, as it will add support for
 * ABContact and ABPerson.
 */

@Export
class DefaultABPhoneNormalizerPlugin extends DefaultPhoneNormalizerPlugin {

  static var AB_TYPES_ADDED = new LockingLazyVar<Boolean>() {
    override public function init() : Boolean {
      return Boolean.FALSE
    }
  }

  static final var AB_PHONE_MAPPER = new LockingLazyVar<Map<IEntityType, List<EntityPhoneMapper>>>(){
    override public function init() : Map<IEntityType, List<EntityPhoneMapper>>{
      var phoneMapper = new HashMap<IEntityType, List<EntityPhoneMapper>>()
      var abContactPhoneMapper = new EntityPhoneMapper(ABContact)
          .withPhoneColumns("FaxPhoneCountry", "FaxPhone", "FaxPhoneExtension")
          .withPhoneColumns("HomePhoneCountry", "HomePhone", "HomePhoneExtension")
          .withPhoneColumns("WorkPhoneCountry", "WorkPhone", "WorkPhoneExtension")

      var abPersonPhoneMapper = new EntityPhoneMapper(ABPerson)
          .withPhoneColumns("CellPhoneCountry", "CellPhone", "CellPhoneExtension")

      var abContactMapperListPhone = new ArrayList<EntityPhoneMapper>()
      abContactMapperListPhone.add(abContactPhoneMapper)
      abContactMapperListPhone.add(abPersonPhoneMapper)

      phoneMapper.put(ABContact,java.util.Collections.unmodifiableList(abContactMapperListPhone))
      return phoneMapper
    }
  }

  override property get EntityPhoneMapperEntries() : Map<IEntityType, List<EntityPhoneMapper>>{
    var phoneMapper = super.EntityPhoneMapperEntries
    if(!AB_TYPES_ADDED.get()) {
      phoneMapper.putAll(AB_PHONE_MAPPER.get())
      AB_TYPES_ADDED.get()
    }
    return phoneMapper
  }

}
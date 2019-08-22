package gw.contactmapper.ab1000

uses gw.api.system.ABLoggerCategory

/**
 * Returns the ContactIntegrationMapper to be used by ContactManager
 * for integration.  It's @Export so customers can make the get() method return
 * a different ContactIntegrationMapper.
 */
@Export
class ContactIntegrationMapperFactory {
  private static var _logger = ABLoggerCategory.ABContactAPI

  public static function get() : ContactIntegrationMapper {
    var mapper = new ContactMapper()
    _logger.trace("ContactIntegrationMapperFactory.get() returned a " + mapper.IntrinsicType.Name)
    return mapper
  }
}

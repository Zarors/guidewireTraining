package gw.webservice

uses gw.xml.ws.WsdlConfig

/**
 * Provides functionality to create new configs pre-populated with a username and password, for use by
 * any web-service API.
 */
@Export
class WsdlConfigTestUtil {
  
  private static var DEFAULT_USER = "su"
  private static var DEFAULT_PASSWORD = "gw"

  private construct() {
    // no instances allowed
  }

  /**
   * Create a new WsdlConfig instance with the default username and password.
   */
  static function newConfig() : WsdlConfig {
    return newConfig(DEFAULT_USER, DEFAULT_PASSWORD)
  }
  
  /**
   * Create a new WsdlConfig instance with the given username and password.
   */
  static function newConfig(username : String, password : String) : WsdlConfig {
    var config = new WsdlConfig()
    config.Guidewire.Authentication.Username = username == null ? DEFAULT_USER : username
    config.Guidewire.Authentication.Password = password == null ? DEFAULT_PASSWORD : password
    return config
  }
}

package gw.plugin.credentials.impl

uses gw.api.util.ConfigAccess
uses gw.pl.logging.LoggerCategory
uses gw.plugin.InitializablePlugin
uses gw.plugin.PluginParameter
uses gw.plugin.credentials.CredentialsUtil
uses gw.plugin.credentials.UsernamePasswordPairBase
uses gw.util.StreamUtil
uses gw.xsd.credentials.CredentialsArray
uses org.slf4j.Logger

uses java.io.FileInputStream

/**
 * This class is a rudimentary implementation of the CredentialsPlugin, normally these credentials would be stored
 * in some external repository and accessed via the directory service.  I strengthen this to permit not have password stored
 * in plaintext in the war, but it is still suggested that this be even more secure by extracting this information from the
 * external directory.
 *
 * parameter "credentialsFile" the file containing the credentials
 * parameter "FileEncryptionId" the IEncryption plugin identifier for the plugin to use to decrypt the file
 * parameter "PasswordEncryptionId" the IEncryption plugin identifier to the plugin to use to decrypt the password
 *
 * If you specify an encryption id, that is the id of an encryption plugin.  The interface encrypts strings to string, and
 * decrypts strings to strings.  So most plugins have an additional step to turn the encrypted bytes back to a string.
 * PBEEncryptionPlugin uses Base64 encoding for example. So typically to make a compatible input document, you run a simple
 * script in the gosu scratch pad to call that plugin to encrypt and write out the file.
 *
 * Note that the CredentialsPlugin.gwp file also supports env so this can have different configurations for production and
 * development environments.
 */
@SuppressWarnings("unused")
@Export
@PluginParameter(:name="credentialsFile", :required=true, :type=String)
@PluginParameter(:name="PasswordEncryptionId", :type=String)
@PluginParameter(:name="FileEncryptionId", :type=String)
class CredentialsPlugin implements gw.plugin.credentials.CredentialsPlugin, InitializablePlugin {
  private var _logger : Logger = null;
  private var CREDENTIALS_FILE_PROPERTY = "credentialsFile" // the filename relative to the configuration module
  private var FILE_ENCRYPTION_PLUGIN_ID_PROPERTY = "FileEncryptionId" // the encryption id for the file
  private var PASSWORD_ENCRYPTION_PLUGIN_ID_PROPERTY = "PasswordEncryptionId" // the encryption id for the entry
  var _map = new HashMap<String, UsernamePasswordPairBase>();
  private var _passwordEntryptionId : String

  construct() {
    _logger = LoggerCategory.PLUGIN;
    _logger.info("*** CredentialsPlugin is initialized.***");
  }

  override property set Parameters(properties : Map<Object,Object>) : void {
    var credentialsFileName = properties.get(CREDENTIALS_FILE_PROPERTY) as String
    var encryptionId = properties.get(FILE_ENCRYPTION_PLUGIN_ID_PROPERTY) as String
    _passwordEntryptionId = properties.get(PASSWORD_ENCRYPTION_PLUGIN_ID_PROPERTY) as String
    loadMap(credentialsFileName, encryptionId)
    if (_passwordEntryptionId != null) {
      CredentialsUtil.getEncryptionPlugin(_passwordEntryptionId) // fail early if not found
    }
  }

 /**
  * Return a username and password for a given key.
  *
  * @param key a key identifying which username/password pair is desired
  * @return UsernamePasswordPairBase contains the username and password to use
  */
  override function retrieveUsernameAndPassword(key : String) : UsernamePasswordPairBase {
    var entry = _map.get(key)
    return _passwordEntryptionId == null ? entry
        : new UsernamePasswordPairBase(entry.Username, CredentialsUtil.getEncryptionPlugin(_passwordEntryptionId).decrypt(entry.Password));
  }

  private function loadMap(credentialsFileName : String, encryptionId : String) {
    var credentialsFile = ConfigAccess.getConfigFile(credentialsFileName)
    if (credentialsFile == null || !credentialsFile.exists()) {
      throw new RuntimeException("CredentialsPlugin could not find " + credentialsFile)
    }
    try {
      var content = StreamUtil.getContent(new FileInputStream(credentialsFile))
      var work = encryptionId == null
          ? StreamUtil.toString(content)
          : CredentialsUtil.getEncryptionPlugin(encryptionId).decrypt(StreamUtil.toString(content))
      var credentialsArray = CredentialsArray.parse(work)
      for (child in credentialsArray.CredentialsElem) {
        _map.put(child.Key, new UsernamePasswordPairBase(child.Username, child.Password))
      }
    } catch ( e : Exception) {
      throw new RuntimeException("CredentialsPlugin could not load " + credentialsFile, e);
    }
  }

}

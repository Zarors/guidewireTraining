package gw.plugin.personaldata

uses gw.api.locale.DisplayKey
uses gw.api.system.PLLoggerCategory

@Export
class ABPersonalDataLogUtil {

  private construct(){
  }

  /**Utility method logs why the Plugin returns MUST_NOT_DESTROY
   * @param root an object the primary element the message applies to
   * @param message information regarding the MUST_NOT_DESTROY disposition
   * */
  public static function logInfoNotDestroyed(final root: DestructionRootPinnable, final message: String)
  {
    if(root typeis ABContact){
      PLLoggerCategory.DATA_DESTRUCTION_REQUEST.info(DisplayKey.get("Web.Plugin.PersonalDataDestruction.UnableToDestroyABContactWithPublicID", root, root.PublicID, root.LinkID, message))
    }
    else if(root typeis Contact){
      PLLoggerCategory.DATA_DESTRUCTION_REQUEST.info(DisplayKey.get("Web.Plugin.PersonalDataDestruction.UnableToDestroyContactWithPublicID", root, root.PublicID, root.AddressBookUID, message))
    }
    else{
      throw "Unexpected root type when logging PersonalData ${root.IntrinsicType}. Message = ${message}"
    }
  }

  /**Utility method logs when there is an error during the destruction and the ABContact was not destroyed
   * @param root an object the primary element the message applies to
   * @param message stacktrace information regarding the failure to destroy the ABContact
   * */
  public static function logErrorNotDestroyed(final root: DestructionRootPinnable, final exception: Exception)
  {
    if(root typeis ABContact){
      PLLoggerCategory.DATA_DESTRUCTION_REQUEST.error(DisplayKey.get("Web.Plugin.PersonalDataDestruction.UnableToDestroyABContactWithPublicID", root, root.PublicID, root.LinkID, exception.StackTraceAsString))
    }
    else if(root typeis Contact){
      PLLoggerCategory.DATA_DESTRUCTION_REQUEST.error(DisplayKey.get("Web.Plugin.PersonalDataDestruction.UnableToDestroyContactWithPublicID", root, root.PublicID, root.AddressBookUID, exception.StackTraceAsString))
    }
    else{
      PLLoggerCategory.DATA_DESTRUCTION_REQUEST.error("Unexpected root type when logging PersonalData ${root.IntrinsicType}. Message = ${exception.StackTraceAsString}")
    }
  }

}
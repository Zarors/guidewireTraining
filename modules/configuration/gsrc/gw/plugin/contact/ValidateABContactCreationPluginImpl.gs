package gw.plugin.contact

uses gw.api.contact.TooLooseContactCreateCriteriaException
uses gw.plugin.InitializablePlugin
uses java.util.Map

/**
 * Base implementation of the ABContact creation criteria plugin interface.
 * Users may override the helper methods to provide Locale-specific search
 * criteria in subclasses.
 */
@Export
public class ValidateABContactCreationPluginImpl extends ValidateABContactCreationPluginBase {

  override function initSubtypeSpecificValidation(): Map<typekey.ABContact,ABContactSubtypeLogic> {
    return {
        typekey.ABContact.TC_ABCOMPANY       -> new CreateLogic<ABCompany>(\ c -> abCompanyIsInvalid(c)),
        typekey.ABContact.TC_ABCOMPANYVENDOR -> new CreateLogic<ABCompanyVendor>(\ c -> abCompanyVendorIsInvalid(c)),
        typekey.ABContact.TC_ABPERSON        -> new CreateLogic<ABPerson>(\ c -> abPersonIsInvalid(c)),
        typekey.ABContact.TC_ABPERSONVENDOR  -> new CreateLogic<ABPersonVendor>(\ c -> abPersonVendorIsInvalid(c)),
        typekey.ABContact.TC_ABUSERCONTACT   -> new CreateLogic<ABUserContact>(\ c -> abUserContactIsInvalid(c)),
        typekey.ABContact.TC_ABPLACE         -> new CreateLogic<ABPlace>(\ c -> abPlaceIsInvalid(c))
    }
  }
}

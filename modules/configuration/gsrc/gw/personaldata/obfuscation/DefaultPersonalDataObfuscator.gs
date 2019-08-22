package gw.personaldata.obfuscation

uses gw.api.archiving.ArchiveDocumentReferencesUtil
uses gw.api.personaldata.DatabaseReferenceTrackerUtility
uses gw.api.personaldata.obfuscation.PersonalDataObfuscator
uses gw.entity.IEntityPropertyInfo
uses gw.transaction.AbstractBundleTransactionCallback

/**
 * Default implementation of {@link PersonalDataObfuscator} which
 * 1) for {@link PersonalDataTagValue.TC_OBFUSCATEUNIQUE} returns MD5 hash
 * 2) for everything else just original value
 */
@Export
class DefaultPersonalDataObfuscator extends PersonalDataObfuscator {

  construct(bean : Obfuscatable) {super(bean)}

  override function getObfuscatedValueForPersonalDataField(personalDataField: IEntityPropertyInfo, tagValue: String): Object {
    switch (tagValue) {
      case PersonalDataTagValue.TC_OBFUSCATEUNIQUE.Code:
        return PersonalDataObfuscatorUtil.computeMD5Padding(getOwner(), personalDataField)
      case PersonalDataTagValue.TC_OBFUSCATEDEFAULT.Code:
      default:
        return getOwner().getFieldValue(personalDataField)
    }
  }

  protected final function addCallback(callback: AbstractBundleTransactionCallback){
    getOwner().Bundle.addBundleTransactionCallback(callback)
  }

  protected final function removeUnreferencedNonRetireables(array: KeyableBean[]): void {
    array.each(\bean -> {
      if (not (bean typeis Retireable) and
          not DatabaseReferenceTrackerUtility.isReferencedFromDatabase(bean) and
          not ArchiveDocumentReferencesUtil.isReferencedFromArchiveDocument(bean)) {
        bean.remove()
      }
    })
  }

  protected function isOnlySingleOwner(bean: KeyableBean): boolean {
    if (bean == null or ArchiveDocumentReferencesUtil.isReferencedFromArchiveDocument(bean)) {
      return false
    }
    var allBeans = DatabaseReferenceTrackerUtility.getBeansThatPointToMe(bean)
    return allBeans.Count == 1
  }
}
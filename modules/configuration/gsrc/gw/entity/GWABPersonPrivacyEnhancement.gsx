package gw.entity
uses gw.api.privacy.EncryptionMaskExpressions

@Export
enhancement GWABPersonPrivacyEnhancement : entity.ABPerson {
  
  function maskTaxId(value : String) : String {
    return EncryptionMaskExpressions.maskTaxId(value)
  }
  
}

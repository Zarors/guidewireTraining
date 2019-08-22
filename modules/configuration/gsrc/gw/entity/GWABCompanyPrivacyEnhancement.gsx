package gw.entity
uses gw.api.privacy.EncryptionMaskExpressions

@Export
enhancement GWABCompanyPrivacyEnhancement : entity.ABCompany {
  
    function maskTaxId(value : String) : String {
      return EncryptionMaskExpressions.maskTaxId(value)
    }

}

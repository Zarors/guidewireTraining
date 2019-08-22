package gw.api.databuilder

@Export
class EFTDataBuilder extends DataBuilder<EFTData, EFTDataBuilder> {

  construct() {
    super(EFTData)
  }
  
  function withAccountName() : EFTDataBuilder {
    return withAccountName(UniqueKeyGenerator.get().nextID())
  }
  
  function withAccountName(name : String) : EFTDataBuilder {
    set(EFTData.Type.TypeInfo.getProperty("AccountName"), name)
    return this
  }
  
  function withBankAccountNumber() : EFTDataBuilder {
    return withBankAccountNumber(UniqueKeyGenerator.get().nextID())
  }
  
  function withBankAccountNumber(number : String) : EFTDataBuilder {
    set(EFTData.Type.TypeInfo.getProperty("BankAccountNumber"), number)
    return this
  }
  
  function withBankAccountType(type : BankAccountType) : EFTDataBuilder {
    set(EFTData.Type.TypeInfo.getProperty("BankAccountType"), type)
    return this
  }
  
  function withBankName() : EFTDataBuilder {
    return withBankName(UniqueKeyGenerator.get().nextID())
  }
  
  function withBankName(name : String) : EFTDataBuilder {
    set(EFTData.Type.TypeInfo.getProperty("BankName"), name)
    return this
  }
  
  function withBankRoutingNumber() : EFTDataBuilder {
    return withBankRoutingNumber(UniqueKeyGenerator.get().nextID())
  }
  
  function withBankRoutingNumber(number : String) : EFTDataBuilder {
    set(EFTData.Type.TypeInfo.getProperty("BankRoutingNumber"), number)
    return this
  }
  
  function isPrimary(isPrimary : boolean) : EFTDataBuilder {
    set(EFTData.Type.TypeInfo.getProperty("IsPrimary"), isPrimary)
    return this
  }
  
  function withUniqueDataAndBankAccountTypeAndPrimary(bankAccountType : BankAccountType ,isPrimary:Boolean) : EFTDataBuilder {
    this.set(EFTData.Type.TypeInfo.getProperty("AccountName"), UniqueKeyGenerator.get().nextID());
    this.set(EFTData.Type.TypeInfo.getProperty("BankAccountNumber"), UniqueKeyGenerator.get().nextID())
    this.set(EFTData.Type.TypeInfo.getProperty("BankAccountType"), bankAccountType)
    this.set(EFTData.Type.TypeInfo.getProperty("BankName"), UniqueKeyGenerator.get().nextID())
    this.set(EFTData.Type.TypeInfo.getProperty("BankRoutingNumber"), UniqueKeyGenerator.get().nextID())
    this.set(EFTData.Type.TypeInfo.getProperty("IsPrimary"), isPrimary)
    return this
  }
}

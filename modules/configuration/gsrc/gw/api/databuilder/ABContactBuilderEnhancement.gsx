package gw.api.databuilder

uses java.util.Date

@Export
enhancement ABContactBuilderEnhancement<T extends ABContact, B extends ABContactBuilder<T, B>> : gw.api.databuilder.ABContactBuilder<T, B> {

  reified function withEFTRecord(eftData : EFTData) : B {
    withEFTRecord(ExistingBean.wrap(eftData))
    return this as B
  }

  reified function withEFTRecord(eftData : ValueGenerator< EFTData >) : B {
    this.addArrayElement(ABContact.Type.TypeInfo.getProperty("EFTRecords"), eftData)
    return this as B
  }

  reified function withW9Received(received : boolean) : B {
    this.set(ABContact.Type.TypeInfo.getProperty( "W9Received" ), received)
    return this as B
  }

  reified function withW9ReceivedDate(receivedDate : Date) : B {
    this.set(ABContact.Type.TypeInfo.getProperty( "W9ReceivedDate" ), receivedDate)
    return this as B
  }

  reified function withW9ValidFrom(validFromDate : Date) : B {
    this.set(ABContact.Type.TypeInfo.getProperty( "W9ValidFrom" ), validFromDate)
    return this as B
  }

  reified function withW9ValidTo(validToDate : Date) : B {
    this.set(ABContact.Type.TypeInfo.getProperty( "W9ValidTo" ), validToDate)
    return this as B
  }

  reified function withDoNotDestroy(doNotPurge: boolean) : B {
    this.set(ABContact#DoNotDestroy, doNotPurge);
    return this as B
  }
}

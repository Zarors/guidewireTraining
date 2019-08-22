package gw.xml.ws

uses gw.xsd.guidewire.soapheaders.TransactionId

enhancement GwWsdlPortImplEnhancement : gw.internal.xml.ws.WsdlPortImpl {

  /** This function will set a transaction id into the config for the next call,
   * after the call it will be removed.
   *
   * Whether a guidewire application published service actually does anything
   * with this transaction id is dependent on whether that service is annotated
   * with WsiCheckDuplicateExternalTransaction
   *
   * @param transactionId the transaction id to set
   */
  function initializeExternalTransactionIdForNextUse( transactionId : String ) {
    this.getConfig().getRequestSoapHeaders().add( new TransactionId().withText( transactionId ) );
  }

}

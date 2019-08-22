package gw.personaldata

uses gw.api.database.IQuery
uses gw.api.database.IQueryBuilder
uses gw.api.personaldata.DataDestructionParameterCheck


/**
 * When a purge request is made to remove the contact a purge request is created.  This work queue picks up
 * purge requests that are in the NEW or RERUN status, and tries to purge the contact requested
 */
@Export
class PersonalDataContactDestructionWorkQueue extends PersonalDataBulkInsertWorkQueueBase<PersonalDataContactDestructionRequest> {

  construct() {
    super(BatchProcessType.TC_DESTROYCONTACTFORPERSONALDATA, StandardWorkItem, PersonalDataContactDestructionRequest)
  }

  override function processWorkItem(workItem : StandardWorkItem) {
    DataDestructionParameterCheck.verifyPersonalDataDestructionEnabled();
    var contactPurgeRequest = extractTarget(workItem)

    PersonalDataDestructionController.destroyContact(contactPurgeRequest)
    contactPurgeRequest.Bundle.commit()
  }

  override public function findTargets(query: IQueryBuilder): Iterator<PersonalDataContactDestructionRequest> {
    DataDestructionParameterCheck.verifyPersonalDataDestructionEnabled();
    var allUnprocessedStates = ContactDestructionStatus.getTypeKeys(false)
        .where(\elt -> elt.Categories.contains(ContactDestructionStatusCategory.TC_READYTOATTEMPTDESTRUCTION))

    query.compareIn(PersonalDataContactDestructionRequest#Status, allUnprocessedStates.toTypedArray())
    return (query as IQuery).select().iterator() as Iterator<PersonalDataContactDestructionRequest>
  }
}
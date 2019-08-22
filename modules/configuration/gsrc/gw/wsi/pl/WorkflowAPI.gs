package gw.wsi.pl

uses gw.api.locale.DisplayKey
uses gw.xml.ws.annotation.WsiWebService
uses gw.xml.ws.annotation.WsiAvailability
uses gw.api.webservice.workflow.WorkflowAPIImpl
uses gw.api.webservice.exception.EntityStateException
uses java.lang.IllegalArgumentException
uses gw.xml.ws.WsiAuthenticationException
uses gw.api.webservice.exception.BadIdentifierException
uses java.lang.RuntimeException
uses gw.xml.ws.annotation.WsiGenInToolkit
uses gw.api.database.Query
uses gw.api.database.Relop

/**
 * External API for performing operations on workflows.
 */
@WsiWebService("http://guidewire.com/pl/ws/gw/wsi/pl/WorkflowAPI")
@WsiAvailability(MAINTENANCE)
@WsiGenInToolkit
@Export
class WorkflowAPI  {

   
  /**
   * Sets the state of the workflow with public ID <code>workflowID</code>
   * to WorkflowState#TC_COMPLETED.
   *
   * @param workflowID the public id of the workflow
   */
  @Throws(BadIdentifierException, "If the workflow id did not match a valid workflow.")
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(EntityStateException, "if can not be forced into completion from this state")
  function complete(workflowID : String){
    getWorkflowByIdOrThrow(workflowID) // use to validate id so don't have to include com.guidewire classes
    new WorkflowAPIImpl().complete( workflowID )
  }
  
  
  /**   
   * Suspends the workflow with public ID <code>workflowID</code>.
   *
   * @param workflowID the public id of the workflow
   */
  @Throws(EntityStateException, "if can not be suspended from this state")
  @Throws(BadIdentifierException, "If the workflow id did not match a valid workflow.")
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function suspend(workflowID : String) {
    getWorkflowByIdOrThrow(workflowID) // use to validate id so don't have to include com.guidewire classes
    new WorkflowAPIImpl().suspend( workflowID )
  }
  
  /**
   * Resumes the workflow with public ID <code>workflowID</code>.
   *
   * The workflow engine will subsequently attempt to advance the workflow
   * to its next step. If an error occurs again, the error
   * will be logged and the workflow's state set to WorkflowState#TC_ERROR.
   *
   * @param workflowID the public id of the workflow
   */
   
  @Throws(EntityStateException, "if can not be resumed from this state")
  @Throws(BadIdentifierException, "If the workflow id did not match a valid workflow.")
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function resumeWorkflow(workflowID : String) {
    getWorkflowByIdOrThrow(workflowID) // use to validate id so don't have to include com.guidewire classes
    new WorkflowAPIImpl().resumeWorkflow( workflowID )
  }
  
  /**
   * Resumes all workflows in the state
   * WorkflowState#TC_ERROR or WorkflowState#TC_SUSPENDED.
   *
   * The workflow engine will subsequently attempt to advance these workflows
   * to their next steps. For each one, if an error occurs again, the error
   * will be logged and the workflow's state set to WorkflowState#TC_ERROR.
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function resumeAllWorkflows() {
    new WorkflowAPIImpl().resumeAllWorkflows()
  }
   
  /**
   * Invokes the triggerKey on the current step of the specified workflow causing
   * the workflow to advance to the next step.
   * If a null or invalid workflow ID is passed in, an exception will be thrown.  In
   * addition, if the triggerkey is null or the trigger is not available, an
   * exception will be thrown.
   *  
   * @param workflowID The ID of the workflow
   * @param triggerKey A workflow trigger key off the current workflow
   */  
  @Throws(IllegalArgumentException, "if trigger is not found.")
  @Throws(EntityStateException, "if trigger is not available.")
  @Throws(RuntimeException, "On failure to invoke trigger, typically trigger does not exist on current step.")
  @Throws(BadIdentifierException, "If the workflow id did not match a valid workflow.")
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function invokeTrigger(workflowID : String, triggerKey : String){
    isTriggerAvailable(workflowID, triggerKey)
    var workflow = getWorkflowByIdOrThrow(workflowID)
    var trigger = WorkflowTriggerKey.get(triggerKey);
    if (trigger == null) {
      throw new IllegalArgumentException(DisplayKey.get("Java.Workflow.Trigger.Invalid", triggerKey))
    }
    if (!workflow.isTriggerAvailable( typekey.WorkflowTriggerKey.get(triggerKey) )) {
      throw new EntityStateException(DisplayKey.get("Java.Workflow.Trigger.Unavaliable"))
    }
    new WorkflowAPIImpl().invokeTrigger( workflowID, trigger )
  }

  /**
   * True if the given trigger is available in the Workflow; i.e. if it is OK to pass the
   * trigger ID to the invokeTrigger method.
   *
   * @param workflowID The ID of the workflow
   * @param triggerKey A workflow trigger key off the current workflow
   */  
  @Throws(IllegalArgumentException, "if trigger is not found.")
  @Throws(BadIdentifierException, "If the workflow id did not match a valid workflow.")
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function isTriggerAvailable(workflowID : String, triggerKey : String) : boolean{
    var trigger = WorkflowTriggerKey.get(triggerKey);
    if (trigger == null) {
      throw new IllegalArgumentException(DisplayKey.get("Java.Workflow.Trigger.Invalid", triggerKey))
    }
    var workflow = getWorkflowByIdOrThrow(workflowID)
    return workflow.isTriggerAvailable( typekey.WorkflowTriggerKey.get(triggerKey) )
  }  
  
  //----------------------------------------------------------------- private helper methods
  
  /**
   * Get a workflow by its id or throw a SOAPException.
   */
  private function getWorkflowByIdOrThrow(workflowID : String ) : Workflow {
    var workflowQuery = Query.make(entity.Workflow).compare("PublicID", Relop.Equals, workflowID).select()
    var wf =  workflowQuery.getAtMostOneRow()
    if (wf == null){
      throw BadIdentifierException.badPublicId(Workflow, workflowID)
    }
    return wf
  }
}

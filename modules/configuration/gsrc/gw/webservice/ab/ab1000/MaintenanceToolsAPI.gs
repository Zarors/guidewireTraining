package gw.webservice.ab.ab1000

uses gw.api.tools.ProcessID
uses gw.api.webservice.ab.maintenanceTools.ABMaintenanceToolsImpl
uses gw.api.webservice.maintenanceTools.ProcessStatus
uses gw.api.webservice.maintenanceTools.WQueueStatus
uses gw.api.webservice.maintenanceTools.WorkQueueConfig
uses gw.xml.ws.WebServiceException
uses gw.xml.ws.WsiAuthenticationException
uses gw.xml.ws.annotation.WsiAvailability
uses gw.xml.ws.annotation.WsiGenInToolkit
uses gw.xml.ws.annotation.WsiWebService

/**
 * An API used for managing the application. This is distinct from
 * ISystemToolsAPI which is concerned with managing the application platform.
 */
@WsiWebService("http://guidewire.com/ab/ws/gw/webservice/ab/ab1000/MaintenanceToolsAPI")
@WsiAvailability(MAINTENANCE)
@WsiGenInToolkit
@Export
class MaintenanceToolsAPI {

  /**
   * Note: All methods are overridden to ensure that the javadoc and exceptions for this web service are properly generated.
   */

  /**
   * Return the set of valid batch process names
   *
   * @return String[]
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  public function getValidBatchProcessNames() : String[] {
    return getDelegate().ValidBatchProcessNames?.toTypedArray();
  }

   /**
   * Return whether a given batch process name is valid
   *
   * @return boolean
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function isBatchProcessNameValid(processName : String) : boolean {
    return getDelegate().isBatchProcessNameValid(processName);
  }

  /**
   * Starts the given batch process.  If the process is already running on the server,
   * an exception will be thrown.
   *
   * @param processName the name of the batch process to start
   * @return the ProcessID of the process that was started
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(IllegalArgumentException, "If no process exists with the given process name.")
  function startBatchProcess(processName : String) : ProcessID {
    return getDelegate().startBatchProcess( processName )
  }

  /**
   * Starts the given batch process with the given String arguments.  If the process is already running on the server,
   * an exception will be thrown.
   *
   * @param processName the name of the batch process to start
   * @param arguments the batch process arguments
   * @return the ProcessID of the process that was started
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(IllegalArgumentException, "If no process exists with the given process name.")
  function startBatchProcessWithArguments(processName : String, arguments : String[]) : ProcessID {
    return getDelegate().startBatchProcess( processName, arguments )
  }

  /**
   * Requests termination of the given batch process, if it's currently running.
   *
   * This method does not wait for the batch process to actually terminate
   *
   * @param processName the name of the batch process for which to request termination
   * @return true if the request was successful, false if the process could not be terminated
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function requestTerminationOfBatchProcessByName(processName : String) : boolean {
    return getDelegate().requestTerminationOfBatchProcess( processName )
  }

  /**
   * Requests termination of the given batch process, if it's currently running. Note that it's possible that
   * this particular invocation could have finished and another invocation of the same process
   * begun, in which case this won't request the termination of the current invocation.
   *
   * This method does not wait for the batch process to actually terminate
   *
   * @param pid the process ID of the process for which to request termination
   * @return true if the request was successful, false if the process could not be terminated
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(IllegalArgumentException, "Invalid processID")
  function requestTerminationOfBatchProcessByID(pid : ProcessID) : boolean {
    if (pid == null || pid.Pid <= 0) {
      throw new IllegalArgumentException("Invalid processID " + pid)
    }
    return getDelegate().requestTerminationOfBatchProcess( pid )
  }

  /**
   * Gets the status of the given batch process, indicating whether or not the process is running and,
   * if so, its current progress.
   *
   * @param processName the name of the process to retrieve the status of
   * @return the status of that particular process
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(IllegalArgumentException, "If no process exists with the given process name.")
  function batchProcessStatusByName(processName : String) : ProcessStatus {
    return getDelegate().batchProcessStatusByName( processName )
  }

  /**
   * Gets the status of a particular batch process invocation.  If that invocation is still running,
   * the status will indicate as much, and only the startDate and opsCompleted fields will be filled in.
   * Otherwise the returned object will contain information about
   * the completed run (see ProcessStatus for information about all the fields returned).
   *
   * @param pid the process ID to retrieve the status of
   * @return the status of that particular process invocation
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(IllegalArgumentException, "If no process exists with the given process id or invalid ProcessID.")
  function batchProcessStatusByID(pid : ProcessID) : ProcessStatus {
    if (pid == null || pid.Pid <= 0) {
      throw new IllegalArgumentException("Invalid processID " + pid)
    }
    return getDelegate().batchProcessStatusByID( pid )
  }

  /**
   * Get the current configuration of distributed workers for the
   * specified work queue.
   * @param queueName Name of the queue to query
   * @return A WorkQueueConfig instance containing the current settings
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(IllegalArgumentException, "If no work queue exists with the given name.")
  function getWorkQueueConfig(queueName : String) : WorkQueueConfig {
    return getDelegate().getWorkQueueConfig( queueName )
  }

  /**
   * Sets the configuration for distributed workers for the
   * specified work queue.  Any currently running worker
   * instances will be stopped after the current workitem in process
   * is completed.  New worker instances as specified by the passed
   * in config will be created and started.  Note that the
   * changes made here are temporary; if the server is restarted,
   * the initial values from config.xml will be used when creating
   * and starting workers.
   * @param queueName Name of the queue to modify
   * @param config The configuration to establish.
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(IllegalArgumentException, "If no work queue exists with the given name.")
  function setWorkQueueConfig(queueName : String, config : WorkQueueConfig){
    getDelegate().setWorkQueueConfig( queueName, config )
  }

  /**
   * Returns the list of work queue names for this product.
   * These names may be used in {@link #getWorkQueueConfig}
   * and {@link #setWorkQueueConfig}.
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function getWorkQueueNames() : String[]{
    return getDelegate().getWorkQueueNames()
  }

  /**
   * Wakes up all workers for the specified queue across the cluster.
   * Workers will check for workitems and will continue
   * processing any found until the workitem table for the
   * queue is empty.
   * @param queueName Name of the queue to notify workers
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(IllegalArgumentException, "If no work queue exists with the given name.")
  function notifyQueueWorkers(queueName : String){
    getDelegate().notifyQueueWorkers( queueName )
  }

  /**
   * This will stop the specified ied work queue.
   * @param queueName Name of the queue
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(IllegalArgumentException, "If no work queue exists with the given name.")
  function stopWorkQueueWorkers(queueName : String) {
    getDelegate().stopWorkQueueWorkers(queueName)
  }

  /**
   * This will start the workqueue workers
   * @param queueName Name of the queue
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(IllegalArgumentException, "If no work queue exists with the given name.")
  function startWorkQueueWorkers(queueName : String) {
    getDelegate().startWorkQueueWorkers(queueName)
  }
  /**
   * Retrieves the status of active executors for that particular queue. Each executor contains information
   * about last 25 workers ran by each executor.
   *
   * @param queueName name of the queue
   * @return The status of the queue
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(IllegalArgumentException, "If no work queue exists with the given name.")
  function getWQueueStatus(queueName : String) : WQueueStatus {
    return getDelegate().getWQueueStatus( queueName )
  }

  /**
   * Retrieves the number of active work items for a queue
   *
   * @param queueName name of the queue
   * @return The status of the queue
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(IllegalArgumentException, "If no work queue exists with the given name.")
  function getNumActiveWorkItems(queueName : String) : int {
    return getDelegate().getNumActiveWorkItems( queueName )
  }

  /**
   * Wait on the active work items for a queue
   *
   * @param queueName name of the queue
   * @return true if the queue is now empty
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(IllegalArgumentException, "If no work queue exists with the given name.")
  function waitOnActiveWorkItems(queueName : String) : boolean {
    return getDelegate().waitOnActiveWorkItems( queueName, 60, 200)
  }

  /**
   * whether the plugin is started.
   *
   * @param pluginName the name of the plugin to start
   */
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(IllegalArgumentException, "If no plugin exists with the given name.")
  function isPluginStarted(pluginName : String) : boolean {
    return getDelegate().isPluginStarted(pluginName)
  }

  /**
   * Starts the given startable plugin.  Blocks for up to 120 seconds
   * waiting for confirmation.
   *
   * @param pluginName the name of the plugin to start
   */
  @Throws(IllegalArgumentException,"if invalid plugin name")
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function startPlugin(pluginName : String) {
    getDelegate().startPlugin(pluginName)
  }

  /**
   * Starts the given startable plugin.
   *
   * Blocks for up to {@code timeout} milliseconds to confirm plugin reached
   * {@link gw.api.startable.StartablePluginState.Started} state
   *
   * @param pluginName the name of the plugin to start
   * @param timeout number of milliseconds to wait for a confirmed start
   *                or -1 to skip confirmation and return immediately
   */
  @Throws(IllegalArgumentException,"if invalid plugin name")
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function startPluginWithTimeout(pluginName : String, timeout : long) {
    getDelegate().startPlugin(pluginName, timeout)
  }

  /**
   * Stop the given startable plugin.  Blocks for up to 120 seconds
   * waiting for confirmation.
   *
   * @param pluginName the name of the plugin
   */
  @Throws(IllegalArgumentException,"if invalid plugin name")
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function stopPlugin(pluginName : String) {
    getDelegate().stopPlugin(pluginName)
  }

  /**
   * Stop the given startable plugin, if it's started.
   *
   * Blocks for up to {@code timeout} milliseconds to confirm plugin reached
   * {@link gw.api.startable.StartablePluginState.Stopped} state
   *
   * @param pluginName the name of the plugin
   * @param timeout number of milliseconds to wait for a confirmed stop
   *                or -1 to skip confirmation and return immediately
   */
  @Throws(IllegalArgumentException,"if invalid plugin name")
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  function stopPluginWithTimeout(pluginName : String, timeout : long) {
    getDelegate().stopPlugin(pluginName, timeout)
  }

  /**
   * Stop the given startable plugin.
   *
   * @param publicID the publicID of the contact
   * @param targetType the target type to change the contact to
   */
  @Throws(IllegalArgumentException,"if contact not found or target type is invalid")
  @Throws(WsiAuthenticationException,"On permission or authentication errors")
  @Throws(WebServiceException, "if not currently in maintenance mode")
  function changeSubtype(publicID : String, targetType : String) {
    getDelegate().changeSubtype(publicID, targetType)
  }

  private function getDelegate() : ABMaintenanceToolsImpl {
    return new ABMaintenanceToolsImpl()
  }
}

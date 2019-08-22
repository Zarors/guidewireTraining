package gw.wsi.pl

uses gw.xml.ws.annotation.WsiWebService
uses java.lang.IllegalArgumentException

/**
 * API to access services offered by the Guidewire Profiler.
 */
@WsiWebService("http://guidewire.com/pl/ws/gw/wsi/pl/ProfilerAPI")
@Export
class ProfilerAPI {
  /**
   * Enable or disable the profiler for batch processes of the given type and their associated work queue
   * @param enable whether to enable or disable
   * @param type batch process type
   * @param hiResTime whether to use hi-resolution clock for timing (Windows only)
   * @param enableStackTracing whether to allow stack tracing (expensive) or not. This is ignored if enable is false
   * @param enableQueryOptimizerTracing whether to allow query optimizer tracing (expensive) or not. This is ignored if enable is false.
   * @param enableExtendedQueryTracing whether to allow extended query tracing (expensive) or not. This is ignored if enable is false.
   * @param dbmsCounterThresholdMs      The threshold for how long a database operation can take before generating a report using dbms
   *                                    counters for the interval (start of profiling session, end of profiling session). Use 0 to disable.
   * @param diffDbmsCounters            Whether diffing DBMS counters is enabled. Only meaningful if ProfilerEnabled and DbmsCounterThresholdMs are true.
   */
  @Throws (IllegalArgumentException, "if no batch process exists with the given name")
  public function setEnableProfilerForBatchProcessAndWorkQueue(enable: boolean, type: String,
                                                               hiResTime: boolean,
                                                               enableStackTracing: boolean, enableQueryOptimizerTracing: boolean, enableExtendedQueryTracing: boolean,
                                                               dbmsCounterThresholdMs: int, diffDbmsCounters: boolean) {
    gw.api.profiler.ProfilerAPI.setEnableProfilerForBatchProcessAndWorkQueue(enable, processTypeFromString( type ), hiResTime, enableStackTracing, enableQueryOptimizerTracing, enableExtendedQueryTracing, dbmsCounterThresholdMs, diffDbmsCounters);
  }

  /**
   * Enable or disable the profiler for batch processes of the given type
   * @param enable whether to enable or disable
   * @param type batch process type
   * @param hiResTime whether to use hi-resolution clock for timing (Windows only)
   * @param enableStackTracing to allow stack tracing (expensive) or not. This is ignored if enable is false
   * @param enableQueryOptimizerTracing whether to allow query optimizer tracing (expensive) or not. This is ignored if enable is false.
   * @param enableExtendedQueryTracing whether to allow extended query tracing (expensive) or not. This is ignored if enable is false.
   * @param dbmsCounterThresholdMs      The threshold for how long a database operation can take before generating a report using dbms
   *                                    counters for the interval (start of profiling session, end of profiling session). Use 0 to disable.
   * @param diffDbmsCounters            Whether diffing DBMS counters is enabled. Only meaningful if ProfilerEnabled and DbmsCounterThresholdMs are true.
   */
  @Throws (IllegalArgumentException, "if no batch process exists with the given name")
  public function setEnableProfilerForBatchProcess(enable: boolean, type: String, 
                                                   hiResTime: boolean,
                                                   enableStackTracing: boolean, enableQueryOptimizerTracing: boolean, enableExtendedQueryTracing: boolean,
                                                   dbmsCounterThresholdMs: int, diffDbmsCounters: boolean) {
    gw.api.profiler.ProfilerAPI.setEnableProfilerForBatchProcess(enable, processTypeFromString( type ), hiResTime, enableStackTracing, enableQueryOptimizerTracing, enableExtendedQueryTracing, dbmsCounterThresholdMs, diffDbmsCounters);
  }

  /**
   * Enable or disable the profiler for work queues associated with the given batch process type
   * @param enable whether to enable or disable
   * @param type batch process type
   * @param hiResTime whether to use hi-resolution clock for timing (Windows only)
   * @param enableStackTracing whether to allow stack tracing (expensive) or not. This is ignored if enable is false
   * @param enableQueryOptimizerTracing whether to allow query optimizer tracing (expensive) or not. This is ignored if enable is false.
   * @param enableExtendedQueryTracing whether to allow extended query tracing (expensive) or not. This is ignored if enable is false.
   * @param dbmsCounterThresholdMs      The threshold for how long a database operation can take before generating a report using dbms
   *                                    counters for the interval (start of profiling session, end of profiling session). Use 0 to disable.
   * @param diffDbmsCounters            Whether diffing DBMS counters is enabled. Only meaningful if ProfilerEnabled and DbmsCounterThresholdMs are true.
   */
  @Throws (IllegalArgumentException, "if no batch process exists with the given name")
  public function setEnableProfilerForWorkQueue(enable: boolean, type: String, 
                                                hiResTime: boolean,
                                                enableStackTracing: boolean, enableQueryOptimizerTracing: boolean, enableExtendedQueryTracing: boolean,
                                                dbmsCounterThresholdMs: int, diffDbmsCounters: boolean) {
    gw.api.profiler.ProfilerAPI.setEnableProfilerForWorkQueue(enable, processTypeFromString( type ), hiResTime, enableStackTracing, enableQueryOptimizerTracing, enableExtendedQueryTracing, dbmsCounterThresholdMs, diffDbmsCounters);
  }

  /**
   * Enable or disable the profiler for the given message destinations
   * @param enable whether to enable or disable
   * @param destinationID
   * @param hiResTime whether to use hi-resolution clock for timing (Windows only)
   * @param enableStackTracing whether to allow stack tracing (expensive) or not. This is ignored if enable is false
   * @param enableQueryOptimizerTracing whether to allow query optimizer tracing (expensive) or not. This is ignored if enable is false.
   * @param enableExtendedQueryTracing whether to allow extended query tracing (expensive) or not. This is ignored if enable is false.
   * @param dbmsCounterThresholdMs      The threshold for how long a database operation can take before generating a report using dbms
   *                                    counters for the interval (start of profiling session, end of profiling session). Use 0 to disable.
   * @param diffDbmsCounters            Whether diffing DBMS counters is enabled. Only meaningful if ProfilerEnabled and DbmsCounterThresholdMs are true.
   */
  public function setEnableProfilerForMessageDestination(enable: boolean, destinationID: int, 
                                                         hiResTime: boolean,
                                                         enableStackTracing: boolean, enableQueryOptimizerTracing: boolean, enableExtendedQueryTracing: boolean,
                                                         dbmsCounterThresholdMs: int, diffDbmsCounters: boolean) {
    gw.api.profiler.ProfilerAPI.setEnableProfilerForMessageDestination(enable, destinationID, hiResTime, enableStackTracing, enableQueryOptimizerTracing, enableExtendedQueryTracing, dbmsCounterThresholdMs, diffDbmsCounters);
  }

  /**
   * Enable or disable the profiler for the given web service (service name, operation name) pair
   * @param enable whether to enable or disable
   * @param serviceName
   * @param operationName
   * @param hiResTime whether to use hi-resolution clock for timing (Windows only)
   * @param enableStackTracing whether to allow stack tracing (expensive) or not. This is ignored if enable is false
   * @param enableQueryOptimizerTracing whether to allow query optimizer tracing (expensive) or not. This is ignored if enable is false.
   * @param enableExtendedQueryTracing whether to allow extended query tracing (expensive) or not. This is ignored if enable is false.
   * @param dbmsCounterThresholdMs      The threshold for how long a database operation can take before generating a report using dbms
   *                                    counters for the interval (start of profiling session, end of profiling session). Use 0 to disable.
   * @param diffDbmsCounters            Whether diffing DBMS counters is enabled. Only meaningful if ProfilerEnabled and DbmsCounterThresholdMs are true.
   */
  public function setEnableProfilerForWebService(enable: boolean, serviceName: String, operationName: String, 
                                                 hiResTime: boolean,
                                                 enableStackTracing: boolean, enableQueryOptimizerTracing: boolean, enableExtendedQueryTracing: boolean,
                                                 dbmsCounterThresholdMs: int, diffDbmsCounters: boolean) {
    gw.api.profiler.ProfilerAPI.setEnableProfilerForWebService(enable, serviceName, operationName, hiResTime, enableStackTracing, enableQueryOptimizerTracing, enableExtendedQueryTracing, dbmsCounterThresholdMs, diffDbmsCounters);
  }

  /**
   * Enable or disable the profiler for the given StartablePlugin
   * @param enable whether to enable or disable
   * @param pluginName
   * @param hiResTime whether to use hi-resolution clock for timing (Windows only)
   * @param enableStackTracing whether to allow stack tracing (expensive) or not. This is ignored if enable is false
   * @param enableQueryOptimizerTracing whether to allow query optimizer tracing (expensive) or not. This is ignored if enable is false.
   * @param enableExtendedQueryTracing whether to allow extended query tracing (expensive) or not. This is ignored if enable is false.
   * @param dbmsCounterThresholdMs      The threshold for how long a database operation can take before generating a report using dbms
   *                                    counters for the interval (start of profiling session, end of profiling session). Use 0 to disable.
   * @param diffDbmsCounters            Whether diffing DBMS counters is enabled. Only meaningful if ProfilerEnabled and DbmsCounterThresholdMs are true.
   */
  public function setEnableProfilerForStartablePlugin(enable: boolean, pluginName: String, 
                                                      hiResTime: boolean,
                                                      enableStackTracing: boolean, enableQueryOptimizerTracing: boolean, enableExtendedQueryTracing: boolean,
                                                      dbmsCounterThresholdMs: int, diffDbmsCounters: boolean) {
    gw.api.profiler.ProfilerAPI.setEnableProfilerForStartablePlugin(enable, pluginName, hiResTime, enableStackTracing, enableQueryOptimizerTracing, enableExtendedQueryTracing, dbmsCounterThresholdMs, diffDbmsCounters);
  }

  /**
   * Enable or disable the profiler for subsequent new web sessions. Not recommended for production systems
   * @param name name for the profiler session. optional; use null for the default name.
   * @param enable whether to enable or disable
   * @param hiResTime whether to use hi-resolution clock for timing (Windows only)
   * @param enableStackTracing whether to allow stack tracing (expensive) or not. This is ignored if enable is false
   * @param enableQueryOptimizerTracing whether to allow query optimizer tracing (expensive) or not. This is ignored if enable is false.
   * @param enableExtendedQueryTracing whether to allow extended query tracing (expensive) or not. This is ignored if enable is false.
   * @param dbmsCounterThresholdMs      The threshold for how long a database operation can take before generating a report using dbms
   *                                    counters for the interval (start of profiling session, end of profiling session). Use 0 to disable.
   * @param diffDbmsCounters            Whether diffing DBMS counters is enabled. Only meaningful if ProfilerEnabled and DbmsCounterThresholdMs are true.
   */
  public function setEnableProfilerForSubsequentWebSessions(name: String, enable: boolean,
                                                            hiResTime: boolean,
                                                            enableStackTracing: boolean, enableQueryOptimizerTracing: boolean, enableExtendedQueryTracing: boolean,
                                                            dbmsCounterThresholdMs: int, diffDbmsCounters: boolean) {
    gw.api.profiler.ProfilerAPI.setEnableProfilerForSubsequentWebSessions(name, enable, hiResTime, enableStackTracing, enableQueryOptimizerTracing, enableExtendedQueryTracing, dbmsCounterThresholdMs, diffDbmsCounters);
  }

  private static function processTypeFromString( type : String ) : BatchProcessType {
    var batchProcessType = typekey.BatchProcessType.get(type)
    if (batchProcessType == null) {
      throw new IllegalArgumentException( "${type} is not a valid BatchProcessType" )
    }
    return batchProcessType
  }
}

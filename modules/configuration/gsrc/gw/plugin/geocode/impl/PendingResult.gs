package gw.plugin.geocode.impl

/**
 * Interface which represents a result with
 * {@code R} as the response class that is typed to the result
 */
@Export
public interface PendingResult<R> {
  /**
   * In a Bing Map API Request that extends {@code PendingResultBase}, this creates a valid {@code PendingResult<R>} and execute the PendingResult's execute to actually make a request to the specified service
   * @return R - response class instance that is produced as a result of the request actually being performed
   */
  function execute() : R
}
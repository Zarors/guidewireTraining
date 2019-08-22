package gw.plugin.logging

uses gw.logging.TraceabilityIDCreationPoint

@Export
class DefaultTraceabilityIDPlugin implements TraceabilityIDPlugin {
  override function withTraceabilityID(creationPoint: TraceabilityIDCreationPoint, maybeCurrentTID: Optional<String>): String {
    return maybeCurrentTID.orElse(UUID.randomUUID().toString())
  }

  override function withTraceabilityID(creationPoint: TraceabilityIDCreationPoint, maybeCurrentTID: Optional<String>, message: Optional<entity.Message>): String {
//    TODO: Replace below code with this when the next version of gosu gets merged in: https://github.com/gosu-lang/gosu-lang/commit/4cbb6b72ac59772a0b6dd2cf900e3dfdcb2e40a4
//    var traceabilityID = maybeCurrentTID.orElse(message.flatMap(\m -> Optional.ofNullable(m.TraceabilityID)).orElse(UUID.randomUUID().toString()))
//    message.ifPresent(\m -> {m.TraceabilityID = traceabilityID})
//    return traceabilityID

    var potentialTID = message.map(\m -> m.TraceabilityID).orElse(UUID.randomUUID().toString());
    var traceabilityID = maybeCurrentTID.orElse(potentialTID)
    message.ifPresent(\m -> {m.TraceabilityID = traceabilityID})
    return traceabilityID
  }

  override function withTraceabilityID(creationPoint: TraceabilityIDCreationPoint, maybeCurrentTID: Optional<String>, pluginName: String): String {
    return maybeCurrentTID.orElse(UUID.randomUUID().toString())
  }
}
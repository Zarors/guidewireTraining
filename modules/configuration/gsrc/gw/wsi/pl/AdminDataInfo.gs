package gw.wsi.pl

uses gw.xml.ws.annotation.WsiExportable

/**
 * Admin Data information regarding version and import timestamp.
 */
@WsiExportable("http://guidewire.com/pl/ws/gw/wsi/pl/AdminDataInfo")
@Export
final class AdminDataInfo {
  var _version: String as AdminDataVersion;
  var _importTimestamp: Long as AdminDataImportTimestamp;
}
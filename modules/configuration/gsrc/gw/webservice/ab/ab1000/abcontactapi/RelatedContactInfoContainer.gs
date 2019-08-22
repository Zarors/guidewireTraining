package gw.webservice.ab.ab1000.abcontactapi


@Export
@gw.xml.ws.annotation.WsiExportable( "http://guidewire.com/ab/ws/gw/webservice/ab/ab1000/abcontactapi/RelatedContactInfoContainer" )
final class RelatedContactInfoContainer implements IRelatedContactInfoContainer {
  public var SourceRelatedContacts : ABContactAPIRelatedContact[]
  public var TargetRelatedContacts : ABContactAPIRelatedContact[]

  override function updateSourceRelatedContacts(value: List<IABContactAPIRelatedContact>) {
    SourceRelatedContacts = value.toArray(new ABContactAPIRelatedContact[value.size()])
  }

  override function updateTargetRelatedContacts(value: List<IABContactAPIRelatedContact>) {
    TargetRelatedContacts = value.toArray(new ABContactAPIRelatedContact[value.size()])
  }
}

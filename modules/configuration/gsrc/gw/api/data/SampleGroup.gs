package gw.api.data

uses gw.api.databuilder.GroupBuilder
uses gw.pl.persistence.core.Bundle
uses java.lang.IllegalStateException

@Export
class SampleGroup
{
  var _name : String as readonly Name
  var _type : GroupType as readonly Type
  var _parent : SampleGroup as readonly Parent

  construct(name1:String, type1:GroupType)
  {
    this(name1, type1, null)
  }

  construct(name1:String, type1:GroupType, parent1:SampleGroup) {
    _name = name1
    _type = type1
    _parent = parent1
  }

  function load() : Group {
    var group = gw.api.database.Query.make(entity.Group).compare("Name", Equals, Name).compare("GroupType", Equals, Type).select().AtMostOneRow
    if (group == null) {
      throw new IllegalStateException("cannot find group " + Name + "," + Type)
    }
    return group
  }

  function load(bundle:Bundle) : Group {
    return bundle.add(load())
  }

  function generate() : Group {
    var existingGroup = gw.api.database.Query.make(entity.Group).compare("Name", Equals, Name).compare("GroupType", Equals, Type).select().AtMostOneRow
    if (existingGroup != null) {
      return existingGroup
    }
    var builder = new GroupBuilder().withName( Name ).withGroupType( Type );
    var parentGroup : Group
    if (Parent != null) {
      parentGroup =  Parent.load()
    } else {
      var carrierOrganization = gw.api.database.Query.make(entity.Organization).compare("Name", Equals, SampleOrganization.DefaultOrg.Name).select().AtMostOneRow
      parentGroup = carrierOrganization.RootGroup
    }
    builder.withParent( parentGroup )
    return builder.createAndCommit()
  }
  
  static property get Enigma() : SampleGroup {
    return new SampleGroup("Enigma Fire & Casualty", GroupType.TC_GENERAL)
  }
}

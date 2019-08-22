package gw.api.data

uses gw.api.databuilder.OrganizationBuilder

@Export
class SampleOrganization
{
  var _name:String as readonly Name

  construct(name1:String) {
    _name = name1
  }

  function generate() : Organization {
    var fnd = gw.api.database.Query.make(entity.Organization).compare("Name", Equals, _name).select().AtMostOneRow
    if (fnd != null) {
      return fnd
    }
    return new OrganizationBuilder().withName( Name).createAndCommit()
  }

  function load() : Organization{
    return gw.api.database.Query.make(entity.Organization).compare("Name", Equals, _name).select().AtMostOneRow
  }

  static property get DefaultOrg() : SampleOrganization {
    return new SampleOrganization("Default Organization")
  }
}
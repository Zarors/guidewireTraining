package gw.api.databuilder

uses gw.api.databuilder.ABPersonBuilder
uses gw.api.databuilder.UniqueKeyGenerator

@Export
enhancement ABPersonBuilderBaseEnhancement : ABPersonBuilder {

  static function uiReady() : ABPersonBuilder {
    var uniqueID = UniqueKeyGenerator.get().nextInteger()
    var firstName = "Person" + uniqueID
    var lastName = "Contact" + uniqueID
    return new ABPersonBuilder()
      .withFirstName(firstName)
      .withLastName(lastName)
      .withTaxID()
      .withTags({ContactTagType.TC_VENDOR})
  }

}
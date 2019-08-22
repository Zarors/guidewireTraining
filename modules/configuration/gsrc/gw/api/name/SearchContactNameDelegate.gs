package gw.api.name

uses java.lang.UnsupportedOperationException

@Export
class SearchContactNameDelegate implements ContactNameFields {
  construct (nameCriteria : ABContactSearchCriteria, visible : boolean) {
    _nameCriteria = nameCriteria
    _visible = visible
  }

  var _nameCriteria : ABContactSearchCriteria
  var _visible : boolean

  // for Contacts
  override property get Name() : String {
    return _nameCriteria.Keyword
  }

  override property set Name(value : String) {
    if (_visible) {
      _nameCriteria.Keyword = value
    }
  }

  override property get NameKanji() : String {
      return _nameCriteria.KeywordKanji
  }

  override property set NameKanji(value: String) {
    if (_visible) {
      _nameCriteria.KeywordKanji = value
    }
  }

}

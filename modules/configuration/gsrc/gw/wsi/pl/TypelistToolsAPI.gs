package gw.wsi.pl

uses gw.api.webservice.typelisttools.TypeKeyData
uses gw.api.webservice.typelisttools.TypelistToolsAPIHelper
uses gw.xml.ws.annotation.WsiWebService
uses gw.xml.ws.WsiAuthenticationException
uses java.lang.IllegalArgumentException
uses gw.entity.TypeKey
uses gw.entity.ITypeList
uses gw.api.util.TypecodeMapper
uses gw.api.util.TypecodeMapperUtil
uses java.util.ArrayList
uses java.util.List

/**
 * ITypelistToolsAPI provides methods that allow for the extraction of typelist data from the
 * system.
 */
@WsiWebService("http://guidewire.com/pl/ws/gw/wsi/pl/TypelistToolsAPI")
@Export
class TypelistToolsAPI {

  /**
   * Given the name of a typelist, returns an array of all the typekey instances contained within.  An exception is
   * thrown if no typelist exists with the given name.
   *
   * @param typelistName the case-insensitive name of the typelist to look up. for example: "accidenttype"
   * @return an array of codes of typekeys contained within the typelist
   */
  @Throws (WsiAuthenticationException, "if the caller does not have soapadmin permission")
  @Throws (IllegalArgumentException, "if no typelist exists with the given name")
  public function getTypelistValues(typelist : String) : TypeKeyData[] {
    checkArgAndThrowIfNull(typelist, "typelist");
    var type = getTypelistByName(typelist);
    var typeKeys = type.getTypeKeys(true)
    return buildTypeKeyDataArray(typeKeys)
  }

  /**
   * For use during imports, returns an array of TypeKeyData objects given a typelist, a namespace, and an
   * alias.  If no typecodes are found, will return a zero-length, non-null array.  A namespace generally corresponds
   * to an external integration source, but multiple namespaces per source are allowed.  NOTE: this method allows
   * multiple typecodes to use the same namespace-alias tuple.  If you require a namespace-alias to resolve to a
   * single typecode, please use getTypeKeyByAlias.
   *
   * @param typelist  the name of the given typelist (case-insensitive)
   * @param namespace the given namespace (case-insensitive)
   * @param alias     the given alias (case-insensitive)
   * @return array of TypeKeyData objects, or a zero-length, non-null string array if no typecodes match
   */
  @Throws (IllegalArgumentException, "On parameter errors")
  @Throws (WsiAuthenticationException, "if the caller does not have soapadmin permission")
  public function getTypeKeysByAlias(typelist : String, namespace : String, alias : String) : TypeKeyData[]{
    checkArgAndThrowIfNull(typelist, "typelist")
    checkArgAndThrowIfNull(namespace, "namespace")
    checkArgAndThrowIfNull(alias, "alias")
    var codes = getTypecodeMapper().getInternalCodesByAlias(typelist, namespace, alias)
    var type = getTypelistByName(typelist)
    var typeKeys = new ArrayList<TypeKey>()
    for (code in codes) {
      typeKeys.add(type.getTypeKey(code));
    }
    return buildTypeKeyDataArray(typeKeys);
  }

  /**
   * For use during imports, returns a TypeKeyData instance corresponding to a typecode in the given typelist that
   * matches the given namespace/alias.  If no match is found, returns null.  If more than one match is found, throws
   * an IllegalArgumentException.
   *
   * @param typelist  the name of the given typelist (case-insensitive)
   * @param namespace the given namespace (case-insensitive)
   * @param alias     the given alias (case-insensitive)
   * @return TypeKeyData instance corresponding to a typecode; null if no match found
   */
  @Throws (IllegalArgumentException, "On parameter errors")
  @Throws (WsiAuthenticationException, "if the caller does not have soapadmin permission")
  public function getTypeKeyByAlias(typelist : String, namespace : String, alias : String) : TypeKeyData {
    checkArgAndThrowIfNull(typelist, "typelist")
    checkArgAndThrowIfNull(namespace, "namespace")
    checkArgAndThrowIfNull(alias, "alias")
    var codes = getTypecodeMapper().getInternalCodesByAlias(typelist, namespace, alias)
    if (codes.Count == 0) {
      return null
    } else if (codes.Count > 1) {
      throw new IllegalArgumentException("Only one typecode should be found for typelist [" + typelist +
              "], namespace [" + namespace + "], and alias [" + alias + "]; instead, " +
              codes.Count + " were found");
    }
    else {
      var type = getTypelistByName(typelist)
      return buildTypeKeyData(type.getTypeKey(codes[0]))
    }
  }

  /**
   * For use during exports, returns an array of strings representing external aliases to internal typecodes given
   * a typelist, a namespace, and an internal code.  If no aliases are found, then a zero-length, non-null array is
   * returned.  A namespace generally corresponds to an external integration source, but multiple namespaces per source
   * are allowed. NOTE: this method allows multiple aliases to correspond to the same namespace-typecode tuple.  If you
   * require a namespace-typecode to resolve to a single alias, please use getAliasByInternalCode.
   *
   * @param typelist  the name of the given typelist (case-insensitive)
   * @param namespace the given namespace (case-insensitive)
   * @param code      the given typecode (case-insensitive)
   * @return string array of aliases, or a zero-length, non-null string array if no aliases match
   */
  @Throws (IllegalArgumentException, "On parameter errors")
  @Throws (WsiAuthenticationException, "if the caller does not have soapadmin permission")
  public function getAliasesByInternalCode(typelist : String, namespace : String, code : String) : String[]{
    checkArgAndThrowIfNull(typelist, "typelist")
    checkArgAndThrowIfNull(namespace, "namespace")
    checkArgAndThrowIfNull(code, "code")
    return getTypecodeMapper().getAliasesByInternalCode( typelist, namespace, code)
  }

  /**
   * For use during exports, returns a string corresponding to an alias to an internal typecode given a typelist, a
   * namespace, and an internal code.  If no match is found, returns null.  If more than one match is found, throws
   * an IllegalArgumentException.
   *
   * @param typelist  the name of the given typelist (case-insensitive)
   * @param namespace the given namespace (case-insensitive)
   * @param code      the given typecode (case-insensitive)
   * @return string corresponding to a typecode; null if no match found
   */
  @Throws (IllegalArgumentException, "On parameter errors")
  @Throws (WsiAuthenticationException, "if the caller does not have soapadmin permission")
  public function getAliasByInternalCode(typelist : String, namespace : String, code : String) : String {
    checkArgAndThrowIfNull(typelist, "typelist")
    checkArgAndThrowIfNull(namespace, "namespace")
    checkArgAndThrowIfNull(code, "code")
    var aliases = getTypecodeMapper().getAliasesByInternalCode( typelist, namespace, code)
    if (aliases.Count == 0) {
      return null
    } else if (aliases.Count > 1) {
      throw new IllegalArgumentException("Only one typecode should be found for typelist [" + typelist +
              "], namespace [" + namespace + "], and code [" + code + "]; instead, " +
              aliases.Count + " were found");
    }
    else {
      return aliases[0]
    }
  }

  
  private function buildTypeKeyDataArray(typeKeys : List<TypeKey>) : TypeKeyData[] {
    var data = new TypeKeyData[typeKeys.size()];
    for (i in 0..|typeKeys.size()) {
      data[i] = buildTypeKeyData(typeKeys.get(i));
    }
    return data;
  }

  private function buildTypeKeyData(typeKey : TypeKey) : TypeKeyData  {
    var data = new TypeKeyData()
    data.Code = typeKey.Code
    data.Name = typeKey.UnlocalizedName
    data.Description = typeKey.Description
    data.Retired = typeKey.Retired
    return data
  }

  private function checkArgAndThrowIfNull(argument : Object, argName : String) {
    if(argument == null) {
      throw(new IllegalArgumentException("argument " + argName + " cannot be null"));
    }
  }
  
  private function getTypelistByName(typelistName : String) : ITypeList {
    checkArgAndThrowIfNull(typelistName, "typelistName");
    if (typelistName.length == 0) {
      throw(new IllegalArgumentException("typelistName " + typelistName + " cannot be empty"));
    }
    var typelist = TypelistToolsAPIHelper.getTypelistByName(typelistName)
    if (typelist == null) {
      throw new IllegalArgumentException(typelistName + " not found")
    }
    return typelist
  }

  private function getTypecodeMapper() : TypecodeMapper {
     return TypecodeMapperUtil.getTypecodeMapper()
  }

}

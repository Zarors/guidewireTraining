package gw.personaldata.obfuscation

uses gw.api.personaldata.obfuscation.PersonalDataObfuscator
uses gw.datatype.DataTypes
uses gw.entity.IEntityPropertyInfo
uses gw.util.StreamUtil
uses org.apache.commons.codec.digest.DigestUtils

@Export
class PersonalDataObfuscatorUtil {

  /**Computes an MD5 String based on the type of entity and the PublicID*/
  public static function computeMD5Padding(owner: Obfuscatable, personalDataField:IEntityPropertyInfo): Object {
    var dataType = DataTypes.get(personalDataField)
    var obfuscateUnique = owner.IntrinsicType.DisplayName + PersonalDataObfuscator.SEPARATOR + owner.PublicID
    var value = DigestUtils.md5Hex(StreamUtil.toBytes(obfuscateUnique))
    var dataTypeLength = dataType.asConstrainedDataType().getLength(null, personalDataField) ?: value.length()

    return value.substring(0, Math.min(value.length(), dataTypeLength))
  }
}
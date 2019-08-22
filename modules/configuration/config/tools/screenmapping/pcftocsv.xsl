<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="text"/>



<xsl:template match="Page">NVV Name,Display Key,Display Name,Value Path,Table,Field Name,Field Type,Field Length,Typelist,Editable,Required,Visible,Available
<xsl:apply-templates select="Item" />
</xsl:template>


  <!-- You can add or re-order the elements in the list here to affect the CSV output.  Note that all values are
       in quotes, to protect against possible commas in the input values, and that white space matters in this template because we're
       using the text output mode.  The XML that this transform will operate on already escapes " to "" as required
       when used within CSV elements.

       Currently, the XML output will output the following nodes for each screen item.  To add one to
       the XML output, just use the pattern listed below, i.e. "<xsl:value-of select="./NameKey" />"

       Again, be sure to use the quotes and to separate fields with commas to ensure that the resulting file is parseable.

       These elements will always appear, though they may be empty:

       Title - The page the item appears on
       Label - The label (pulled from display.properties) that corresponds to that display key
       DisplayKey - The display key used for the item
       ValueType - The type of the element value
       ValuePath - The full path used for the element value, if known
       Editable - Whether or not the item is editable
       Required - Whether or not the item is required
       Visible - Whether or not the item is visible (if blank, the item is visible whenever its container is visible)
       Available - Whether or not the item is available for editing on the page (if blank, the item is available whenever its container is available)
       PropertyName - The property corresponding to the element value
       Writeable - Whether or not the property is writeable


       The following entries apply to the DB table and column/field that an item maps to, and will be empty if
       that information can't be determined or isn't applicable:

       Entity - The name of the entity this field refers to, if known
       DBTable - The DB Table that corresponds to that field, if known
       FieldName - The name of the field this item refers to, if known
       JavaFieldType - The java type of the field, if known
       ADTFieldType - The ADT type of the field, if known
       ADTFieldTypeShort - The ADT type of the field, if known, display just as "Type Key", "Foreign Key", or "Array" rather than the longer strings in ADTFieldType
       ADTFieldLength - The length of the field, if known and applicable
       ADTFieldPrecision - The precision of the field, if known and applicable
       ADTFieldScale - The scale of the field, if known and applicable
       ADTFieldTypeList - The type list for this type key, if known and applicable
       ADTFieldFKEntity - The entity this field is a foreign key to, if known and applicable
       ADTFieldArrayEntity - The entity this field is an array of, if known and applicable


       The following reflection elements will only appear in the XML if the item defines that particular
       type of reflection, and they will appear exactly as they would do in the original nvv definition file,
       i.e. with a "target" attribute referencing the reflected value, a "mapFile" attribute for MappingReflect
       elements, and ReflectCondition child elements for the ConditionalReflect item.

       SimpleReflect
       ConditionalReflect
       MappingReflect
  -->
<xsl:template match="Item"><xsl:if test="DisplayKey != '' or DBTable != ''">"<xsl:value-of select="Title" />","<xsl:value-of select="DisplayKey" />","<xsl:value-of select="./Label" />","<xsl:value-of select="ValuePath" />","<xsl:value-of select="./DBTable" />","<xsl:value-of select="FieldName" />","<xsl:value-of select="./ADTFieldTypeShort" />","<xsl:value-of select="ADTFieldLength"/>","<xsl:value-of select="./ADTFieldTypeList" />","<xsl:value-of select="Editable" />","<xsl:value-of select="Required" />","<xsl:value-of select="Visible" />","<xsl:value-of select="Available" />"
</xsl:if></xsl:template>

  <!-- The above template excludes rows which have empty DisplayKey and DBTable fields.  If those rows are desired, remove the "xsl:if" tags from the template. -->

  <!-- We need this in here so that the default template doesn't match fields that we don't want in the output -->
<xsl:template match="*"/>

</xsl:stylesheet>

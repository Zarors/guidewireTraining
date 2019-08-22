<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="text"/>


  <!--
    Note that white space (and returns) matter here, since we're using text output mode
    This line will appear as the first line in the file, and thus effectively be the column headers
  -->
<xsl:template match="Typelists">Typelist,TableName,Code,Name,Description,Priority
<xsl:apply-templates select="Typelist" />
</xsl:template>

<xsl:template match="Typelist">
  <xsl:apply-templates select="Typekey"/>
</xsl:template>

  <!-- You can add or re-order the elements in the list here to affect the CSV output.  Note that all values are
       in quotes, to protect against possible commas in the input values, and that white space matters in this template because we're
       using the text output mode.  The XML that this transform will operate on already escapes " to "" as required
       when used within CSV elements.


       Currently, the XML output will output the following nodes for each screen item.  To add one to
       the XML output, just use the pattern listed below, i.e. "<xsl:value-of select="./Name" />"

       Again, be sure to use the quotes and to separate fields with commans to ensure that the resulting file is parseable.

       These elements will always appear, though they may be empty:

       Name - The name of the field
       JavaFieldType - The java type of the field
       ADTFieldType - The ADT type of the field
       ADTFieldTypeShort - The ADT type of the field, displayed just as "Type Key", "Foreign Key", or "Array" rather than the longer strings in ADTFieldType
       ADTFieldLength - The length of the field, if applicable
       ADTFieldPrecision - The precision of the field, if pplicable
       ADTFieldScale - The scale of the field, if applicable
       ADTFieldTypeList - The type list for this type key, if applicable
       ADTFieldFKEntity - The entity this field is a foreign key to, if applicable
       ADTFieldArrayEntity - The entity this field is an array of, if applicable
       IsExtension - If the field is an extension field
       IsSubtypeField - If the field is on a subtype
       DefaultValue - The default value for the field, if any
       IsNullable  - Whether or not the field is nullable
       IsImportable - Whether or not the field is importable
       IsExportable - Whether or not the field is exportable
       Description - Description of the field
       SequenceNumber - Sequence number of the field
  -->
<xsl:template match="Typekey">"<xsl:value-of select="ancestor::Typelist/@typelistName"/>","<xsl:value-of select="ancestor::Typelist/@tableName"/>","<xsl:value-of select="./Code"/>","<xsl:value-of select="./Name"/>","<xsl:value-of select="./Description"/>","<xsl:value-of select="./Priority"/>"
</xsl:template>

  <!-- We need this in here so that the default template doesn't match fields that we don't want in the output -->
<xsl:template match="*"/>

</xsl:stylesheet>
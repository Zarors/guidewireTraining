<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="text"/>


  <!--
    Note that white space (and returns) matter here, since we're using text output mode
    This line will appear as the first line in the file, and thus effectively be the column headers
  -->
<xsl:template match="Datamodel">Entity,Table,Name,Java Type,DB Type,Short DB Type,Length,Precision,Scale,Typelist,FK Entity,Array Entity,Is Extension,Is Subtype,Default Value,Is Nullable,Is Importable,Is Exportable,Description,Sequence Number
<xsl:apply-templates select="Table" />
</xsl:template>

<xsl:template match="Table">
  <xsl:apply-templates select="Field"/>
</xsl:template>

  <!-- You can add or re-order the elements in the list here to affect the CSV output.  Note that all values are
       in quotes, to protect against possible commas in the input values, and that white space matters in this template because we're
       using the text output mode.  The XML that this transform will operate on already escapes " to "" as required
       when used within CSV elements.


       Currently, the XML output will output the following nodes for each screen item.  To add one to
       the XML output, just use the pattern listed below, i.e. "<xsl:value-of select="./Name" />"

       Again, be sure to use the quotes and to separate fields with commans to ensure that the resulting file is parseable.

       These elements will always appear, though they may be empty:

       Table - The table the field appears on
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
<xsl:template match="Field">"<xsl:value-of select="ancestor::Table/@entityName"/>","<xsl:value-of select="Table"/>","<xsl:value-of select="Name"/>","<xsl:value-of select="./JavaFieldType"/>","<xsl:value-of select="./ADTFieldType"/>","<xsl:value-of select="./ADTFieldTypeShort"/>","<xsl:value-of select="./ADTFieldLength"/>","<xsl:value-of select="./ADTFieldPrecision"/>","<xsl:value-of select="./ADTFieldScale"/>","<xsl:value-of select="./ADTFieldTypeList"/>","<xsl:value-of select="./ADTFieldFKEntity"/>","<xsl:value-of select="./ADTFieldArrayEntity"/>","<xsl:value-of select="./IsExtension"/>","<xsl:value-of select="./IsSubtypeField"/>","<xsl:value-of select="./DefaultValue"/>","<xsl:value-of select="./IsNullable"/>","<xsl:value-of select="./IsImportable"/>","<xsl:value-of select="./IsExportable"/>","<xsl:value-of select="./Description"/>","<xsl:value-of select="./SequenceNumber"/>"
</xsl:template>

  <!-- We need this in here so that the default template doesn't match fields that we don't want in the output -->
<xsl:template match="*"/>

</xsl:stylesheet>
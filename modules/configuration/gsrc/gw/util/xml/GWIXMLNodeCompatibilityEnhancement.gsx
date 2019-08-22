package gw.util.xml

enhancement GWIXMLNodeCompatibilityEnhancement : gw.xml.IXMLNode
{
  
  @Deprecated( "Use the 'Text' property instead." )
  property get NodeValue() : String {
    return this.Text
  }

  property set NodeValue( str : String )  {
    this.Text = str
  }
  
}

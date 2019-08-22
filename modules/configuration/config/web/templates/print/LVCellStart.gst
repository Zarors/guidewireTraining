<%@ params(
  color : String
  bold: boolean
  alignment : com.guidewire.pl.web.config.types.WidgetAlignment
)
%>
<!-- LVCellStart.gst START -->
  <fo:table-cell
         padding-top="3px"
         padding-left="3px"
         padding-right="3px"
         padding-bottom="3px">
         <fo:block <%
          if (color != null) { %> color="${color}"<%
        }

        if (bold) { %> font-weight="bold"<%
         }
         %> text-align="${alignment}">
<!-- LVCellStart.gst END -->
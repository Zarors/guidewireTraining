<%@ params(
  embedded : Boolean,
  altcolor : Boolean,
  ghostheader : Boolean,
  settings : gw.api.print.PrintSettings,
  columns : java.util.List,
  columnGroups : java.util.List
) %>

<!-- LVStart.gst START -->
<fo:table
<% if (embedded == null or not embedded) {
  %>border-style="solid"<%
   }%>
  table-layout="fixed"
  font-size="${settings.ListViewFontSize}"
  inline-progression-dimension.optimum="100%"
<% if (altcolor == null and not altcolor) {
  %>background-color="#FFFFFF"<%
 } else {
  %>background-color="#EDEBE9"<%
} %>
<% if (embedded == null and not embedded) {
  %>space-after.optimum="0.5in"<%
} else {
  %>space-after.optimum="10px"<%
} %>>

<%
for (col in columns) {
  var column = col as com.guidewire.pl.web.listview.print.PrinterHeaderColumnInfo
  if (column.Visible) {
    %><fo:table-column <%
    if (column.PrintWidth != null) {
      %>column-width="proportional-column-width(${column.PrintWidth})"<%
    } // endif
    %> />
    <%
  }

  else {
    %><fo:table-column column-width="proportional-column-width(0.1)"/>
    <%
  } // endif

} // endfor

if (ghostheader == null or not ghostheader) {
  %><fo:table-header border-style="solid"><%
   if (columnGroups != null and not columnGroups.Empty) {
      %><fo:table-row><%
     for (cg in columnGroups index count) {
        var columnGroup = cg as com.guidewire.pl.web.listview.print.PrinterHeaderColumnInfo
        %><fo:table-cell
          number-columns-spanned="${columnGroup.ColumnsSpanned}"
          border-bottom-style="solid"
          padding-top=".1em"
          padding-bottom=".1em"<%
          if (count > 0) { %>
           border-left-style="solid"<% } %>>
          <fo:block font-weight="bold" text-align="center">
            ${columnGroup.Label}
          </fo:block>
        </fo:table-cell><% } %>
      </fo:table-row><% }

      if (columns != null and not columns.Empty) {
      %><fo:table-row><%
       for (col in columns index count) {
        var column = col as com.guidewire.pl.web.listview.print.PrinterHeaderColumnInfo
        if (column.Visible) { %>
        <fo:table-cell
          padding-top=".1em"
          padding-bottom=".1em"<%
          if (count > 0) {
          %>
          border-left-style="solid"<%
        } %>><%
          if (column.Icon) {
          %>
            <fo:block text-align="center">
              <fo:external-graphic src="${column.Label}"/>
            </fo:block><%
          } else {
          %>
            <fo:block font-weight="bold" text-align="center">
              ${column.Label}
            </fo:block><%
            }
          %></fo:table-cell><%
        }}
      %></fo:table-row><%
    } %></fo:table-header><%
  }
%>
<fo:table-body>
<!-- LVStart.gst END -->
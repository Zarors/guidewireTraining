<!-- DVLVItemStart.vm '${label}' START -->
<fo:table-row>
  <fo:table-cell column-number="1">
    <fo:block
        padding-bottom="1px"
    <% if (bold) { %>
       padding-top="1em"
       font-weight="bold"
    <% } else { %>
       padding-top="1px"
       start-indent="${settings.FontSize}"
    <% } %>
      >
      ${label}
    </fo:block>
  </fo:table-cell>
</fo:table-row>
<fo:table-row>
  <fo:table-cell column-number="1" number-columns-spanned="2">
    <fo:block
            padding-top="1px"
            padding-bottom="1px"
            >
<!-- DVLVItemStart.gst END -->
 
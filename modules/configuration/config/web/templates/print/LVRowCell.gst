<!-- LVRowCell.gst START -->
        <fo:table-cell
          border-top-style="solid"
          border-bottom-style="solid"
          padding-top=".1em"
          padding-bottom=".1em">
          <fo:block
         <% if (bold) { %>
            font-weight="bold"
         <% } %>
            text-align="${alignment}">
            ${value}
          </fo:block>
        </fo:table-cell>
<!-- LVRowCell.gst END -->
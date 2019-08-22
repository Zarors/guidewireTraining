<fo:table-row>
    <fo:table-cell>
        <fo:block
          font-weight="normal"
        >
<% if (optionIcon != null) { %>
            <fo:external-graphic src="${optionIcon}"/>&nbsp;
<% } %>

<% if (optionLabel != null) { %>
            ${optionLabel}
<% } %>
        </fo:block>
    </fo:table-cell>
</fo:table-row>

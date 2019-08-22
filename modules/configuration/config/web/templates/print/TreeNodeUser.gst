<!-- User Start -->
<fo:list-block>
    <fo:list-item>
        <fo:list-item-label end-indent="label-end()">
            <fo:block>
                <fo:inline font-family="Symbol">&#x2022;</fo:inline>
            </fo:block>
        </fo:list-item-label>

        <fo:list-item-body start-indent="body-start()">
            <fo:block>
              ${escape.forXML(node.UserDisplayName)}
            </fo:block>
        </fo:list-item-body>
    </fo:list-item>
</fo:list-block>
<!-- User END -->
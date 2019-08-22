<fo:list-block>
    <fo:list-item>
        <fo:list-item-label end-indent="label-end()">
            <fo:block>
                <fo:inline font-family="Symbol">&#x2022;</fo:inline>
            </fo:block>
        </fo:list-item-label>

        <fo:list-item-body start-indent="body-start()">
            <fo:block font-weight="bold">
                ${escape.forXML($orgLabel)}
            </fo:block>


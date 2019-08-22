<!-- PageFooter.gst START -->
  <fo:static-content flow-name="xsl-region-after">
    <fo:table table-layout="fixed" inline-progression-dimension.optimum="100%">
      <fo:table-column column-width="30%"/>
      <fo:table-column column-width="40%"/>
      <fo:table-column column-width="30%"/>
      <fo:table-body>
        <fo:table-row>
          <fo:table-cell>
            <fo:block font-size="9pt" text-align="start">
              ${html.process("Velocity.Print.RootStart.LoggedInUser")}
              ${pageInfo.LoggedInUser}
            </fo:block>
          </fo:table-cell>
          <fo:table-cell>
            <fo:block font-size="9pt" text-align="center">
              ${html.process("Velocity.Print.RootStart.Page")} <fo:page-number/>
            </fo:block>
          </fo:table-cell>
          <fo:table-cell>
            <fo:block font-size="9pt" text-align="end">
              ${ escape.forXML(pageInfo.RenderDate.formatDateTime(gw.i18n.DateTimeFormat.MEDIUM, gw.i18n.DateTimeFormat.SHORT)) }
            </fo:block>
          </fo:table-cell>
        </fo:table-row>
      </fo:table-body>
    </fo:table>
  </fo:static-content>
<!-- PageFooter.gst END -->
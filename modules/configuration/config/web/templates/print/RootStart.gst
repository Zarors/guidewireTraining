<!-- RootStart.gst START -->
<!-- Define some common HTML entities -->
<!DOCTYPE fo:root [
  <!ENTITY nbsp "&#160;">
]>

<fo:root font-family="${settings.FontFamilyName}" font-size="${settings.FontSize}" xmlns:fo="http://www.w3.org/1999/XSL/Format">
  <fo:layout-master-set>
    <fo:simple-page-master master-name="GuidewirePrint"
                  page-height="${settings.PageHeight}"
                  page-width="${settings.PageWidth}"
                  margin-top="${settings.MarginTop}"
                  margin-bottom="${settings.MarginBottom}"
                  margin-left="${settings.MarginLeft}"
                  margin-right="${settings.MarginRight}">
      <fo:region-body margin-top="0.5in" margin-bottom="0.5in"/>
      <fo:region-before extent="0.5in"/>
      <fo:region-after extent="0.25in"/>
    </fo:simple-page-master>
  </fo:layout-master-set>
  <!-- end: defines page layout -->
<!-- RootStart.gst END -->
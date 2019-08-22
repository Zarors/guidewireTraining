<fo:table-row>
  <fo:table-cell column-number="1">
    <fo:block font-weight="bold" space-before="5pt">
      ${html.process("Web.NoteTemplate.By")}
    </fo:block>
  </fo:table-cell>
  <fo:table-cell column-number="2">
    <fo:block space-before="5pt">
      <% if(note.Author != null) { %>
        ${escape.forXML(note.Author.DisplayName)}
      <% } %>
    </fo:block>
  </fo:table-cell>
  <fo:table-cell column-number="3" number-columns-spanned="2">
    <fo:block space-before="5pt">
      ${escape.forXML(dateFormat.format(note.AuthoringDate))}
    </fo:block>
  </fo:table-cell>
</fo:table-row>
<fo:table-row>
  <fo:table-cell column-number="1">
    <fo:block font-weight="bold">
      ${html.process("Web.NoteTemplate.Topic")}
    </fo:block>
  </fo:table-cell>
  <fo:table-cell column-number="2">
    <fo:block>
      <% if(note.Topic != null) { %>
        ${escape.forXML(note.Topic.Name)}
      <% } %>
    </fo:block>
  </fo:table-cell>
  <fo:table-cell column-number="3">
    <fo:block font-weight="bold">
      ${html.process("Web.NoteTemplate.Confidential")}
    </fo:block>
  </fo:table-cell>
  <fo:table-cell column-number="4">
    <fo:block>
      <% if (note.isConfidential()) { %>
        ${html.process("Java.NameValueView.Boolean.True")}
      <% } else { %>
        ${html.process("Java.NameValueView.Boolean.False")}
      <% } %>
    </fo:block>
  </fo:table-cell>
</fo:table-row>
<fo:table-row>
  <fo:table-cell column-number="1">
    <fo:block font-weight="bold">
      ${html.process("Web.NoteTemplate.Subject")}
    </fo:block>
  </fo:table-cell>
  <fo:table-cell column-number="2">
    <fo:block>
      <% if (note.Subject != null) { %>
        ${escape.forXML(note.Subject)}
      <% } %>
    </fo:block>
  </fo:table-cell>
</fo:table-row>
<fo:table-row>
  <fo:table-cell column-number="1" number-columns-spanned="4" padding-top="0.25em" padding-bottom="1em">
    <fo:block linefeed-treatment="preserve" white-space-treatment="preserve" white-space-collapse="false">
      ${escape.encodedNoteBody(note)}
    </fo:block>
  </fo:table-cell>
</fo:table-row>
package gw.document

@Export
public class DocumentPropertiesCMHelper extends DocumentDetailsApplicationHelper {
  private var _documentNameVisible : boolean
  private var _documentNameEnabled : boolean
  private var _descriptionEnabled : boolean
  private var _mimeTypeVisible : boolean
  private var _mimeTypeEnabled : boolean
  private var _languageEnabled : boolean
  private var _authorEnabled : boolean
  private var _recipientEnabled : boolean
  private var _statusEnabled : boolean
  private var _securityTypeEnabled : boolean
  private var _typeEnabled : boolean

  public construct(documents : Document[]) {
    super(documents);
  }

  public construct(document : Document) {
    this({document});
  }

  /**
   * Sets the visibility of both the document name and the mime type fields
   * @param documentNameVisible whether the document name is visible
   * @param mimeTypeVisible whether the mime type is visible
   * @return this properties helper
   */
  public function resetVisibility(documentNameVisible : boolean, mimeTypeVisible : boolean) : DocumentPropertiesCMHelper {
    this.DocumentNameVisible = documentNameVisible
    this.MimeTypeVisible = mimeTypeVisible
    return this
  }

  /**
   * Sets the enabled status of all fields to the passed in value
   * @param allFieldsEnabled whether to enable or disable the fields
   */
  override public property set AllFieldsEnabled(allFieldsEnabled : Boolean) {
    super.AllFieldsEnabled = allFieldsEnabled
    DocumentNameEnabled = allFieldsEnabled
    DescriptionEnabled = allFieldsEnabled
    MimeTypeEnabled = allFieldsEnabled
    LanguageEnabled = allFieldsEnabled
    AuthorEnabled = allFieldsEnabled
    RecipientEnabled = allFieldsEnabled
    StatusEnabled = allFieldsEnabled
    SecurityTypeEnabled = allFieldsEnabled
    TypeEnabled = allFieldsEnabled
  }

  /**
   * @return whether the Document Name field is enabled
   */
  public property get DocumentNameEnabled() : Boolean {
    return _documentNameEnabled
  }

  /**
   * Sets whether the Document Name field is enabled
   * If the value is set to false, the original field value is restored
   * @param documentNameEnabled to enable or disable the Document Name field
   */
  public property set DocumentNameEnabled(documentNameEnabled : Boolean) {
    if (_documentNameEnabled && !documentNameEnabled) {
      restoreFields(Document.NAME_PROP.get())
    }
    _documentNameEnabled = documentNameEnabled
  }


  /**
   * @return whether the Document Name field is visible
   */
  public property get DocumentNameVisible() : Boolean {
    return _documentNameVisible
  }

  /**
   * Sets whether the Document Name field is visible
   * @param documentNameVisible whether the Document Name field is visible
   */
  public property set DocumentNameVisible(documentNameVisible : Boolean) {
    _documentNameVisible = documentNameVisible
  }

  /**
   * @return the value of the Name field for all of the Documents,
   * if the values do not match, null is returned
   */
  public property get Name() : String {
    return getFields(Document.NAME_PROP.get()) as String
  }

  /**
   * Sets the value of Name field for all of the Documents
   * @param name the new Name
   */
  public property set Name(name : String) {
    setFields(Document.NAME_PROP.get(), name)
  }

  /**
   * @return whether the Description field is enabled
   */
  public property get DescriptionEnabled() : Boolean {
    return _descriptionEnabled
  }

  /**
   * Sets whether the Description field is enabled
   * If the value is set to false, the original field value is restored
   * @param descriptionEnabled to enable or disable the Desription field
   */
  public property set DescriptionEnabled(descriptionEnabled : Boolean) {
    if (_descriptionEnabled && !descriptionEnabled) {
      restoreFields(Document.DESCRIPTION_PROP.get())
    }
    _descriptionEnabled = descriptionEnabled
  }

  /**
   * @return the value of the Description field for all of the Documents,
   * if the values do not match, null is returned
   */
  public property get Description() : String {
    return getFields(Document.DESCRIPTION_PROP.get()) as String
  }

  /**
   * Sets the value of Description field for all of the Documents
   * @param description the new Description
   */
  public property set Description(description : String) {
    setFields(Document.DESCRIPTION_PROP.get(), description)
  }

  /**
   * @return whether the Mime Type field is enabled
   */
  public property get MimeTypeEnabled() : Boolean {
    return _mimeTypeEnabled
  }

  /**
   * Sets whether the Mime Type field is enabled.
   * If the value is set to false, the original field value is restored
   * @param mimeTypeEnabled to enable or disable the Mime Type field
   */
  public property set MimeTypeEnabled(mimeTypeEnabled : Boolean) {
    if (_mimeTypeEnabled && !mimeTypeEnabled) {
      restoreFields(Document.MIMETYPE_PROP.get())
    }
    _mimeTypeEnabled = mimeTypeEnabled
  }

  /**
   * @return whether the Mime Type field is visible
   */
  public property get MimeTypeVisible() : Boolean {
    return _mimeTypeVisible
  }

  /**
   * Sets whether the Mime Type field is visible
   * @param mimeTypeVisible whether the Mime Type field is visible
   */
  public property set MimeTypeVisible(mimeTypeVisible : Boolean) {
    _mimeTypeVisible = mimeTypeVisible
  }

  /**
   * @return the value of the Mime Type field for all of the Documents,
   * if the values do not match, null is returned
   */
  public property get MimeType() : String {
    return getFields(Document.MIMETYPE_PROP.get()) as String
  }

  /**
   * Sets the value of Mime Type field for all of the Documents
   * @param mimeType the new Mime Type
   */
  public property set MimeType(mimeType : String) {
    setFields(Document.MIMETYPE_PROP.get(), mimeType)
  }

  /**
   * @return whether the Language field is enabled
   */
  public property get LanguageEnabled() : Boolean {
    return _languageEnabled
  }

  /**
   * Sets whether the Language field is enabled
   * If the value is set to false, the original field value is restored
   * @param languageEnabled to enable or disable the Language field
   */
  public property set LanguageEnabled(languageEnabled : Boolean) {
    if (_languageEnabled && !languageEnabled) {
      restoreFields(Document.LANGUAGE_PROP.get())
    }
    _languageEnabled = languageEnabled
  }

  /**
   * @return the value of the Language field for all of the Documents,
   * if the values do not match, null is returned
   */
  public property get Language() : LanguageType {
    return (getFields(Document.LANGUAGE_PROP.get())) as LanguageType
  }

  /**
   * Sets the value of Language field for all of the Documents
   * @param language the new Language
   */
  public property set Language(language : LanguageType) {
    setFields(Document.LANGUAGE_PROP.get(), language)
  }

  /**
   * @return whether the Auther field is enabled
   */
  public property get AuthorEnabled() : Boolean {
    return _authorEnabled
  }

  /**
   * Sets whether the Author field is enabled
   * If the value is set to false, the original field value is restored
   * @param authorEnabled to enable or disable the Author field
   */
  public property set AuthorEnabled(authorEnabled : Boolean) {
    if (_authorEnabled && !authorEnabled) {
      restoreFields(Document.AUTHOR_PROP.get())
    }
    _authorEnabled = authorEnabled
  }

  /**
   * @return the value of the Author field for all of the Documents,
   * if the values do not match, null is returned
   */
  public property get Author() : String {
    return getFields(Document.AUTHOR_PROP.get()) as String
  }

  /**
   * Sets the value of Author field for all of the Documents
   * @param author the new Author
   */
  public property set Author(author : String) {
    setFields(Document.AUTHOR_PROP.get(), author)
  }

  /**
   * @return whether the Recipient field is enabled
   */
  public property get RecipientEnabled() : Boolean {
    return _recipientEnabled
  }

  /**
   * Sets whether the Recipient field is enabled
   * If the value is set to false, the original field value is restored
   * @param recipientEnabled to enable or disable the Recipient field
   */
  public property set RecipientEnabled(recipientEnabled : Boolean) {
    if (_recipientEnabled && !recipientEnabled) {
      restoreFields(Document.RECIPIENT_PROP.get())
    }
    _recipientEnabled = recipientEnabled
  }

  /**
   * @return the value of the Recipient field for all of the Documents,
   * if the values do not match, null is returned
   */
  public property get Recipient() : String {
    return getFields(Document.RECIPIENT_PROP.get()) as String
  }

  /**
   * Sets the value of Recipient field for all of the Documents
   * @param recipient the new Recipient
   */
  public property set Recipient(recipient : String) {
    setFields(Document.RECIPIENT_PROP.get(), recipient)
  }

  /**
   * @return whether the Status field is enabled
   */
  public property get StatusEnabled() : Boolean {
    return _statusEnabled
  }

  /**
   * Sets whether the Status field is enabled
   * If the value is set to false, the original field value is restored
   * @param statusEnabled to enable or disable the Status field
   */
  public property set StatusEnabled(statusEnabled : Boolean) {
    if (_statusEnabled && !statusEnabled) {
      restoreFields(Document.STATUS_PROP.get())
    }
    _statusEnabled = statusEnabled
  }

  /**
   * @return the value of the Status field for all of the Documents,
   * if the values do not match, null is returned
   */
  public property get Status() : DocumentStatusType {
    return getFields(Document.STATUS_PROP.get()) as DocumentStatusType
  }

  /**
   * Sets the value of Status field for all of the Documents
   * @param status the new Status
   */
  public property set Status(status : DocumentStatusType) {
    setFields(Document.STATUS_PROP.get(), status)
  }

  /**
   * @return whether the Security Type field is enabled
   */
  public property get SecurityTypeEnabled() : Boolean {
    return _securityTypeEnabled
  }

  /**
   * Sets whether the Security Type field is enabled
   * If the value is set to false, the original field value is restored
   * @param securityTypeEnabled to enable or disable the Security Type field
   */
  public property set SecurityTypeEnabled(securityTypeEnabled : Boolean) {
    if (_securityTypeEnabled && !securityTypeEnabled) {
      restoreFields(Document.SECURITYTYPE_PROP.get())
    }
    _securityTypeEnabled = securityTypeEnabled
  }

  /**
   * @return the value of the Security Type field for all of the Documents,
   * if the values do not match, null is returned
   */
  public property get SecurityType() : DocumentSecurityType {
    return getFields(Document.SECURITYTYPE_PROP.get()) as DocumentSecurityType
  }

  /**
   * Sets the value of Security Type field for all of the Documents
   * @param securityType the new Security ype
   */
  public property set SecurityType(securityType : DocumentSecurityType) {
    setFields(Document.SECURITYTYPE_PROP.get(), securityType)
  }

  /**
   * @return whether the Type field is enabled
   */
  public property get TypeEnabled() : Boolean {
    return _typeEnabled
  }

  /**
   * Sets whether the Type field is enabled
   * If the value is set to false, the original field value is restored
   * @param typeEnabled to enable or disable the Type field
   */
  public property set TypeEnabled(typeEnabled : Boolean) {
    if (_typeEnabled && !typeEnabled) {
      restoreFields(Document.TYPE_PROP.get())
    }
    _typeEnabled = typeEnabled
  }

  /**
   * @return the value of the Type field for all of the Documents,
   * if the values do not match, null is returned
   */
  public property get Type() : DocumentType {
    return getFields(Document.TYPE_PROP.get()) as DocumentType
  }

  /**
   * Sets the value of Type field for all of the Documents
   * @param type the new Type
   */
  public property set Type(type : DocumentType) {
    setFields(Document.TYPE_PROP.get(), type)
  }
}

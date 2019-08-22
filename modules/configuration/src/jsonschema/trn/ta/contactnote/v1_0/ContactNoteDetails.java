package jsonschema.trn.ta.contactnote.v1_0;

import gw.api.json.JsonDeserializationOptions;
import gw.api.json.JsonObject;
import gw.api.json.JsonValidationResult;
import gw.api.json.JsonWrapper;
import gw.lang.SimplePropertyProcessing;
import javax.annotation.Generated;
import typekey.ContactNoteType;

@SimplePropertyProcessing
@Generated(comments = "trn.ta.contactnote-1.0#/definitions/ContactNoteDetails", value = "com.guidewire.pl.json.codegen.SchemaWrappersGenerator")
public class ContactNoteDetails extends JsonWrapper {

  public ContactNoteDetails() {
    super();
  }

  private ContactNoteDetails(JsonObject jsonObject) {
    super(jsonObject);
  }

  public static ContactNoteDetails wrap(JsonObject jsonObject) {
    return jsonObject == null ? null : new ContactNoteDetails(jsonObject);
  }

  public static ContactNoteDetails parse(String json) {
    return json == null ? null : wrap(JsonWrapper.parse(json, "trn.ta.contactnote-1.0", "ContactNoteDetails"));
  }

  public static ContactNoteDetails parse(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : wrap(JsonWrapper.parse(json, "trn.ta.contactnote-1.0", "ContactNoteDetails", jsonValidationResult, jsonDeserializationOptions));
  }

  public String getBody() {
    return getTyped("Body");
  }

  public void setBody(String value) {
    put("Body", value);
  }

  public Boolean getConfidential() {
    return getTyped("Confidential");
  }

  public void setConfidential(Boolean value) {
    put("Confidential", value);
  }

  public ContactNoteType getContactNoteType() {
    return getTyped("ContactNoteType");
  }

  public void setContactNoteType(ContactNoteType value) {
    put("ContactNoteType", value);
  }

  public String getSubject() {
    return getTyped("Subject");
  }

  public void setSubject(String value) {
    put("Subject", value);
  }

}
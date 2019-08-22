package jsonschema.trn.ta.contact.v1_0;

import gw.api.json.JsonDeserializationOptions;
import gw.api.json.JsonObject;
import gw.api.json.JsonValidationResult;
import gw.api.json.JsonWrapper;
import gw.lang.Autocreate;
import gw.lang.SimplePropertyProcessing;
import java.util.Date;
import java.util.List;
import javax.annotation.Generated;
import jsonschema.trn.ta.address.v1_0.AddressDetails;
import jsonschema.trn.ta.contactnote.v1_0.ContactNoteDetails;
import typekey.GenderType;

@SimplePropertyProcessing
@Generated(comments = "trn.ta.contact-1.0#/definitions/ContactDetails", value = "com.guidewire.pl.json.codegen.SchemaWrappersGenerator")
public class ContactDetails extends JsonWrapper {

  public ContactDetails() {
    super();
  }

  private ContactDetails(JsonObject jsonObject) {
    super(jsonObject);
  }

  public static ContactDetails wrap(JsonObject jsonObject) {
    return jsonObject == null ? null : new ContactDetails(jsonObject);
  }

  public static ContactDetails parse(String json) {
    return json == null ? null : wrap(JsonWrapper.parse(json, "trn.ta.contact-1.0", "ContactDetails"));
  }

  public static ContactDetails parse(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : wrap(JsonWrapper.parse(json, "trn.ta.contact-1.0", "ContactDetails", jsonValidationResult, jsonDeserializationOptions));
  }

  public List<ContactNoteDetails> getContactNotes() {
    return getWrappedList("ContactNotes", ContactNoteDetails::wrap);
  }

  public void setContactNotes(List<ContactNoteDetails> value) {
    putWrappedList("ContactNotes", value);
  }

  public void addToContactNotes(ContactNoteDetails value) {
    addToListHelper("ContactNotes", value);
  }

  public Date getDateOfBirth() {
    return getTyped("DateOfBirth");
  }

  public void setDateOfBirth(Date value) {
    put("DateOfBirth", value);
  }

  public GenderType getGender() {
    return getTyped("Gender");
  }

  public void setGender(GenderType value) {
    put("Gender", value);
  }

  public String getName() {
    return getTyped("Name");
  }

  public void setName(String value) {
    put("Name", value);
  }

  @Autocreate
  public AddressDetails getPrimaryAddress() {
    return AddressDetails.wrap(getTyped("PrimaryAddress"));
  }

  public void setPrimaryAddress(AddressDetails value) {
    put("PrimaryAddress", value == null ? null : value.unwrap());
  }

}
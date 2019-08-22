package jsonschema.trn.ta.contact.v1_0;

import gw.api.json.JsonDeserializationOptions;
import gw.api.json.JsonObject;
import gw.api.json.JsonValidationResult;
import gw.api.json.JsonWrapper;
import gw.lang.SimplePropertyProcessing;
import java.util.Date;
import javax.annotation.Generated;
import typekey.Jurisdiction;

@SimplePropertyProcessing
@Generated(comments = "trn.ta.contact-1.0#/definitions/ContactUpdate", value = "com.guidewire.pl.json.codegen.SchemaWrappersGenerator")
public class ContactUpdate extends JsonWrapper {

  public ContactUpdate() {
    super();
  }

  private ContactUpdate(JsonObject jsonObject) {
    super(jsonObject);
  }

  public static ContactUpdate wrap(JsonObject jsonObject) {
    return jsonObject == null ? null : new ContactUpdate(jsonObject);
  }

  public static ContactUpdate parse(String json) {
    return json == null ? null : wrap(JsonWrapper.parse(json, "trn.ta.contact-1.0", "ContactUpdate"));
  }

  public static ContactUpdate parse(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : wrap(JsonWrapper.parse(json, "trn.ta.contact-1.0", "ContactUpdate", jsonValidationResult, jsonDeserializationOptions));
  }

  public Date getDateOfBirth() {
    return getTyped("DateOfBirth");
  }

  public void setDateOfBirth(Date value) {
    put("DateOfBirth", value);
  }

  public String getDriversLicenseNumber() {
    return getTyped("DriversLicenseNumber");
  }

  public void setDriversLicenseNumber(String value) {
    put("DriversLicenseNumber", value);
  }

  public Jurisdiction getDriversLicenseState() {
    return getTyped("DriversLicenseState");
  }

  public void setDriversLicenseState(Jurisdiction value) {
    put("DriversLicenseState", value);
  }

}
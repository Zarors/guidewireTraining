package jsonschema.trn.ta.address.v1_0;

import gw.api.json.JsonDeserializationOptions;
import gw.api.json.JsonObject;
import gw.api.json.JsonValidationResult;
import gw.api.json.JsonWrapper;
import gw.lang.SimplePropertyProcessing;
import javax.annotation.Generated;
import typekey.AddressType;
import typekey.State;

@SimplePropertyProcessing
@Generated(comments = "trn.ta.address-1.0#/definitions/AddressDetails", value = "com.guidewire.pl.json.codegen.SchemaWrappersGenerator")
public class AddressDetails extends JsonWrapper {

  public AddressDetails() {
    super();
  }

  private AddressDetails(JsonObject jsonObject) {
    super(jsonObject);
  }

  public static AddressDetails wrap(JsonObject jsonObject) {
    return jsonObject == null ? null : new AddressDetails(jsonObject);
  }

  public static AddressDetails parse(String json) {
    return json == null ? null : wrap(JsonWrapper.parse(json, "trn.ta.address-1.0", "AddressDetails"));
  }

  public static AddressDetails parse(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : wrap(JsonWrapper.parse(json, "trn.ta.address-1.0", "AddressDetails", jsonValidationResult, jsonDeserializationOptions));
  }

  public String getAddressLine1() {
    return getTyped("AddressLine1");
  }

  public void setAddressLine1(String value) {
    put("AddressLine1", value);
  }

  public String getAddressLine2() {
    return getTyped("AddressLine2");
  }

  public void setAddressLine2(String value) {
    put("AddressLine2", value);
  }

  public AddressType getAddressType() {
    return getTyped("AddressType");
  }

  public void setAddressType(AddressType value) {
    put("AddressType", value);
  }

  public String getCity() {
    return getTyped("City");
  }

  public void setCity(String value) {
    put("City", value);
  }

  public String getPostalCode() {
    return getTyped("PostalCode");
  }

  public void setPostalCode(String value) {
    put("PostalCode", value);
  }

  public State getState() {
    return getTyped("State");
  }

  public void setState(State value) {
    put("State", value);
  }

}
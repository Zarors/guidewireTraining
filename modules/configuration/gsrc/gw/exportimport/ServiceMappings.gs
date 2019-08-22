package gw.exportimport

uses java.util.HashMap

@Export
class ServiceMappings {

  /*
   * Map containing key values and a comma delineated list of service ids.
   */
  static property get ServiceMap() : HashMap<String, String> {
    return {
        "Auto Repair Shop United States" -> "autoothercourtesycar",
        "Adjudicator United States" -> "autoappraise, autoadjudicate, propinspectadjudicate",
        "Doctor United States" -> "medicalcare",
        "Vendor (Company) United States" -> "contrepairgarden, contrepairkitchen"
    }
  }
}
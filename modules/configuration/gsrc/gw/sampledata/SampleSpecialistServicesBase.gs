package gw.sampledata

uses com.guidewire.pl.config.PLConfigResourceKeys
uses gw.api.database.Query
uses gw.pl.persistence.core.Bundle

@Export
class SampleSpecialistServicesBase {

  static function getSampleSpecialistServices(bundle : Bundle) {
    XMLSampleDataImporter.importFromFile(PLConfigResourceKeys.VENDOR_SERVICE_TREE.File, bundle)
  }

  static function findSpecialistServiceByCode(code : String) : SpecialistService {
    var q = Query.make(SpecialistService)
    q.compare("Code", Equals, code)
    return q.select().single()
  }

  // getters for several sample SpecialistServices:

  static property get Accomm() : SpecialistService {
    return findSpecialistServiceByCode("accomm")
  }

  static property get AccommAltAccomm() : SpecialistService {
    return findSpecialistServiceByCode("accommaltaccomm")
  }

  static property get Auto() : SpecialistService {
    return findSpecialistServiceByCode("auto")
  }

  static property get AutoAdjudicate() : SpecialistService {
    return findSpecialistServiceByCode("autoadjudicate")
  }

  static property get AutoAppraise() : SpecialistService {
    return findSpecialistServiceByCode("autoappraise")
  }

  static property get AutoOther() : SpecialistService {
    return findSpecialistServiceByCode("autoother")
  }

  static property get AutoOtherRental() : SpecialistService {
    return findSpecialistServiceByCode("autootherrental")
  }

  static property get AutoOtherSalvage() : SpecialistService {
    return findSpecialistServiceByCode("autoothersalvage")
  }

  static property get AutoOtherTowing() : SpecialistService {
    return findSpecialistServiceByCode("autoothertowing")
  }

  static property get AutoOtherRoadAssist() : SpecialistService {
    return findSpecialistServiceByCode("autootherroadassist")
  }
  
  static property get AutoOtherCourtesyCar() : SpecialistService {
    return findSpecialistServiceByCode("autoothercourtesycar")
  }

  static property get AutoRepair() : SpecialistService {
    return findSpecialistServiceByCode("autoinsprepair")
  }

  static property get AutoRepairAudio() : SpecialistService {
    return findSpecialistServiceByCode("autoinsprepairaudio")
  }

  static property get AutoRepairBody() : SpecialistService {
    return findSpecialistServiceByCode("autoinsprepairbody")
  }

  static property get AutoRepairGlass() : SpecialistService {
    return findSpecialistServiceByCode("autoinsprepairglass")
  }

  static property get Cont() : SpecialistService {
    return findSpecialistServiceByCode("cont")
  }

  static property get ContInspect() : SpecialistService {
    return findSpecialistServiceByCode("continspect")
  }

  static property get ContInspectIndependent() : SpecialistService {
    return findSpecialistServiceByCode("continspectindependent")
  }

  static property get ContRepair() : SpecialistService {
    return findSpecialistServiceByCode("contrepair")
  }

  static property get ContRepairElectronics() : SpecialistService {
    return findSpecialistServiceByCode("contrepairelectronics")
  }

  static property get ContRepairKitchen() : SpecialistService {
    return findSpecialistServiceByCode("contrepairkitchen")
  }

  static property get ContRepairGarden() : SpecialistService {
    return findSpecialistServiceByCode("contrepairgarden")
  }

  static property get ContRepairComputer() : SpecialistService {
    return findSpecialistServiceByCode("contrepaircomputer")
  }

  static property get ContReplace() : SpecialistService {
    return findSpecialistServiceByCode("contrplc")
  }

  static property get ContReplaceElectronics() : SpecialistService {
    return findSpecialistServiceByCode("contrplcelectronics")
  }

  static property get ContReplaceComputer() : SpecialistService {
    return findSpecialistServiceByCode("contrplccomputer")
  }

  static property get ContReplaceKitchen() : SpecialistService {
    return findSpecialistServiceByCode("contrplckitchen")
  }

  static property get ContReplaceGarden() : SpecialistService {
    return findSpecialistServiceByCode("contrplcgarden")
  }

  static property get Medical() : SpecialistService {
    return findSpecialistServiceByCode("medical")
  }

  static property get HomeServ() : SpecialistService {
    return findSpecialistServiceByCode("homeserv")
  }

  static property get MedicalCare() : SpecialistService {
    return findSpecialistServiceByCode("medicalcare")
  }

  static property get Prop() : SpecialistService {
    return findSpecialistServiceByCode("prop")
  }

  static property get PropEmergMakeSafe() : SpecialistService {
    return findSpecialistServiceByCode("propemergmakesafe")
  }

  static property get PropEmergDebrisRemoval() : SpecialistService {
    return findSpecialistServiceByCode("propemergdebrisremoval")
  }

  static property get PropInspect() : SpecialistService {
    return findSpecialistServiceByCode("propinspect")
  }

  static property get PropInspectIndependent() : SpecialistService {
    return findSpecialistServiceByCode("propinspectindependent")
  }

  static property get PropInspectAppraisal() : SpecialistService {
    return findSpecialistServiceByCode("propinspectappraisal")
  }
  
  static property get PropConstrServ() : SpecialistService {
    return findSpecialistServiceByCode("propconstrserv")
  }
  
  static property get PropConstrServGenContractor() : SpecialistService {
    return findSpecialistServiceByCode("propconstrservgencontractor")
  }

  static property get PropConstrServCarpentry() : SpecialistService {
    return findSpecialistServiceByCode("propconstrservcarpentry")
  }

  static property get PropConstrServFencing() : SpecialistService {
    return findSpecialistServiceByCode("propconstrservfencing")
  }

  static property get PropConstrServFlooring() : SpecialistService {
    return findSpecialistServiceByCode("propconstrservflooring")
  }

  static property get PropConstrServPainting() : SpecialistService {
    return findSpecialistServiceByCode("propconstrservpainting")
  }

  static property get PropConstrServPlaster() : SpecialistService {
    return findSpecialistServiceByCode("propconstrservplaster")
  }

  static property get PropConstrServPlumber() : SpecialistService {
    return findSpecialistServiceByCode("propconstrservplumber")
  }

  static property get PropConstrServLocksmith() : SpecialistService {
    return findSpecialistServiceByCode("propconstrservlocksmith")
  }

  static property get PropConstrServWall() : SpecialistService {
    return findSpecialistServiceByCode("propconstrservwall")
  }

  static property get PropConstrServRoofing() : SpecialistService {
    return findSpecialistServiceByCode("propconstrservroofing")
  }

  static property get PropConstrServDrying() : SpecialistService {
    return findSpecialistServiceByCode("propconstrservdrying")
  }

  static property get PropConstrServElectrical() : SpecialistService {
    return findSpecialistServiceByCode("propconstrservelectrical")
  }

  static property get PropConstrServWindows() : SpecialistService {
    return findSpecialistServiceByCode("propconstrservwindows")
  }

  static property get PropConstrServBoilers() : SpecialistService {
    return findSpecialistServiceByCode("propconstrservboilers")
  }

  static property get PropConstrServArborist() : SpecialistService {
    return findSpecialistServiceByCode("propconstrservarborist")
  }
}

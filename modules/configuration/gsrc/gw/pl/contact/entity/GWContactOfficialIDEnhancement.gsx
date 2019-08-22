package gw.pl.contact.entity

enhancement GWContactOfficialIDEnhancement: entity.Contact {

  property get BureauIDOfficialID(): String {
    return this.getOfficialID(OfficialIDType.TC_BUREAUID)
  }

  property set BureauIDOfficialID(id: String) {
    this.setOfficialID(OfficialIDType.TC_BUREAUID, id)
  }

  property get DOLIDOfficialID(): String {
    return this.getOfficialID(OfficialIDType.TC_DOLID)
  }

  property set DOLIDOfficialID(id: String) {
    this.setOfficialID(OfficialIDType.TC_DOLID, id)
  }

  property get DUNSOfficialID(): String {
    return this.getOfficialID(OfficialIDType.TC_DUNS)
  }

  property set DUNSOfficialID(id: String) {
    this.setOfficialID(OfficialIDType.TC_DUNS, id)
  }

  property get FEINOfficialID(): String {
    return this.getOfficialID(OfficialIDType.TC_FEIN)
  }

  property set FEINOfficialID(id: String) {
    this.setOfficialID(OfficialIDType.TC_FEIN, id)
  }

  property get NCCIIDOfficialID(): String {
    return this.getOfficialID(OfficialIDType.TC_NCCIID)
  }

  property set NCCIIDOfficialID(id: String) {
    this.setOfficialID(OfficialIDType.TC_NCCIID, id)
  }

  property get SSNOfficialID(): String {
    return this.getOfficialID(OfficialIDType.TC_SSN)
  }

  property set SSNOfficialID(id: String) {
    this.setOfficialID(OfficialIDType.TC_SSN, id)
  }

  property get STAXOfficialID(): String {
    return this.getOfficialID(OfficialIDType.TC_STAX)
  }

  property set STAXOfficialID(id: String) {
    this.setOfficialID(OfficialIDType.TC_STAX, id)
  }

  property get STUNOfficialID(): String {
    return this.getOfficialID(OfficialIDType.TC_STUN)
  }

  property set STUNOfficialID(id: String) {
    this.setOfficialID(OfficialIDType.TC_STUN, id)
  }

  property get TUNSOfficialID(): String {
    return this.getOfficialID(OfficialIDType.TC_TUNS)
  }

  property set TUNSOfficialID(id: String) {
    this.setOfficialID(OfficialIDType.TC_TUNS, id)
  }
}

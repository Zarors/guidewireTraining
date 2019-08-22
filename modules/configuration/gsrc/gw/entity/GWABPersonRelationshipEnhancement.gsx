package gw.entity

/**
 * Defines properties specified in contact-relationship-config.xml.
 */
@Export
enhancement GWABPersonRelationshipEnhancement: entity.ABPerson {

  property get Guardian(): ABPerson {
    return this.getCommonContactByRelationship(ContactBidiRel.TC_GUARDIAN) as ABPerson
  }

  property set Guardian(value: ABPerson) {
    this.setCommonContactByRelationship(ContactBidiRel.TC_GUARDIAN, value)
  }

  property get Wards(): ABPerson[] {
    return this.getCommonContactsByRelationship(ContactBidiRel.TC_WARD) as ABPerson[]
  }

  property get Employer(): ABCompany {
    return this.getCommonContactByRelationship(ContactBidiRel.TC_EMPLOYER) as ABCompany
  }

  property set Employer(value: ABCompany) {
    this.setCommonContactByRelationship(ContactBidiRel.TC_EMPLOYER, value)
  }
}

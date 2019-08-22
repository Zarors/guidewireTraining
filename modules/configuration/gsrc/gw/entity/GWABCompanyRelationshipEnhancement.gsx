package gw.entity

/**
 * Defines properties specified in contact-relationship-config.xml.
 */
@Export
enhancement GWABCompanyRelationshipEnhancement: entity.ABCompany {

  property get Employees(): ABPerson[] {
    return this.getCommonContactsByRelationship(ContactBidiRel.TC_EMPLOYEE) as ABPerson[]
  }

  property get Thirdpartyinsured(): ABContact[] {
    return this.getCommonContactsByRelationship(ContactBidiRel.TC_THIRDPARTYINSURED) as ABContact[]
  }

  property get Case(): ABContact[] {
    return this.getCommonContactsByRelationship(ContactBidiRel.TC_CASE) as ABContact[]
  }
}

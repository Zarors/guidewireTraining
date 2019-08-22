package gw.pl.contact.entity

/**
 * Defines properties specified in contact-relationship-config.xml.
 */
enhancement GWCompanyRelationshipEnhancement: entity.Company {

  property get Employees(): Person[] {
    return this.getCommonContactsByRelationship(ContactBidiRel.TC_EMPLOYEE) as Person[]
  }

  property get Thirdpartyinsured(): Contact[] {
    return this.getCommonContactsByRelationship(ContactBidiRel.TC_THIRDPARTYINSURED) as Contact[]
  }

  property get Case(): Contact[] {
    return this.getCommonContactsByRelationship(ContactBidiRel.TC_CASE) as Contact[]
  }
}

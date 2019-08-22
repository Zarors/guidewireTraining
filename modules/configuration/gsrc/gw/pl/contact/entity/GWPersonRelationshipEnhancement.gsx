package gw.pl.contact.entity

/**
 * Defines properties specified in contact-relationship-config.xml.
 */
enhancement GWPersonRelationshipEnhancement: entity.Person {

  property get Guardian(): Person {
    return this.getCommonContactByRelationship(ContactBidiRel.TC_GUARDIAN) as Person
  }

  property set Guardian(value: Person) {
    this.setCommonContactByRelationship(ContactBidiRel.TC_GUARDIAN, value)
  }

  property get Wards(): Person[] {
    return this.getCommonContactsByRelationship(ContactBidiRel.TC_WARD) as Person[]
  }

  property get Employer(): Company {
    return this.getCommonContactByRelationship(ContactBidiRel.TC_EMPLOYER) as Company
  }

  property set Employer(value: Company) {
    this.setCommonContactByRelationship(ContactBidiRel.TC_EMPLOYER, value)
  }
}

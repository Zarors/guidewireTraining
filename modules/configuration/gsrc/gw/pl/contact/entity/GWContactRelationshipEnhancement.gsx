package gw.pl.contact.entity

/**
 * Defines properties specified in contact-relationship-config.xml.
 */
enhancement GWContactRelationshipEnhancement: entity.Contact {

  property get PrimaryContact(): Contact {
    return this.getCommonContactByRelationship(ContactBidiRel.TC_PRIMARYCONTACT) as Contact
  }

  property set PrimaryContact(value: Contact) {
    this.setCommonContactByRelationship(ContactBidiRel.TC_PRIMARYCONTACT, value)
  }

  property get PrimaryContactFor(): Contact[] {
    return this.getCommonContactsByRelationship(ContactBidiRel.TC_PRIMARYCONTACTFOR) as Contact[]
  }

  property get Thirdpartyinsurer(): Company {
    return this.getCommonContactByRelationship(ContactBidiRel.TC_THIRDPARTYINSURER) as Company
  }

  property set Thirdpartyinsurer(value : Company) {
    this.setCommonContactByRelationship(ContactBidiRel.TC_THIRDPARTYINSURER, value)
  }

  property get CollectionAgency(): entity.Company {
    return this.getCommonContactByRelationship(ContactBidiRel.TC_COLLECTIONAGENCY) as Company
  }

  property set CollectionAgency(value : Company) {
    this.setCommonContactByRelationship(ContactBidiRel.TC_COLLECTIONAGENCY, value)
  }

}

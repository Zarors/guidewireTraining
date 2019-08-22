package gw.entity

/**
 * Defines properties specified in contact-relationship-config.xml.
 */
@Export
enhancement GWABContactRelationshipEnhancement: entity.ABContact {

  property get PrimaryContact(): ABContact {
    return this.getCommonContactByRelationship(ContactBidiRel.TC_PRIMARYCONTACT) as ABContact
  }

  property set PrimaryContact(value: ABContact) {
    this.setCommonContactByRelationship(ContactBidiRel.TC_PRIMARYCONTACT, value)
  }

  property get PrimaryContactFor(): ABContact[] {
    return this.getCommonContactsByRelationship(ContactBidiRel.TC_PRIMARYCONTACTFOR) as ABContact[]
  }

  property get Thirdpartyinsurer(): ABCompany {
    return this.getCommonContactByRelationship(ContactBidiRel.TC_THIRDPARTYINSURER) as ABCompany
  }

  property get CollectionAgency(): entity.ABCompany {
    return this.getCommonContactByRelationship(ContactBidiRel.TC_COLLECTIONAGENCY) as ABCompany
  }

}

package trainingapp.enhacements_examples

enhancement ABCl : ABContact {

  property get NextCourtesyContact(): Date{
    if (this.LastCourtesyContact_Ext != null  ){
      this.LastCourtesyContact_Ext.addMonths(6)
    }
    return this.LastCourtesyContact_Ext
  }

  function upgradeToStrategicPartner() : void {

    this.IsStrategicPartner_Ext = true

    if(this.CustomerRating_Ext == null){
      this.CustomerRating_Ext = 25
    }
    else if(this.CustomerRating_Ext >=0 && this.CustomerRating_Ext<=989.9){
      this.CustomerRating_Ext +=10
    }
    else if (this.CustomerRating_Ext>989.9){
      this.CustomerRating_Ext = 999.9
    }
  }


}

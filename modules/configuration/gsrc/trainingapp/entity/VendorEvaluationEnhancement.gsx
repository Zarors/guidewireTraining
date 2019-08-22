package trainingapp.entity

enhancement VendorEvaluationEnhancement : entity.VendorEvaluation {
  
/* Returns the sum of all four evaluation categories.
   NOTE: This logic is also coded on the reflection tab of the VendorEvaluationDV's
   Total Score widget. (The reflection tab duplicates the logic within the PCF to
   keep that logic entirely client-side. Any use of VendorEvaluationEnhancement
   logic would require a call to the server.) If the logic is changed in the property
   below, then it should also be changed on the reflection tab of the widget.
*/ 
   property get TotalScore() : int {

      return this.Score_Communication + this.Score_Pricing + this.Score_QualityOfWork + this.Score_Timeliness

   } // end of property
  
   
   function sumTotalScore( val1 : int, val2 : int, val3: int, val4: int) : int {

      print ("Entering sumTotalScore")
      return val1 + val2  + val3 + val4
   }
  
} // end VendorEvaluationEnhancement enhancement

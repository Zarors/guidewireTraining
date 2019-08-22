package gw.entity

uses java.util.Comparator
uses java.lang.IllegalStateException
uses gw.api.database.Query


@Export
enhancement GWBaseSpecialistServiceEnhancement : entity.SpecialistService {

  /**
   * Gets a comparator to sort the provided list of SpecialistServices by first-level service,
   * then by second-level service, and so on. This defines a "standard" ordering for SpecialistServices.
   * Note that this is different from the natural ordering of SpecialistServices, which is based
   * on the bean ids.
   */
  static property get StandardComparator() : Comparator<SpecialistService> {
    return \ ss1, ss2 -> {
      var ancestry1 = ss1.Ancestry
      var ancestry2 = ss2.Ancestry
      var i = 0
      while(i < ancestry1.Count and i < ancestry2.Count) {
        var result = ancestry1[i].Name.compareTo(ancestry2[i].Name)
        if (result != 0) {
          return result
        } // else they are equal, so we continue down to the next level
        i++
      }
      if (i >= ancestry1.Count and i >= ancestry2.Count) {
        return 0
      } else if (i >= ancestry1.Count) {
        return -1
      } else /*if (i >= ancestry2.Count)*/ {
        return 1
      }
    }
  }

  /**
   * Gets the SpecialistService with the specified code in a read-only bundle, or null if it cannot be found.
   */
  static function getForCode(code : String) : SpecialistService {
    var q = Query.make(SpecialistService)
    q.compare("Code", Equals, code)
    return q.select().FirstResult
  }

}

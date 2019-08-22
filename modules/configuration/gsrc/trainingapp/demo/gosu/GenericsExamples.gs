package trainingapp.demo.gosu
uses java.util.ArrayList

class GenericsExamples<T> {

/* This code prints the last member of the list and then returns the last
   member of the list. Because it makes use of generics, it does not need
   to specify the type of the list members (such as ArrayList<String>), and
   it will work for any arraylist.
*/

  public function printAndReturnLastMember (aList : ArrayList<T>) : T {
                                            // The "T" is a placeholder for
                                            // whatever the list type is.
    print(aList[ aList.Count-1 ])
    return aList[ aList.Count-1 ]
  }

}



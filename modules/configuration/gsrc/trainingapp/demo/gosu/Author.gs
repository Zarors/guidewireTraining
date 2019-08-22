package trainingapp.demo.gosu
uses gw.lang.annotation.UsageTarget
uses gw.lang.annotation.AnnotationUsage
uses gw.lang.annotation.UsageModifier

// UsageTarget - What code element can this annotation be used with?
//   (ConstructorTarget, MethodTarget, PropertyTarget, or TypeTarget?)
// UsageModifier - How many times can the annotation be used per target?
//   (None, One, or Many?)
@AnnotationUsage(UsageTarget.MethodTarget, UsageModifier.Many)

class Author implements IAnnotation {

  // Values that should be provided with each annotation usage should
  // be defined as public properties backed by private variables.  
  private var _author : String as AuthorName
  private var _date : String as AuthorDate

  construct(anAuthor : String, aDate : String) {
    _author = anAuthor
    _date = aDate
  }

}


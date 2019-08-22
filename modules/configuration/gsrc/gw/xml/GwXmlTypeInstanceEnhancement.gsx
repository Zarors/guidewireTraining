package gw.xml

uses java.lang.Class
uses java.lang.IllegalStateException

enhancement GwXmlTypeInstanceEnhancement: gw.xml.XmlTypeInstance {

  reified function cast<T>() : T {
    var clazz = T as Type as Class
    //    return this.cast( clazz ) // why won't this compile? ambiguous function call
    for ( method in XmlTypeInstance.Type.TypeInfo.Methods.where( \ elt -> elt.DisplayName == 'cast' ) ) {
      // print( "Method: " + method.DisplayName + " -> " + method.Name )
      if ( Class.Type.isAssignableFrom( method.Parameters[0].FeatureType ) ) { // cast(Class)
        return method.CallHandler.handleCall( this, { clazz } ) as T
      }
    }
    throw new IllegalStateException( "Unable to find cast method" )
  }

}

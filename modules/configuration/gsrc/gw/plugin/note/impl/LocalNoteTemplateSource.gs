package gw.plugin.note.impl

uses gw.api.system.PLLoggerCategory
uses gw.api.util.DisplayableException
uses gw.document.TemplatePluginUtils
uses gw.i18n.ILocale
uses gw.plugin.InitializablePlugin
uses gw.plugin.note.INoteTemplateDescriptor
uses gw.plugin.note.INoteTemplateSerializer
uses gw.plugin.note.INoteTemplateSource
uses gw.plugin.note.NoteConfigUtil
uses gw.util.StreamUtil

uses java.io.BufferedReader
uses java.io.File
uses java.io.FileInputStream

@Export
class LocalNoteTemplateSource implements InitializablePlugin, INoteTemplateSource {

  static var TOPIC : String = "topic"
  static var TYPE : String = "type"
  static var LOB : String = "lob"
  static var NAME : String = "name"
  static var KEYWORDS : String = "keywords"
  static var AVAILABLE_SYMBOLS : String = "availablesymbols"
  
  static var DESCRIPTOR_SUFFIX : String = ".descriptor"
  static var TEMPLATES_PATH : String = "templates.path"
  static var DESCRIPTORS_PATH : String = "descriptors.path"
  static var DESC_SUFF_LEN = DESCRIPTOR_SUFFIX.length()

  var _templateDir : File
  var _descriptorDir : File
  var _vdir : com.guidewire.modules.file.VirtualDirectory

  /** This is called by the plugin initialization.
   */ 
  override property set Parameters( params : Map<Object,Object> ) {
    _vdir = NoteConfigUtil.getNoteVirtualDirectory()
    _templateDir = NoteConfigUtil.getNoteTemplatesBackingDir()
    _descriptorDir = NoteConfigUtil.getNoteTemplatesBackingDir()
  }

  /**
  * @Deprecated use the locale aware version
  */
  override public function getNoteTemplates(strTopic : String, strType : String, strLOB : String, keywrds : String[]) : INoteTemplateDescriptor[] {
    var map = new HashMap<String,Object>()
    if (strTopic != null) { map.put(TOPIC, strTopic) }
    if (strLOB != null) { map.put(LOB, strLOB) }
    if (strType != null) { map.put(TYPE, strType) }
    if (keywrds != null) { map.put(KEYWORDS, keywrds) }
    return getNoteTemplates( null, map )
  }
  
  /** This is the routine that will perform the search of the available templates.  If doing a locale specific search, it will search
   * first the lang/country/var, then the lang/country, then the lang, then the default.  The locales are subdirectories in the
   * template directory with the directory name equalling the locale code.
   *
   * @param locale the locale to search for
   * @param valuesToMatch the values to test
   *   keys are "topic", "type", "lob", "name", "keywords", "availablesymbols"
   *   availablesymbols are matched against the template's requiredsymbols
   */
   /* 
  override public function getNoteTemplates(locale : ILocale, valuesToMatch : Map) : INoteTemplateDescriptor[] {
    var list = new ArrayList<INoteTemplateDescriptor>()
    var foundFileNames = new HashSet<String>()
    var map = new HashMap<String,Object>()
    valuesToMatch.eachKeyAndValue( \ key, value -> map.put((key as String).toLowerCase(), value ))
    
    // if doing a locale specific search just want to limit it to that directory and the default
    var locales = locale == null ? LanguageType.getTypeKeys( false ).map( \ l -> ILocale.valueOf( l.Code ) ) : new ArrayList<ILocale>(){ locale }
    for (wkLocale in locales) {
      handleADirectory(wkLocale, new File(_descriptorDir, wkLocale.Code), foundFileNames, list, map, false)
    }
    // now pickup any notes with default
    handleADirectory(null, _descriptorDir, foundFileNames, list, map, locale != null)
    return list.toTypedArray()
  }
  */
  
   override public function getNoteTemplates(locale : ILocale, valuesToMatch : Map) : INoteTemplateDescriptor[] {
    var list = new ArrayList<INoteTemplateDescriptor>()
    var foundFileNames = new HashMap<String, HashSet<String>>()
    var map = new HashMap<String,Object>()
    valuesToMatch.eachKeyAndValue( \ key, value -> map.put((key as String).toLowerCase(), value ))
    

    // if doing a locale specific search just want to limit it to that directory and the default
    var locales = locale == null ? LanguageType.getTypeKeys( false ).map( \ l -> ILocale.valueOfLanguage( l.Code ) ) : new ArrayList<ILocale>(){ locale }
    for (wkLocale in locales) {
      if (wkLocale.Code != null){
        var files  = _vdir.getDir(wkLocale.Code).resolveFilesThatExist()
        for (file in files){
          handleADirectory(wkLocale, file, foundFileNames, list, map, locale != null)
        }
      }
      
      
    }
    // now pickup any emails with default
    handleADirectory(null, _descriptorDir, foundFileNames, list, map, locale != null)
    return list.toTypedArray()
  }
  
  private function handleADirectory(locale : ILocale, dir : File, foundFileNames : Map<String, Set<String>>, list : List<INoteTemplateDescriptor>, 
                                    valuesToMatch : Map,
                                    skipIfPresent : boolean) {
    var localeStr = locale == null || skipIfPresent ? "default" : locale.Code
    if (dir.exists()) {
      var fileNames = dir.listFiles( \ file -> !file.Directory and file.getName().toLowerCase().endsWith(DESCRIPTOR_SUFFIX) ).map( \ f -> f.Name)
      //if (skipIfPresent) { // if doing a locale search, this will be true on the search for default templates so just ignore them
        fileNames = fileNames.where( \ s -> not foundFileNames?.get(localeStr)?.contains(s) )
        var fileNamesSet = foundFileNames.get(localeStr)
        if (fileNamesSet != null){
          fileNamesSet.addAll(fileNames.toList())
        }else{
          fileNamesSet = new HashSet<String>()
          fileNamesSet.addAll(fileNames.toList())
        }
        foundFileNames.put(localeStr,fileNamesSet)
      //}
      for (fileName in fileNames) {
        var strSansDescriptor = fileName.substring(0, fileName.length() - DESC_SUFF_LEN)
        var template = getNoteTemplate(dir, locale, strSansDescriptor)
        var availSyms = valuesToMatch.get(AVAILABLE_SYMBOLS)
         if (template != null 
            && matchStartsWith(NAME, template.Name, valuesToMatch) 
            && match(LOB, template.LobTypes, valuesToMatch) // a typelist for cc
            && match(TOPIC, template.Topic, valuesToMatch) // a typelist
            && match(TYPE, template.Type, valuesToMatch) // a typelist
            && (availSyms == null or TemplatePluginUtils.matchStringsEqual( availSyms, template.RequiredSymbols))
           && match(KEYWORDS, template.Keywords, valuesToMatch) ) { 
          list.add(template)
        }
      }
    }
   }


  private function handleADirectory(locale : ILocale, dir : File, foundFileNames : Set<String>, list : List<INoteTemplateDescriptor>, 
                                    valuesToMatch : Map,
                                    skipIfPresent : boolean) {
    if (dir.exists()) {
      var fileNames = dir.listFiles( \ file -> !file.Directory and file.getName().toLowerCase().endsWith(DESCRIPTOR_SUFFIX) ).map( \ f -> f.Name) 
      if (skipIfPresent) { // if doing a locale search, this will be true on the search for default templates so just ignore them
        fileNames = fileNames.where( \ s -> not foundFileNames.contains(s) )
      }
      for (fileName in fileNames) {
        var strSansDescriptor = fileName.substring(0, fileName.length() - DESC_SUFF_LEN)
        var template = getNoteTemplate(locale, strSansDescriptor)
        var availSyms = valuesToMatch.get(AVAILABLE_SYMBOLS)
        if (template != null 
            && matchStartsWith(NAME, template.Name, valuesToMatch) 
            && match(LOB, template.LobTypes, valuesToMatch) // a typelist for cc
            && match(TOPIC, template.Topic, valuesToMatch) // a typelist
            && match(TYPE, template.Type, valuesToMatch) // a typelist
            && (availSyms == null or TemplatePluginUtils.matchStringsEqual( availSyms, template.RequiredSymbols))
           && match(KEYWORDS, template.Keywords, valuesToMatch) ) { 
          list.add(template)
        }
      }
    }
   }
   
   private function match(propName : String, value : Object, valuesToMatch : Map) : boolean {
     try {
        return TemplatePluginUtils.matchStringsEqual( value, valuesToMatch.get( propName )) 
     } catch (exception : Throwable) {
       throw new DisplayableException("On " + propName + ": " + exception.Message)
     }
   }
   private function matchStartsWith(propName : String, value : Object, valuesToMatch : Map) : boolean {
     try {
        return TemplatePluginUtils.matchStringsStartsWith( value, valuesToMatch.get( propName )) 
     } catch (exception : Throwable) {
       throw new DisplayableException("On " + propName + ": " + exception.Message)
     }
   }
  /**
   * Returns the note template for the template filename.
   *
   * @param strTemplateFilename The template filename.
   * @return A note template instance corresponding to the specified template filename
   *         or null if no template corresponds to the name.
   */
  override public function getNoteTemplate( strTemplateFilename : String ) : INoteTemplateDescriptor {
    return getNoteTemplate(null, strTemplateFilename)
  }
  
  /** 
  * 
  */
  override public function getNoteTemplate( locale : ILocale, strTemplateFilename : String ) : INoteTemplateDescriptor {
    if (strTemplateFilename == null || strTemplateFilename.length() == 0) {
      return null
    }
    
    var descriptorFile = new File(locale == null ? _descriptorDir : new File(_descriptorDir, locale.Code), strTemplateFilename + DESCRIPTOR_SUFFIX)
    var templateFile = new File(locale == null ? _templateDir : new File(_templateDir, locale.Code), strTemplateFilename)
    if (not (descriptorFile.exists() and templateFile.exists()) ) {
      descriptorFile = new File(_descriptorDir, strTemplateFilename + DESCRIPTOR_SUFFIX)
      templateFile = new File(_templateDir, strTemplateFilename)
      locale = null
      if (not (descriptorFile.exists() and templateFile.exists()) ) {
        return null
      }
    }
    
    var reader : BufferedReader
    var reader2 : BufferedReader
    try {
      reader = new BufferedReader(StreamUtil.getInputStreamReader(new FileInputStream(descriptorFile)))
      //noinspection IOResourceOpenedButNotSafelyClosed
      reader2 = new BufferedReader(StreamUtil.getInputStreamReader(new FileInputStream(templateFile)))
      var serializer = gw.plugin.Plugins.get(INoteTemplateSerializer)
      // get the descriptor (which includes the subject)
      var descriptor = serializer.read(reader)

      // get the actual body
      descriptor.setBody(StreamUtil.getContent( reader2 )) // lets convert a file to a string?
      descriptor.Locale = locale
      return descriptor

    } catch (exception : Throwable) {
      var str = exception.getMessage()
      throw new DisplayableException(str != null ? str : "Error getting note template.", exception)
    } finally {
      try { if (reader != null) reader.close() } 
      catch (exception : Throwable) {
        PLLoggerCategory.DOCUMENT.debug( "Error closing input file " + descriptorFile, exception )
      }
      try { if (reader2 != null) reader2.close() } 
      catch (exception : Throwable) {
        PLLoggerCategory.DOCUMENT.debug( "Error closing input file " + templateFile, exception )
      }
    }
  }
  
    private function getNoteTemplate( dir : File, locale : ILocale, templateFilename: String ) : INoteTemplateDescriptor {
       if (templateFilename == null || templateFilename.length() == 0) {
          return null
        }
        var descriptorFile = new File(dir, templateFilename + DESCRIPTOR_SUFFIX)
        var templateFile = new File(dir, templateFilename)
        if (not (descriptorFile.exists() and templateFile.exists()) ) {
          descriptorFile = new File(_descriptorDir, templateFilename + DESCRIPTOR_SUFFIX)
          templateFile = new File(_templateDir, templateFilename)
          locale = null
          if (not (descriptorFile.exists() and templateFile.exists()) ) {
            return null
          }
        }
    
        var reader : BufferedReader
        var reader2 : BufferedReader
        try {
          reader = new BufferedReader(StreamUtil.getInputStreamReader(new FileInputStream(descriptorFile)))
          //noinspection IOResourceOpenedButNotSafelyClosed
          reader2 = new BufferedReader(StreamUtil.getInputStreamReader(new FileInputStream(templateFile)))
          var serializer = gw.plugin.Plugins.get(INoteTemplateSerializer)
          // get the descriptor (which includes the subject)
          var descriptor = serializer.read(reader)

          // get the actual body
          descriptor.setBody(StreamUtil.getContent( reader2 )) // lets convert a file to a string?
          descriptor.Locale = locale
          descriptor.Filename = templateFile.Name;
          return descriptor

        } catch (exception : Throwable) {
          var str = exception.getMessage()
          throw new DisplayableException(str != null ? str : "Error getting note template.", exception)
        } finally {
          try { if (reader != null) reader.close() } 
          catch (exception : Throwable) {
            PLLoggerCategory.DOCUMENT.debug( "Error closing input file " + descriptorFile, exception )
          }
          try { if (reader2 != null) reader2.close() } 
          catch (exception : Throwable) {
            PLLoggerCategory.DOCUMENT.debug( "Error closing input file " + templateFile, exception )
          }
        }
}}
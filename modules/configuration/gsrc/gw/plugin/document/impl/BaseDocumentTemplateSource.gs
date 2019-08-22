package gw.plugin.document.impl

uses gw.api.system.PLLoggerCategory
uses gw.api.util.DisplayableException
uses gw.api.util.LocaleUtil
uses gw.api.util.Logger
uses gw.document.TemplatePluginUtils
uses gw.i18n.ILocale
uses gw.plugin.InitializablePlugin
uses gw.plugin.PluginParameter
uses gw.plugin.document.DocumentConfigUtil
uses gw.plugin.document.IDocumentTemplateDescriptor
uses gw.plugin.document.IDocumentTemplateSerializer
uses gw.plugin.document.IDocumentTemplateSource
uses gw.util.Pair

uses java.io.BufferedInputStream
uses java.io.File
uses java.io.FileInputStream
uses java.io.InputStream
uses java.util.concurrent.locks.ReentrantLock

@Export
@PluginParameter(:name="cacheDescriptors", :type=Boolean)
class BaseDocumentTemplateSource implements InitializablePlugin, IDocumentTemplateSource {

  public static var DESCRIPTOR_SUFFIX : String = ".descriptor"
  public static var AVAILABLE_SYMBOLS_PROPNAME : String = "availablesymbols"
  public static var LANGUAGE_PROPNAME : String = "language"
  static var CACHE_DESCRIPTORS : String = "cacheDescriptors"
  static var PROPNAMES_TEST_WITH_STARTSWITH : Set<String> = { "templateid", "name", "identifier" }

  property get StemSearchPropNames() : Set<String> { return PROPNAMES_TEST_WITH_STARTSWITH }

  var _vdir : com.guidewire.modules.file.LocalizedVirtualDirectory
  var _defaultLanguage : ILocale;
  var _cacheDescriptors = false
  var _loadedDescriptorsLock = new ReentrantLock()
  var _loadedDescriptors : List<IDocumentTemplateDescriptor>

  override property set Parameters( params: Map ) : void  {
    _defaultLanguage = extractLanguage(params)
    _vdir = DocumentConfigUtil.getVirtualDirectory();
    _cacheDescriptors = Boolean.parseBoolean(params.get(CACHE_DESCRIPTORS) as String)
  }

  override function getTemplateAsStream( strTemplateId : String ) : InputStream {
    return getTemplateAsStream(strTemplateId, null)
  }

  override function getTemplateAsStream( strTemplateId : String, locale : ILocale ) : InputStream  {
    var file = getLocalizedFile(strTemplateId, locale);
    PLLoggerCategory.DOCUMENT.debug("Retrieving template {}, in locale {}", strTemplateId, locale.Code)
    try {
      return new BufferedInputStream(new FileInputStream(file.First))
    } catch (e : Throwable) {
      throw new DisplayableException("Cannot access ${strTemplateId} in locale ${locale.Code}", e)
    }
  }

  override function getDocumentTemplates( date: Date, valuesToMatch : Map, maxResults : int ) : IDocumentTemplateDescriptor[]  {
    var map = new HashMap<String,Object>()
    valuesToMatch.eachKeyAndValue( \ key, value -> map.put((key as String).toLowerCase( ), value) )
    var locale = extractLanguage(map)
    var descriptors = getTemplateDescriptors(locale)
    var list = new ArrayList<IDocumentTemplateDescriptor>()
    for (var descriptor in descriptors) {
      if (descriptorIsInEffect(descriptor, date) and descriptorMatchesAllValues(descriptor, map)) {
        if (descriptorIsValid(descriptor)) {
          // fix for getDocumtneTemplate needs to get a single descritpor
          if (maxResults != 1 or locale != null or locale.Code == descriptor.Language.Code) {
            // Clone the descriptor and add the locale
            if (descriptor typeis XMLDocumentTemplateDescriptor and descriptor.Language == null and locale != null) {
              list.add(descriptor.copy(locale))
            } else {
              list.add(descriptor)
              if ((maxResults > 0) && (list.size() >= maxResults)) {
                break
              }
            }
          }
        } else {
          PLLoggerCategory.DOCUMENT.error("Document Template plugin could not find descriptor file based on the Id in a descriptor. Descriptor: ${descriptor}, Specified Id: ${descriptor.getTemplateId()}; Note that the template id must match the name of the template file")
        }
      }
    }
    return list.sortBy( \ t -> t.Name )?.toTypedArray()
  }

  private function extractLanguage(valuesToMatch : Map) : ILocale {
    var languageObj = valuesToMatch.remove( LANGUAGE_PROPNAME )
    if (languageObj typeis LanguageType ){
      return LocaleUtil.toLanguage( languageObj )
    }else if (languageObj typeis String) {
      return LocaleUtil.toLanguage( typekey.LanguageType.get(languageObj) )
    }else{
      return null
    }
  }

  /** Determine if the descriptor is in effect at the requested time.
   */
  private function descriptorIsInEffect(descriptor : IDocumentTemplateDescriptor, date : Date) : boolean {
    if (date != null) {
      if (descriptor.getDateEffective() != null and descriptor.getDateEffective().getTime() > date.getTime()) {
        return false
      }
      if (descriptor.getDateExpiration() != null and descriptor.getDateExpiration().getTime() < date.getTime()) {
        return false
      }
    }
    return true
  }

  /** Determine if the template matches all supplied parameters.  Some special cases, some symbols should be checked with
   *  startsWith, i.e., a stem search.  Templates may have required symbols, this is matched against the supplied available
   * symbols.
   */

  private function descriptorMatchesAllValues(descriptor : IDocumentTemplateDescriptor, valuesToMatch : Map) : boolean {
    for (var propName in valuesToMatch.keySet() as Set<String>) {
      if (propName.equalsIgnoreCase( AVAILABLE_SYMBOLS_PROPNAME ) ) { // available vs required symbol check,
        var requiredSymbols = descriptor.getMetadataPropertyValue("requiredsymbols")
        if (requiredSymbols != null and not TemplatePluginUtils.matchStringsEqual( valuesToMatch.get( propName ), requiredSymbols) ) {
          return false
        }
      }
      else if (StemSearchPropNames.contains(propName.toLowerCase())) {
        if (not matchStartsWith(propName, descriptor.getMetadataPropertyValue(propName), valuesToMatch)) {
          return false
        }
      }
      else {
        if (not match(propName, descriptor.getMetadataPropertyValue(propName), valuesToMatch)) {
          return false
        }
      }
    }
    return true
  }

  private function match(propName : String, value : Object, valuesToMatch : Map) : boolean {
    try {
      return TemplatePluginUtils.matchStringsEqual( value, valuesToMatch.get( propName ))
    } catch (exception : Throwable) {
      throw new IllegalArgumentException("On ${propName}: ${exception.Message}", exception)
    }
  }

  private function matchStartsWith(propName : String, value : Object, valuesToMatch : Map) : boolean {
    try {
      return TemplatePluginUtils.matchStringsStartsWith( value, valuesToMatch.get( propName ))
    } catch (exception : Throwable) {
      throw new IllegalArgumentException("On ${propName}: ${exception.Message}", exception)
    }
  }

  /** Determine if the descriptor is valid
   */
  function descriptorIsValid(descriptor : IDocumentTemplateDescriptor) : boolean {
    return descriptor != null
  }

  /**
   * Returns the document template for the template id.
   *
   * @param strTemplateId The template id.
   * @return A document template intance corresponding to the specified template id or null
   *         no template corresponds to the id.
   */
  override function getDocumentTemplate( strTemplateId: String ) : IDocumentTemplateDescriptor {
    return getDocumentTemplate(strTemplateId, null)
  }

  /** Return the document template for the given template id in the given locale
   */
  override function getDocumentTemplate( strTemplateId: String, locale : ILocale ) : IDocumentTemplateDescriptor {
    var propMap = new HashMap<String, String>() {
        "templateid" -> strTemplateId,
        LANGUAGE_PROPNAME -> locale.Code
    }
    var descriptors = getDocumentTemplates(null, propMap, 1)
    return descriptors.first()
  }

  /** This will parse the document descriptor file so that getMetadataProperty can be called to 
      extract values to be compaired
   */
  private function readDescriptor(file:File, serializer:IDocumentTemplateSerializer) : IDocumentTemplateDescriptor  {
    try {
      using (var is = new BufferedInputStream(new FileInputStream(file))) {
        var descriptor = serializer.read(is)
        descriptor.setDateModified(new Date(file.lastModified()))
        return descriptor
      }
    } catch (t : Throwable) {
      //Log the error and return; we don't want to blow up here, because the user may be looking for a set of templates and not care about
      // this one in particular
      PLLoggerCategory.DOCUMENT.error("Could not load a document template descriptor: ${file}", t)
      return null
    }
  }

  /** This will return the document descriptors from the directory which should contain the document descriptors
   */
  private function getTemplateDescriptors(locale : ILocale) : List<IDocumentTemplateDescriptor> {
    // deal with the cache
    // if caching we need to populate the cache without filtering by locale
    if (_cacheDescriptors && _loadedDescriptors == null) {
      _loadedDescriptorsLock.with(\->{
        _loadedDescriptors = getLocalTemplateDescriptors( null ) // get all descriptors
      })
    }
    // now that we have a cache either return it or filter it
    if (_cacheDescriptors && _loadedDescriptors != null) {
      return locale == null ? _loadedDescriptors : filterByLocale(locale)
    }
    return getLocalTemplateDescriptors( locale )
  }

  private function getLocalTemplateDescriptors(locale : ILocale) : List<IDocumentTemplateDescriptor> {
    var descriptorFiles = DescriptorFiles

    if (descriptorFiles.Empty) {
      //Null indicates a directory path or IO problem. Don't cache in this case
      PLLoggerCategory.DOCUMENT.error("Could not find Document Template Files in {}. Usually this error indicates that either the configured directory does not exist or there was an I/O problem", _vdir)
      return Collections.emptyList()
    }

    var serializer = gw.plugin.Plugins.get(IDocumentTemplateSerializer)
    var descriptors = descriptorFiles.map( \ f -> readDescriptor(f, serializer)).where( \ d -> d != null)


    var localDescriptors = new ArrayList<IDocumentTemplateDescriptor>()
    var missingTemplates = new HashSet<String>();
    for (var descriptor in descriptors) {
      var templateId = descriptor.TemplateId
      var templateFilesToCheck = new ArrayList<Pair<File, ILocale>>()
      if (locale == null) {
        var unlocalizedFile = _vdir.getFile(templateId)
        for (var language in LanguageType.getTypeKeys(false)) {
          var file = _vdir.getFileByLocaleCode(templateId, language.Code, true)
          if (file == unlocalizedFile) {
            //skip now, will be added below
            continue
          }
          var actualFileLanguage = file.ParentFile.Name
          if (actualFileLanguage != language.Code && ILocale.valueOfLanguage(actualFileLanguage) != null) {
            //handle the case: we have a language and a sublanguage, for example: en_US and en_US_TEXAS
            //but just en_US has a template
            continue
          }
          templateFilesToCheck.add(Pair.make(file, ILocale.valueOfLanguage(language.Code)));
        }
        templateFilesToCheck.add(Pair.make(unlocalizedFile, null as ILocale));
      } else {
        templateFilesToCheck.add(getLocalizedFile(templateId, locale))
      }

      for (var pair in templateFilesToCheck) {
        var templateFile = pair.First
        var loc = pair.Second
        if (templateFile.exists()) {
          var localDescriptor = loc == null ? descriptor : serializer.localize(loc, descriptor)
          localDescriptors.add(localDescriptor);
        } else {
          missingTemplates.add(templateFile.getName());
        }
      }
    }
    for (var missingTemplate in missingTemplates) {
      Logger.DOCUMENT.warn("No document template found for descriptor {} ", missingTemplate)
    }
    return localDescriptors
  }

  /**
   * Returns list of document descriptors. If '_defaultLocale' is specified _vdir/_defaultLocale will be used, _vdir otherwise.
   * The method looks into just the first existing directory, it does not collect descriptors from all modules.
   */
  private property get DescriptorFiles() : List<File> {
    var descriptorsVDir = _defaultLanguage != null ? _vdir.getDir(_defaultLanguage.Code) : _vdir
    var topDir = descriptorsVDir.resolveTopFilesThatExist()
    var files : List<File> = topDir.listFiles(\f -> f.Name.toLowerCase().endsWith(DESCRIPTOR_SUFFIX))?.toList()?:{}
    PLLoggerCategory.DOCUMENT.debug("Found {} document template discriptors", files.Count)
    return files
  }

  /** this will find the best template for the desired locale.
   * The order of the templates is locale specific templates first, followed by the default
   * template.  So if we find the template for the locale we don't add the the default,
   * if we don't find the template for the locale, but do find the default template, then
   * we add that.
   */
  private function filterByLocale(locale : ILocale) : List<IDocumentTemplateDescriptor> {
    var rtn = new ArrayList<IDocumentTemplateDescriptor>()
    var doingId : String
    var found = false
    for (descriptor in _loadedDescriptors) {
      if (descriptor.TemplateId != doingId) { // reset the boolean to not found as we are on a different template
        found = false
      }
      if (descriptor.Language == null) {
        if (not found) {
          rtn.add(descriptor)
        }
      }
      else if (locale.Code == descriptor.Language.Code) {
        rtn.add(descriptor)
        found = true
      }
      // else {} // the template with a locale that does not match
      doingId = descriptor.TemplateId
    }
    return rtn
  }

  private function getLocalizedFile(fileName : String, locale : ILocale) : Pair<File, ILocale> {
    var unlocalizedFile = _vdir.getFile(fileName)
    var localesToTest = {locale, _defaultLanguage}.where(\e -> e != null)
    for (var loc in localesToTest) {
      var file = _vdir.getFileByLocaleCode(fileName, locale.Code, true);
      if (file != unlocalizedFile && file.exists()) {
        return Pair.make(file, loc);
      }
    }
    return Pair.make(unlocalizedFile, null as ILocale);
  }
}

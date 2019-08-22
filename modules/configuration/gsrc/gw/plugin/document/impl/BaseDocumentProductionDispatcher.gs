package gw.plugin.document.impl

uses com.guidewire.pl.system.logging.PLLoggerCategory
uses gw.api.locale.DisplayKey
uses gw.api.util.DisplayableException
uses gw.api.util.LocaleUtil
uses gw.api.util.Logger
uses gw.document.DocumentContentsInfo
uses gw.document.TemplatePluginUtils
uses gw.lang.reflect.IType
uses gw.lang.reflect.TypeSystem
uses gw.plugin.InitializablePlugin
uses gw.plugin.PluginParameter
uses gw.plugin.document.IDocumentProduction
uses gw.plugin.document.IDocumentTemplateDescriptor

@Export
@PluginParameter(:name=".*", :helpText="The parameter name is a production-type (defaulting to the template's mime-type), the value is the IDocumentProduction class to produce a document of that mimetime")
class BaseDocumentProductionDispatcher implements IDocumentProduction, InitializablePlugin {
  /**
   * Map of String->IDocumentProduction types. The keys will typically be mime types.
   */
  var _productionTypeToImplementationTypeMap = new HashMap<String, IType>()
  /**
   * Map of String->IDocumentProduction implemenations. The keys will typically be mime types.
   */
  var _productionTypeToImplementationMap = new HashMap<String, IDocumentProduction>()

    static var SKIP_PARAMS = { "root.dir", "temp.dir" }
    construct() {
   }

    /**
     * Initialize the map with the parameters specified in the config. This assumes that the config
     * implicitly contains information mapping strings to classes, for example:
       <plugin-java name="IDocumentProduction"
              javaclass="gw.plugin.document.impl.DocumentProductionDispatcher">
        <param name="application/msword"
               value="gw.plugin.document.impl.WordDocumentProduction"/>
        <param name="application/vnd.ms-excel"
               value="gw.plugin.document.impl.ExcelDocumentProduction"/>
        <param name="application/x-msexcel"
               value="gw.plugin.document.impl.ExcelDocumentProduction"/>
        <param name="application/pdf"
               value="gw.plugin.document.impl.ServerSidePDFDocumentProduction"/>
        <param name="text/plain"
               value="gw.plugin.document.impl.GosuDocumentProduction"/>
        <param name="text/html"
               value="gw.plugin.document.impl.GosuDocumentProduction"/>
        <param name="text/xml"
               value="gw.plugin.document.impl.GosuDocumentProduction"/>
        <param name="application/rtf"
               value="gw.plugin.document.impl.GosuDocumentProduction"/>
        <param name="application/csv"
               value="gw.plugin.document.impl.GosuDocumentProduction"/>
      </plugin-java>

     * @param params Contains the set of confgured parameters
     */
    override property set Parameters(params : Map<Object,Object>) {
      var errors = false
      _productionTypeToImplementationMap.clear()
      for (mimeType in params.Keys as Set<String>) {
        if (not (SKIP_PARAMS.contains(mimeType))) {
          try {
            var handlerType = TypeSystem.getByFullName(params.get(mimeType) as String)
            _productionTypeToImplementationTypeMap.put(mimeType, handlerType)
          } catch (t : Throwable) {
            errors = true
            Logger.DOCUMENT.error("Could not load handler for '" + mimeType + "':", t)
          }
        }
      }
      if (errors) {
        throw "Failed to load document production handlers"
      }
    }

  /**
   * Dispatch through to the asynchronousCreationSupported method on the configured IDocumentProduction implementation
   */
  override function asynchronousCreationSupported( templateDescriptor : IDocumentTemplateDescriptor ) : boolean {
    var result : boolean
    var locale = templateDescriptor.Language
    if (locale == null) {
      locale = LocaleUtil.getDefaultLocale()
    }
    LocaleUtil.runAsCurrentLocaleAndLanguage( locale, locale , \ ->  {
      result = getDispatchImplementation(templateDescriptor).asynchronousCreationSupported(templateDescriptor)
    })
    return result
  }

  /**
   * Dispatch through to the createDocumentAsynchronously method on the configured IDocumentProduction implementation
   */
  override function createDocumentAsynchronously( templateDescriptor : IDocumentTemplateDescriptor, parameters : Map<Object,Object>, fieldValues : Map<Object,Object> ) : String  {
    var result : String
    var locale = templateDescriptor.Language
    if (locale == null) {
      locale = LocaleUtil.getDefaultLocale()
    }
    LocaleUtil.runAsCurrentLocaleAndLanguage( locale, locale , \ ->  {
     result = getDispatchImplementation(templateDescriptor).createDocumentAsynchronously(templateDescriptor, parameters, fieldValues)
    })
    return result
  }

  override function createDocumentAsynchronously( templateDescriptor : IDocumentTemplateDescriptor, parameters : Map<Object,Object> ) : String  {
    var result : String
    var locale = templateDescriptor.Language
    if (locale == null) {
      locale = LocaleUtil.getDefaultLocale()
    }
    LocaleUtil.runAsCurrentLocaleAndLanguage( locale, locale , \ ->  {
      result = getDispatchImplementation(templateDescriptor).createDocumentAsynchronously(templateDescriptor, parameters)
    })
    return result
  }

  /**
   * Dispatch through to the synchronousCreationSupported method on the configured IDocumentProduction implementation
   */
  override function synchronousCreationSupported( templateDescriptor : IDocumentTemplateDescriptor ) : boolean  {
    var result : boolean
    var locale = templateDescriptor.Language
    if (locale == null) {
      locale = LocaleUtil.getDefaultLocale()
    }
    LocaleUtil.runAsCurrentLocaleAndLanguage( locale, locale , \ ->  {
      result = getDispatchImplementation(templateDescriptor).synchronousCreationSupported(templateDescriptor)
    })
    return result
  }

  /**
   * Dispatch through to the createDocumentSynchronously method on the configured IDocumentProduction implementation
   */
  override function createDocumentSynchronously( templateDescriptor : IDocumentTemplateDescriptor, parameters : Map<Object,Object> ) : DocumentContentsInfo {
    var documentContentsInfo : DocumentContentsInfo
    var locale = templateDescriptor.Language
    if (locale == null) {
      locale = LocaleUtil.getDefaultLocale()
    }
    LocaleUtil.runAsCurrentLocaleAndLanguage( locale, locale , \ ->  {
      documentContentsInfo = getDispatchImplementation(templateDescriptor).createDocumentSynchronously(templateDescriptor, parameters)
    })
    return documentContentsInfo
  }

  /**
   * Return the IDocumentProduction implementation which should be used to create a document
   * based on the indicated template.
   * @param templateDescriptor The template on which the document should be based.
   * @return The appropriate IDocumentProduction implementation.
   *
   */
  protected function getDispatchImplementation(templateDescriptor : IDocumentTemplateDescriptor) : IDocumentProduction {
    if (templateDescriptor == null) {
      throw new IllegalArgumentException("Cannot pass null templateDescriptor to getDispatchImplementation()")
    }
    var productionTypeStr = templateDescriptor.getDocumentProductionType()
    if (productionTypeStr == null or productionTypeStr.trim().length == 0) {
      productionTypeStr = templateDescriptor.getMimeType()
    }
    var productionImpl = _productionTypeToImplementationMap.get(productionTypeStr)
    if (productionImpl == null) {
      try {
        var productionType = _productionTypeToImplementationTypeMap.get(productionTypeStr)
        if (productionType == null) {
          throw new IllegalArgumentException("No valid configured IDocumentProduction implementation found for production type: " + productionTypeStr + ". Please check the DocumentProductionDispatcher configuration.")
        }
        var constructor = productionType.TypeInfo.getConstructor(new IType[0]).Constructor
        if (constructor == null) {
          throw new IllegalArgumentException("Configured IDocumentProduction implementation not found for production type: " + productionTypeStr + ". Please check the DocumentProductionDispatcher configuration.")
        }
        var object = constructor.newInstance(new String[0])
        productionImpl = cast(object)
        _productionTypeToImplementationMap.put(productionTypeStr, productionImpl)
      }
      catch (e : Throwable) {
        PLLoggerCategory.DOCUMENT.error("Could not instantiate " + productionTypeStr, e)
        throw new DisplayableException(DisplayKey.get("Java.PluginConfig.FatalErrors"))
      }
    }
    return productionImpl
  }

  protected function cast(obj : Object) : IDocumentProduction {
    return TemplatePluginUtils.castDocumentProduction(obj, gw.plugin.document.IDocumentProduction)
  }

  override function createDocumentSynchronously(templateDescriptor : IDocumentTemplateDescriptor , parameters : Map<Object, Object>, document : Document) : DocumentContentsInfo {
    var result : DocumentContentsInfo
    var locale = templateDescriptor.Locale
    if (locale == null) {
      locale = LocaleUtil.getDefaultLocale()
    }
    document.Locale = locale // does the translation to language
    LocaleUtil.runAsCurrentLocale( locale , \ ->  {
      result = (getDispatchImplementation(templateDescriptor) as gw.plugin.document.IDocumentProduction).createDocumentSynchronously(templateDescriptor, parameters, document);
    })
    return result
  }
}

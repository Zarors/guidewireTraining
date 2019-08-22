package gw.api.extension

uses gw.web.AboutPopup

/**
 * Extension interfaces mapper implementation.
 * <p/>
 * WARNING: Customers must never modify this mapping class file. Treat this file as read-only, despite the @Export
 * annotation that is in this file for internal reasons. However, you can edit the writable implementation classes
 * or Gosu templates that this file references.
 */
@Export
class PLExtensionInterfacesMapper implements ExtensionInterfacesMapper {

  override function bindImplementations(config: ExtensionInterfacesConfig) {
    config.setImplementation<AboutPopupWriter>(\writer, escaper, aboutInfo -> AboutPopup.render(writer, escaper, writer, aboutInfo))
  }

}
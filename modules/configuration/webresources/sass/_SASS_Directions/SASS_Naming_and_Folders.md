## SASS Variables ##
* All variables are namespaced with gw-...
* Double dashes are used to separate scope, section, and properties.
    * ie: `app--section1--color`
* Single dashes are used solely to connect multiple words describing a single section, scope, or property.
    * ie: `some-multi-word-concept`, ie: `app--some-multi-word-concept--color`
    * `$gw-[scope]--[scope-section-or-prop]--[scope-section-or-prop]--[prop...]`

# We Essentially have 4 types of variables #
1. Pure Global Variables:
    * `$gw-app--[scope-section-or-prop]--[scope-section-or-prop]--[prop...]`
    * ie: `$gw-app--bg: blue;`
2. Sectioned Global Variables:
    $gw-app--[lowercase and plural section]--etc
    * ie: `$gw-app--buttons--bg: orange;` or `$gw-app--menus--col: white;`
3. Component Themeable Global Variables: in the theme folder
    * `gw-app--[CamelCaseComponent]--[scope-section-or-prop..]--etc`
    * ie: `$gw-app--MenuItem--expand-icon--width: 10em;`
4. Local Component Variables
    * `gw-[CamelCaseComponent]--[scope-section-or-prop]--etc`
    * ie: `gw-NorthPanel--upper-section--button--bg: gray;`



## SASS Folders ##
All of our SASS breaks down roughly into:

1. Themes
    * Themes sets up all of the global variables that will be consumed by the rest of the SASS files.
    * Applications and Customers will create additional theme files in identical folder structures in their web resources.
2. Platform
    * Platform contains all of the SASS required for the platform to function.
    * All environment level SASS.
3. Apps
    * Any custom application specific requirements that the theme system does not address.
    * This code will be loaded after any Themes and Platform code.
    * Most common use would be to style custom css classes added via PCFs.
2. Customer
    * Any custom customer specific requirements that the theme system does not address.
    * This code will be loaded after any Themes and Platform and Application code.
    * Most common use would be to style custom css classes added via PCFs.



## Overview ##
The SASS is built using libSASS, and all standard SASS Compilation properties. EXCEPT file structure.
@import statements are not supported anywhere except in the theme files. More info on that further down.
The file organization and compilation order is custom to the needs of the Guidewire theming system.

Placing files in any of the folders will cause the file to be compiled in alphabetical order. There is no reason
to import any files.

## Order of Compilation ##
1. Non theme dependent environment files are compiled into gen/preTheme.css.
    * `sass/platform/environment/not_themed`
    * html browser normalization, application required framework settings, pcf required css.

For every theme file listed in Client_Properties.json:
1. Starts a new sass compile session
2. Selects a single theme file:
    * ie: `sass/themes/gw-theme-dark.scss`
    * compiler adds any @imported partials.
    * loads all variables in the theme file itself and in the partials.
3. Modifier Functions
    * sass/platform/modifier_functions
4. Global Variables
    * `sass/themes/global_variables/`
    * all globals are loaded as `!default` so as to not clobber any variables previously defined by the theme.
5. Mixins and Functions:
    * `sass/platform/mixins_and_functions/`
6. Compiler opens the theme file name as theme wrapper around all content for theme:
    * id `#gw-theme-dark {` or `#special-customer-theme {`, etc
7. Theme Dependent Environment files:
    * `sass/platform/environment/themed`
8. Components:
    * `sass/platform/components/`
9. Pages:
    * `sass/platform/pages/`
10. App specific sass source:
    * `sass/apps/`
11. Customer specific sass source:
    * `sass/customer/`
12. Compiler closes the theme wrapper:
    * `}`

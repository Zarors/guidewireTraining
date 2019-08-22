## TLDR ##
1. Create an scss file in -customerbuild-/webresources/sass/themes/
2. Override any variables found in platform/webresources/sass/themes/global_variables
3. Add the theme file name, and its display key path to the Client_Properties.json file:
    * theme_files_to_include_and_their_display_key_names": {
         "gw-theme--default": "Web.Theme.Default",
         `"my-new-theme-file-name": "Some.path.to.a.display.key"`
       }

## In Depth Additional Information ##
1. The Theme File
    * The only contents of this file can be:
        * a. global variables: ie, `$gw-app--background: black`;
        * b. `@import` statements for partials
            * no paths. Just file names. Referring to files in the `./partials` folder.
            * `@import "gw-theme-partial--spacing-default"`
            * as per standard Compass setup, the `_` and the `.scss` are not required.
2. Override any variables defined in `./global_variables` by defining them in a partial or in the theme file.
3. Variables located in component files cannot should not be overidden directly.
    * essentially, any variable you can find marked with !default, can be overriden in a theme file.
4. Pay special attention to the convenience of variables in the `modifier_functions` folder.
    * These vars can be leveraged to easily change entire aspects of a theme. Like decreasing all padding by a percentage, etc.

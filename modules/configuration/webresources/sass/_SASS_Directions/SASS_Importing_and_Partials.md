## Imports and Partials in the Guidewire Theme System ##

## @Import ##
* Importing files is NOT supported, and is NOT required in the Guidewire Theme System
    * With the exception of theme partials. See Below.
* All files in the SASS folder structure are compiled, in a specific order, to make Themes as simple as possible.
* See: `SASS_Theme_Overview.md` for a specific description of the order of compilation.

## Partials ##
* We support the @import-ing of partial files only inside theme files, and only for partials located in the themes/partials folder
    * This is a convenience tool to allow designers to create small theme "chunks" which can then be @imported into multiple themes without copy and pasting.
* See `SASS_Theme_Overview.md` for more information.
* Partials are not required. All styling can be done in a single gw-theme--foo file. Theme partials exist as a convenience.

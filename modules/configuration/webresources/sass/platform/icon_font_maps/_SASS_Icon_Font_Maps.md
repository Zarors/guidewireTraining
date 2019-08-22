# This folder is loaded in 2 places #

1. with the not_themed files, to support creating font css outside of the themes.
2. with the utility sass, to allow themed mixins to access the font maps

Note: that means you can't reference any files or mixins here that require theming.
Enable this module to offload xml schema code generation and compilation.

Uncomment the "genSchemaJar" section in the following files:

settings.gradle
modules/configuration/build.gradle
modules/configuration/res/gwxmlmodule.xml

To add these dependencies to the Studio project,
close Studio
and then run:
"gwb clean"
"gwb genSchemaJar"
"gwb idea studio"


The command to update the generated schema jar is:
"gwb clean"
"gwb genSchemaJar"

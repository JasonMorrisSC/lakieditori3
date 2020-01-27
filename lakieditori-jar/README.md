# Lakieditori JAR

This module is for building and deploying single JAR containing both API and UI. 

To build the JAR:

1. Run `gradle build publishToMavenLocal` in `/lakieditori-api` 
(installs api-module to local maven repository)
2. Run `mvn install` in `/lakieditori-ui` (runs `yarn build` with maven plugin and copies files 
to standard Java web app location and finally installs produced artifact to local maven repository)
3. Run `mvn package` in `/lakieditori-jar`
 (a runnable `*.jar` file is built to `target` directory)
 
To deploy previously produced `*.jar` to Azure:
 
Run `mvn azure-webapp:deploy` in `/lakieditori-jar`

(`az login` is required if current user is not logged in)

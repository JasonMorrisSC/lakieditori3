# Lakieditori

## Building and running

Requires Java 1.8, in `lakieditori-api` run:
```
gradle build
gradle bootRun
```

Requires node and yarn, in `lakieditori-ui` run:
```
yarn install
yarn start
```

Lakieditori should respond from port `3000`. Default username/password is admin/admin.

## Configuration

To enable spring profile based configuration, add a profile specific config like:

```
lakieditori-api/src/main/resources/application-dev.properties
```

and enable `dev` profile by:
```
gradle bootRun --args='--spring.profiles.active=dev'
```

### Configuring database

To enable persisting data to disk, add following properties to configuration:

```
spring.datasource.url=jdbc:h2:./data/db;AUTO_SERVER=TRUE
```

Lakieditori supports also Postgreql.

### Configuring lemmatization

To enable Finnish lemmatization, install:

https://github.com/jhkurki/morphological-analysis-service

and add following properties to configuration file:

```
fi.vero.lakieditori.textAnalysisService.url=http://localhost:8090/api
fi.vero.lakieditori.textAnalysisService.username=user
fi.vero.lakieditori.textAnalysisService.password=pass
```

package fi.vero.lakied.repository.schema;

import static fi.vero.lakied.util.security.PermissionEvaluator.permitAuthenticated;
import static fi.vero.lakied.util.security.PermissionEvaluator.permitSuperuser;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.jdbc.TransactionalJdbcWriteRepository;
import fi.vero.lakied.util.security.KeyAuthorizingReadRepository;
import fi.vero.lakied.util.security.KeyAuthorizingWriteRepository;
import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.w3c.dom.Document;

@Configuration
public class SchemaRepositoryConfiguration {

  @Bean
  public ReadRepository<String, Empty> schemaReadRepository(DataSource ds) {
    return
        new KeyAuthorizingReadRepository<>(
            new JdbcSchemaReadRepository(ds),
            permitAuthenticated());
  }

  @Bean
  public ReadRepository<Tuple2<String, Integer>, Tuple2<String, Document>> schemaDefinitionReadRepository(
      DataSource ds) {
    return
        new KeyAuthorizingReadRepository<>(
            new JdbcSchemaDefinitionReadRepository(ds),
            permitAuthenticated());
  }

  @Bean
  public WriteRepository<String, Empty> schemaWriteRepository(
      PlatformTransactionManager txm,
      DataSource ds) {
    return
        new KeyAuthorizingWriteRepository<>(
            new TransactionalJdbcWriteRepository<>(
                new JdbcSchemaWriteRepository(ds), txm),
            permitSuperuser());
  }

  @Bean
  public WriteRepository<Tuple2<String, Integer>, Tuple2<String, Document>> schemaDefinitionWriteRepository(
      PlatformTransactionManager txm,
      DataSource ds) {
    return
        new KeyAuthorizingWriteRepository<>(
            new TransactionalJdbcWriteRepository<>(
                new JdbcSchemaDefinitionWriteRepository(ds), txm),
            permitSuperuser());
  }

}

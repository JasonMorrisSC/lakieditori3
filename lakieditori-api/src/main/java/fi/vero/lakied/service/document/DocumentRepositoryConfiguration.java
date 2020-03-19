package fi.vero.lakied.service.document;

import static fi.vero.lakied.util.common.ResourceUtils.resourceToString;

import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple3;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.jdbc.TransactionalJdbcWriteRepository;
import fi.vero.lakied.util.security.AnyPermissionEvaluator;
import fi.vero.lakied.util.security.AuthorizedReadRepository;
import fi.vero.lakied.util.security.AuthorizedWriteRepository;
import fi.vero.lakied.util.security.InsertPermissionEvaluator;
import fi.vero.lakied.util.security.Permission;
import fi.vero.lakied.util.security.PermissionEvaluator;
import fi.vero.lakied.util.security.SuperuserPermissionEvaluator;
import fi.vero.lakied.util.xml.DocumentValidatingWriteRepository;
import fi.vero.lakied.util.xml.XmlUtils;
import java.util.UUID;
import javax.sql.DataSource;
import javax.xml.validation.Schema;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.w3c.dom.Document;

@Configuration
public class DocumentRepositoryConfiguration {

  @Bean
  public Schema documentSchema() {
    return XmlUtils.parseSchema(
        resourceToString("schemas/xml.xsd"),
        resourceToString("schemas/document.xsd"));
  }

  @Bean
  public ReadRepository<UUID, Audited<Document>> documentReadRepository(DataSource ds) {
    return
        new AuthorizedReadRepository<>(
            new JdbcDocumentReadRepository(ds),
            documentPermissionEvaluator(ds));
  }

  @Bean
  public WriteRepository<UUID, Document> documentWriteRepository(
      PlatformTransactionManager txm,
      DataSource ds) {
    return
        new AuthorizedWriteRepository<>(
            new DocumentValidatingWriteRepository<>(
                new TransactionalJdbcWriteRepository<>(
                    new JdbcDocumentWriteRepository(ds), txm),
                documentSchema()),
            documentPermissionEvaluator(ds));
  }

  @Bean
  public ReadRepository<Tuple3<UUID, String, Permission>, Empty> documentUserPermissionReadRepository(
      DataSource ds) {
    return new AuthorizedReadRepository<>(
        new JdbcDocumentUserPermissionReadRepository(ds),
        documentUserPermissionPermissionEvaluator(ds));
  }

  @Bean
  public WriteRepository<Tuple3<UUID, String, Permission>, Empty> documentUserPermissionWriteRepository(
      DataSource ds) {
    return new AuthorizedWriteRepository<>(
        new JdbcDocumentUserPermissionWriteRepository(ds),
        documentUserPermissionPermissionEvaluator(ds));
  }

  @Bean
  public PermissionEvaluator<Tuple3<UUID, String, Permission>> documentUserPermissionPermissionEvaluator(
      DataSource ds) {
    // delegate to document permission evaluator
    PermissionEvaluator<UUID> documentPermissionEvaluator = documentPermissionEvaluator(ds);
    return (user, id, p) -> documentPermissionEvaluator.hasPermission(user, id._1, p);
  }

  @Bean
  public PermissionEvaluator<UUID> documentPermissionEvaluator(DataSource ds) {
    return
        new AnyPermissionEvaluator<>(
            new SuperuserPermissionEvaluator<>(),
            new InsertPermissionEvaluator<>(),
            new DocumentUserPermissionEvaluator(
                new JdbcDocumentUserPermissionReadRepository(ds)));
  }

}

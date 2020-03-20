package fi.vero.lakied.service.document;

import static fi.vero.lakied.util.common.ResourceUtils.resourceToString;

import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.Tuple3;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.jdbc.TransactionalJdbcWriteRepository;
import fi.vero.lakied.util.security.AnyPermissionEvaluator;
import fi.vero.lakied.util.security.EntryAuthorizingReadRepository;
import fi.vero.lakied.util.security.InsertPermissionEvaluator;
import fi.vero.lakied.util.security.KeyAuthorizingReadRepository;
import fi.vero.lakied.util.security.KeyAuthorizingWriteRepository;
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
        new EntryAuthorizingReadRepository<>(
            new JdbcDocumentReadRepository(ds),
            documentReadPermissionEvaluator(ds));
  }

  @Bean
  public WriteRepository<UUID, Document> documentWriteRepository(
      PlatformTransactionManager txm,
      DataSource ds) {
    return
        new KeyAuthorizingWriteRepository<>(
            new DocumentValidatingWriteRepository<>(
                new TransactionalJdbcWriteRepository<>(
                    new JdbcDocumentWriteRepository(ds), txm),
                documentSchema()),
            documentPermissionEvaluator(ds));
  }

  @Bean
  public ReadRepository<Tuple3<UUID, String, Permission>, Empty> documentUserPermissionReadRepository
      (
          DataSource ds) {
    return new KeyAuthorizingReadRepository<>(
        new JdbcDocumentUserPermissionReadRepository(ds),
        documentUserPermissionPermissionEvaluator(ds));
  }

  @Bean
  public WriteRepository<Tuple3<UUID, String, Permission>, Empty> documentUserPermissionWriteRepository
      (
          DataSource ds) {
    return new KeyAuthorizingWriteRepository<>(
        new JdbcDocumentUserPermissionWriteRepository(ds),
        documentUserPermissionPermissionEvaluator(ds));
  }

  @Bean
  public PermissionEvaluator<Tuple3<UUID, String, Permission>> documentUserPermissionPermissionEvaluator
      (
          DataSource ds) {
    // Delegate READ and UPDATE permissions to documentPermissionEvaluator. Inserting or deleting
    // permissions requires also an UPDATE permission (inserting new documents is always allowed,
    // but inserting new permissions for existing document should be allowed only if user can
    // update the document, and deleting document means a different thing than deleting permissions).
    PermissionEvaluator<UUID> documentPermissionEvaluator = documentPermissionEvaluator(ds);
    return (user, id, p) ->
        p == Permission.INSERT || p == Permission.DELETE ?
            documentPermissionEvaluator.hasPermission(user, id._1, Permission.UPDATE) :
            documentPermissionEvaluator.hasPermission(user, id._1, p);
  }

  @Bean
  public PermissionEvaluator<Tuple2<UUID, Audited<Document>>> documentReadPermissionEvaluator(
      DataSource ds) {

    PermissionEvaluator<Tuple2<UUID, Audited<Document>>> allowReadsBasedOnDocumentState =
        (user, entry, permission) -> {
          String documentStateAttrValue = XmlUtils.queryText(entry._2.value, "/document/@state");
          return permission == Permission.READ
              && documentStateAttrValue.matches("DRAFT|RECOMMENDATION");
        };

    return new AnyPermissionEvaluator<>(
        allowReadsBasedOnDocumentState,
        (u, e, p) -> documentPermissionEvaluator(ds).hasPermission(u, e._1, p));
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

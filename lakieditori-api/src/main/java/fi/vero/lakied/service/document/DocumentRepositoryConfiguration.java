package fi.vero.lakied.service.document;

import static fi.vero.lakied.util.common.ResourceUtils.resourceToString;
import static fi.vero.lakied.util.security.PermissionEvaluator.permitAuthenticated;
import static fi.vero.lakied.util.security.PermissionEvaluator.permitInsert;
import static fi.vero.lakied.util.security.PermissionEvaluator.permitRead;

import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.Tuple3;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.jdbc.TransactionalJdbcWriteRepository;
import fi.vero.lakied.util.security.EntryAuthorizingReadRepository;
import fi.vero.lakied.util.security.KeyAuthorizingReadRepository;
import fi.vero.lakied.util.security.KeyAuthorizingWriteRepository;
import fi.vero.lakied.util.security.Permission;
import fi.vero.lakied.util.security.PermissionEvaluator;
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
            documentEntryReadPermissionEvaluator(ds));
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
  public ReadRepository<Tuple3<UUID, String, Permission>, Empty> documentUserPermissionReadRepository(
      DataSource ds) {
    return new KeyAuthorizingReadRepository<>(
        new JdbcDocumentUserPermissionReadRepository(ds),
        documentUserPermissionPermissionEvaluator(ds));
  }

  @Bean
  public WriteRepository<Tuple3<UUID, String, Permission>, Empty> documentUserPermissionWriteRepository(
      DataSource ds) {
    return new KeyAuthorizingWriteRepository<>(
        new JdbcDocumentUserPermissionWriteRepository(ds),
        documentUserPermissionPermissionEvaluator(ds));
  }

  @Bean
  public PermissionEvaluator<Tuple3<UUID, String, Permission>> documentUserPermissionPermissionEvaluator(
      DataSource ds) {
    // delegate to document evaluator by extracting a document id from the permission tuple
    PermissionEvaluator<Tuple3<UUID, String, Permission>> delegate =
        documentPermissionEvaluator(ds).mapObject(o -> o._1);

    // document permission modifications always require an update permission to the document
    return delegate
        .mapPermission(p -> p == Permission.INSERT ? Permission.UPDATE : p)
        .mapPermission(p -> p == Permission.DELETE ? Permission.UPDATE : p);
  }

  @Bean
  public PermissionEvaluator<Tuple2<UUID, Audited<Document>>> documentEntryReadPermissionEvaluator(
      DataSource ds) {

    PermissionEvaluator<Tuple2<UUID, Audited<Document>>> permitRecommendation =
        xPathPermissionEvaluator("/document/@state = 'RECOMMENDATION'").mapObject(t -> t._2.value);
    PermissionEvaluator<Tuple2<UUID, Audited<Document>>> permitDraft =
        xPathPermissionEvaluator("/document/@state = 'DRAFT'").mapObject(t -> t._2.value);

    return PermissionEvaluator.<Tuple2<UUID, Audited<Document>>>denyAll()
        // anyone can read recommendations
        .or(permitRecommendation
            .and(permitRead()))
        // authenticated can read drafts
        .or(permitDraft
            .and(permitAuthenticated())
            .and(permitRead()))
        // otherwise delegate
        .or(documentPermissionEvaluator(ds)
            .mapObject(e -> e._1));
  }

  private PermissionEvaluator<Document> xPathPermissionEvaluator(String xPathExpression) {
    return (u, o, p) -> XmlUtils.queryBoolean(o, xPathExpression);
  }

  @Bean
  public PermissionEvaluator<UUID> documentPermissionEvaluator(DataSource ds) {
    PermissionEvaluator<UUID> authenticated = PermissionEvaluator.permitAuthenticated();
    PermissionEvaluator<UUID> userPermission =
        new DocumentUserPermissionEvaluator(
            new JdbcDocumentUserPermissionReadRepository(ds));

    return PermissionEvaluator.<UUID>permitSuperuser()
        // authenticated can create new docs
        .or(authenticated.and(permitInsert()))
        // otherwise check database for user specific permissions
        .or(authenticated.and(userPermission));
  }

}

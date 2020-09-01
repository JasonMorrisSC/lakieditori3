package fi.vero.lakied.service.document;

import static fi.vero.lakied.util.security.PermissionEvaluator.permitAuthenticated;
import static fi.vero.lakied.util.security.PermissionEvaluator.permitInsert;
import static fi.vero.lakied.util.security.PermissionEvaluator.permitRead;
import static fi.vero.lakied.util.security.PermissionEvaluator.xPathPermissionEvaluator;

import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.Tuple3;
import fi.vero.lakied.util.common.Tuple4;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.jdbc.TransactionalJdbcWriteRepository;
import fi.vero.lakied.util.security.EntryAuthorizingReadRepository;
import fi.vero.lakied.util.security.KeyAuthorizingReadRepository;
import fi.vero.lakied.util.security.KeyAuthorizingWriteRepository;
import fi.vero.lakied.util.security.Permission;
import fi.vero.lakied.util.security.PermissionEvaluator;
import java.time.LocalDateTime;
import java.util.UUID;
import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.w3c.dom.Document;

@Configuration
public class DocumentRepositoryConfiguration {

  @Bean
  public ReadRepository<DocumentKey, Audited<Document>> documentReadRepository(
      DataSource ds) {
    return
        new EntryAuthorizingReadRepository<>(
            new JdbcDocumentReadRepository(ds),
            documentEntryPermissionEvaluator(ds));
  }

  @Bean
  public ReadRepository<Tuple3<String, UUID, String>, String> documentPropertiesReadRepository(
      DataSource ds) {
    return
        new KeyAuthorizingReadRepository<>(
            new JdbcDocumentPropertiesReadRepository(ds),
            documentPermissionEvaluator(ds).mapObject(o -> DocumentKey.of(o._1, o._2)));
  }

  @Bean
  public ReadRepository<DocumentCommentKey, Audited<Tuple2<String, String>>> documentCommentsReadRepository(
      DataSource ds) {
    return
        new KeyAuthorizingReadRepository<>(
            new JdbcDocumentCommentsReadRepository(ds),
            documentPermissionEvaluator(ds)
                .mapObject(o -> DocumentKey.of(o.documentSchemaName, o.documentId)));
  }

  @Bean
  public WriteRepository<DocumentKey, Document> documentWriteRepository(
      ReadRepository<Tuple2<String, Integer>, Tuple2<String, Document>> schemaDefinitionReadRepository,
      PlatformTransactionManager txm,
      DataSource ds) {
    return
        new KeyAuthorizingWriteRepository<>(
            new ValidatingDocumentWriteRepository(
                new TransactionalJdbcWriteRepository<>(
                    new JdbcDocumentWriteRepository(ds), txm),
                schemaDefinitionReadRepository),
            documentPermissionEvaluator(ds));
  }

  @Bean
  public WriteRepository<Tuple3<String, UUID, String>, String> documentPropertiesWriteRepository(
      PlatformTransactionManager txm,
      DataSource ds) {
    return
        new KeyAuthorizingWriteRepository<>(
            new TransactionalJdbcWriteRepository<>(
                new JdbcDocumentPropertiesWriteRepository(ds), txm),
            documentPermissionEvaluator(ds).mapObject(o -> DocumentKey.of(o._1, o._2)));
  }

  @Bean
  public WriteRepository<DocumentCommentKey, Tuple2<String, String>> documentCommentsWriteRepository(
      PlatformTransactionManager txm,
      DataSource ds) {
    return
        new KeyAuthorizingWriteRepository<>(
            new TransactionalJdbcWriteRepository<>(
                new JdbcDocumentCommentsWriteRepository(ds), txm),
            documentPermissionEvaluator(ds)
                .mapObject(o -> DocumentKey.of(o.documentSchemaName, o.documentId)));
  }

  @Bean
  public ReadRepository<DocumentKey, Audited<Document>> documentVersionReadRepository(
      DataSource ds) {
    return
        new EntryAuthorizingReadRepository<>(
            new JdbcDocumentVersionReadRepository(ds),
            documentPermissionEvaluator(ds).mapObject(t -> t._1));
  }

  @Bean
  public WriteRepository<DocumentKey, Document> documentVersionWriteRepository(
      ReadRepository<Tuple2<String, Integer>, Tuple2<String, Document>> schemaDefinitionReadRepository,
      PlatformTransactionManager txm,
      DataSource ds) {
    return
        new KeyAuthorizingWriteRepository<>(
            new ValidatingDocumentWriteRepository(
                new TransactionalJdbcWriteRepository<>(
                    new JdbcDocumentVersionWriteRepository(ds), txm),
                schemaDefinitionReadRepository),
            documentPermissionEvaluator(ds));
  }

  @Bean
  public ReadRepository<Tuple4<String, UUID, String, Permission>, Empty> documentUserPermissionReadRepository(
      DataSource ds) {
    return new KeyAuthorizingReadRepository<>(
        new JdbcDocumentUserPermissionReadRepository(ds),
        documentUserPermissionPermissionEvaluator(ds));
  }

  @Bean
  public WriteRepository<Tuple4<String, UUID, String, Permission>, Empty> documentUserPermissionWriteRepository(
      DataSource ds) {
    return new KeyAuthorizingWriteRepository<>(
        new JdbcDocumentUserPermissionWriteRepository(ds),
        documentUserPermissionPermissionEvaluator(ds));
  }

  @Bean
  public ReadRepository<DocumentKey, Tuple2<String, LocalDateTime>> documentLockReadRepository(
      DataSource ds) {
    return new KeyAuthorizingReadRepository<>(
        new JdbcDocumentLockReadRepository(ds),
        documentPermissionEvaluator(ds));
  }

  @Bean
  public WriteRepository<DocumentKey, Empty> documentLockWriteRepository(
      DataSource ds) {
    return new KeyAuthorizingWriteRepository<>(
        new JdbcDocumentLockWriteRepository(ds),
        documentPermissionEvaluator(ds)
            .mapPermission(p -> p == Permission.INSERT ? Permission.UPDATE : p)
            .mapPermission(p -> p == Permission.DELETE ? Permission.UPDATE : p));
  }

  @Bean
  public PermissionEvaluator<Tuple4<String, UUID, String, Permission>> documentUserPermissionPermissionEvaluator(
      DataSource ds) {
    // delegate to document evaluator by extracting a document key from the permission tuple
    PermissionEvaluator<Tuple4<String, UUID, String, Permission>> delegate =
        documentPermissionEvaluator(ds).mapObject(o -> DocumentKey.of(o._1, o._2));

    // document permission modifications always require an update permission to the document
    return delegate
        .mapPermission(p -> p == Permission.INSERT ? Permission.UPDATE : p)
        .mapPermission(p -> p == Permission.DELETE ? Permission.UPDATE : p);
  }

  @Bean
  public PermissionEvaluator<Tuple2<DocumentKey, Audited<Document>>> documentEntryPermissionEvaluator(
      DataSource ds) {

    PermissionEvaluator<Tuple2<DocumentKey, Audited<Document>>> permitRecommendation =
        xPathPermissionEvaluator("/*/@state = 'RECOMMENDATION'").mapObject(t -> t._2.value);
    PermissionEvaluator<Tuple2<DocumentKey, Audited<Document>>> permitDraft =
        xPathPermissionEvaluator("/*/@state = 'DRAFT'").mapObject(t -> t._2.value);

    return PermissionEvaluator.<Tuple2<DocumentKey, Audited<Document>>>denyAll()
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

  @Bean
  public PermissionEvaluator<DocumentKey> documentPermissionEvaluator(DataSource ds) {
    PermissionEvaluator<DocumentKey> authenticated = PermissionEvaluator
        .permitAuthenticated();
    PermissionEvaluator<DocumentKey> userPermission =
        new DocumentUserPermissionEvaluator(
            new JdbcDocumentUserPermissionReadRepository(ds));

    return PermissionEvaluator.<DocumentKey>permitSuperuser()
        // authenticated can create new docs
        .or(authenticated.and(permitInsert()))
        // otherwise check database for user specific permissions
        .or(authenticated.and(userPermission));
  }

}

package fi.vero.lakied.repository.document;

import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import java.time.LocalDateTime;
import java.util.UUID;

public final class DocumentLockCriteria {

  private DocumentLockCriteria() {
  }

  public static SqlCriteria<DocumentKey, Tuple2<String, LocalDateTime>> byDocumentKey(
      DocumentKey key) {
    return byDocumentKey(key.schemaName, key.id);
  }

  public static SqlCriteria<DocumentKey, Tuple2<String, LocalDateTime>> byDocumentKey(
      String schemaName, UUID id) {
    return Criteria.and(byDocumentSchemaName(schemaName), byDocumentId(id));
  }

  public static SqlCriteria<DocumentKey, Tuple2<String, LocalDateTime>> byDocumentSchemaName(
      String schemaName) {
    return Criteria.sql(
        (k, v) -> schemaName.equals(k.schemaName),
        "document_schema_name = ?", schemaName);
  }

  public static SqlCriteria<DocumentKey, Tuple2<String, LocalDateTime>> byDocumentId(
      UUID id) {
    return Criteria.sql(
        (k, v) -> id.equals(k.id),
        "document_id = ?", id);
  }

  public static SqlCriteria<DocumentKey, Tuple2<String, LocalDateTime>> byUsername(
      String username) {
    return Criteria.sql((k, v) -> v._1.equals(username), "username = ?", username);
  }

}

package fi.vero.lakied.repository.document;

import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import java.util.UUID;

public final class DocumentPropertiesCriteria {

  private DocumentPropertiesCriteria() {
  }

  public static SqlCriteria<DocumentPropertyKey, String> byDocumentKey(
      String schemaName, UUID id) {
    return Criteria.and(byDocumentSchemaName(schemaName), byDocumentId(id));
  }

  public static SqlCriteria<DocumentPropertyKey, String> byDocumentSchemaName(
      String schemaName) {
    return Criteria.sql(
        (k, v) -> schemaName.equals(k.documentKey.schemaName),
        "document_schema_name = ?", schemaName);
  }

  public static SqlCriteria<DocumentPropertyKey, String> byDocumentId(UUID id) {
    return Criteria.sql(
        (k, v) -> id.equals(k.documentKey.id),
        "document_id = ?", id);
  }

  public static SqlCriteria<DocumentPropertyKey, String> byKey(String id) {
    return Criteria.sql(
        (k, v) -> id.equals(k.key),
        "key = ?", id);
  }

}

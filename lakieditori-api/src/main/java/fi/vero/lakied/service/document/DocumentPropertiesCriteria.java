package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.Tuple3;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import java.util.UUID;

public final class DocumentPropertiesCriteria {

  private DocumentPropertiesCriteria() {
  }

  public static SqlCriteria<Tuple3<String, UUID, String>, String> byDocumentKey(
      String schemaName, UUID id) {
    return Criteria.and(byDocumentSchemaName(schemaName), byDocumentId(id));
  }

  public static SqlCriteria<Tuple3<String, UUID, String>, String> byDocumentSchemaName(
      String schemaName) {
    return Criteria.sql(
        (k, v) -> schemaName.equals(k._1),
        "document_schema_name = ?", schemaName);
  }

  public static SqlCriteria<Tuple3<String, UUID, String>, String> byDocumentId(UUID id) {
    return Criteria.sql(
        (k, v) -> id.equals(k._2),
        "document_id = ?", id);
  }

  public static SqlCriteria<Tuple3<String, UUID, String>, String> byKey(String id) {
    return Criteria.sql(
        (k, v) -> id.equals(k._3),
        "key = ?", id);
  }

}

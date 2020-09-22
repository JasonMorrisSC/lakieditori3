package fi.vero.lakied.repository.document;

import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import java.util.UUID;
import org.w3c.dom.Document;

public final class DocumentCriteria {

  private DocumentCriteria() {
  }

  public static SqlCriteria<DocumentKey, Audited<Document>> byKey(DocumentKey key) {
    return byKey(key.schemaName, key.id);
  }

  public static SqlCriteria<DocumentKey, Audited<Document>> byKey(String schemaName,
      UUID id) {
    return Criteria.and(bySchemaName(schemaName), byId(id));
  }

  public static SqlCriteria<DocumentKey, Audited<Document>> bySchemaName(
      String schemaName) {
    return Criteria.sql(
        (k, v) -> schemaName.equals(k.schemaName),
        "schema_name = ?", schemaName);
  }

  public static SqlCriteria<DocumentKey, Audited<Document>> byId(UUID id) {
    return Criteria.sql((k, v) -> id.equals(k.id), "id = ?", id);
  }

}

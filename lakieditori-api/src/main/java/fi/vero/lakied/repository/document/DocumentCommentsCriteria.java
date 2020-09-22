package fi.vero.lakied.repository.document;

import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import java.util.UUID;

public final class DocumentCommentsCriteria {

  private DocumentCommentsCriteria() {
  }

  public static SqlCriteria<DocumentCommentKey, Audited<Tuple2<String, String>>> byDocumentKey(
      String schemaName, UUID id) {
    return Criteria.and(byDocumentSchemaName(schemaName), byDocumentId(id));
  }

  public static SqlCriteria<DocumentCommentKey, Audited<Tuple2<String, String>>> byDocumentSchemaName(
      String schemaName) {
    return Criteria.sql(
        (k, v) -> schemaName.equals(k.documentSchemaName),
        "document_schema_name = ?", schemaName);
  }

  public static SqlCriteria<DocumentCommentKey, Audited<Tuple2<String, String>>> byDocumentId(
      UUID id) {
    return Criteria.sql(
        (k, v) -> id.equals(k.documentId),
        "document_id = ?", id);
  }

}

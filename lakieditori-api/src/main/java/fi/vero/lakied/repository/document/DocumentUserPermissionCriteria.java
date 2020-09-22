package fi.vero.lakied.repository.document;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple4;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import fi.vero.lakied.util.security.Permission;
import java.util.UUID;

public final class DocumentUserPermissionCriteria {

  private DocumentUserPermissionCriteria() {
  }

  public static SqlCriteria<Tuple4<String, UUID, String, Permission>, Empty> byKey(
      String schemaName, UUID documentId, String username, Permission permission) {
    return Criteria.sql(
        (k, v) -> Tuple.of(schemaName, documentId, username, permission).equals(k),
        "document_schema_name = ? and document_id = ? and username = ? and permission = ?",
        schemaName,
        documentId,
        username,
        permission.toString());
  }

  public static SqlCriteria<Tuple4<String, UUID, String, Permission>, Empty> byDocumentKey(
      String schemaName, UUID documentId) {
    return Criteria.sql(
        (k, v) -> schemaName.equals(k._1) && documentId.equals(k._2),
        "document_schema_name = ? and document_id = ?",
        schemaName,
        documentId);
  }

}

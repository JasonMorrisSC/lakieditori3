package fi.vero.lakied.repository.document;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import fi.vero.lakied.util.security.Permission;
import java.util.UUID;

public final class DocumentUserPermissionCriteria {

  private DocumentUserPermissionCriteria() {
  }

  public static SqlCriteria<DocumentUserPermissionKey, Empty> byKey(
      String schemaName, UUID documentId, String username, Permission permission) {
    return Criteria.sql(
        (k, v) ->
            DocumentUserPermissionKey.of(schemaName, documentId, username, permission).equals(k),
        "document_schema_name = ? and document_id = ? and username = ? and permission = ?",
        schemaName,
        documentId,
        username,
        permission.toString());
  }

  public static SqlCriteria<DocumentUserPermissionKey, Empty> byDocumentKey(
      String schemaName, UUID documentId) {
    return Criteria.sql(
        (k, v) ->
            schemaName.equals(k.documentKey.schemaName) && documentId.equals(k.documentKey.id),
        "document_schema_name = ? and document_id = ?",
        schemaName,
        documentId);
  }

}

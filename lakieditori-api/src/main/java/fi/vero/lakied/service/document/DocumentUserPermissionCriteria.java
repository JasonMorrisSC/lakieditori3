package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple3;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import fi.vero.lakied.util.security.Permission;
import java.util.UUID;

public final class DocumentUserPermissionCriteria {

  private DocumentUserPermissionCriteria() {
  }

  public static SqlCriteria<Tuple3<UUID, String, Permission>, Empty> byId(
      UUID documentId, String username, Permission permission) {
    return Criteria.sql(
        (k, v) -> Tuple.of(documentId, username, permission).equals(k),
        "document_id = ? and username = ? and permission = ?",
        documentId,
        username,
        permission.toString());
  }

  public static SqlCriteria<Tuple3<UUID, String, Permission>, Empty> byDocumentId(
      UUID documentId) {
    return Criteria.sql(
        (k, v) -> documentId.equals(k._1),
        "document_id = ?",
        documentId);
  }

}

package fi.vero.lakied.service.document;

import static fi.vero.lakied.service.document.DocumentUserPermissionCriteria.byKey;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple4;
import fi.vero.lakied.util.security.Permission;
import fi.vero.lakied.util.security.PermissionEvaluator;
import fi.vero.lakied.util.security.User;
import java.util.UUID;

public class DocumentUserPermissionEvaluator implements PermissionEvaluator<DocumentKey> {

  private final ReadRepository<Tuple4<String, UUID, String, Permission>, Empty> documentUserPermissions;

  public DocumentUserPermissionEvaluator(
      ReadRepository<Tuple4<String, UUID, String, Permission>, Empty> documentUserPermissions) {
    this.documentUserPermissions = documentUserPermissions;
  }

  @Override
  public boolean hasPermission(User user, DocumentKey key, Permission permission) {
    return !documentUserPermissions.isEmpty(
        byKey(key.schemaName, key.id, user.getUsername(), permission), user);
  }

}

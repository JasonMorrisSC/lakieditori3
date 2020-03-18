package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple3;
import fi.vero.lakied.util.security.Permission;
import fi.vero.lakied.util.security.PermissionEvaluator;
import fi.vero.lakied.util.security.User;
import java.util.UUID;

public class DocumentUserPermissionEvaluator implements PermissionEvaluator<UUID> {

  private final ReadRepository<Tuple3<UUID, String, Permission>, Empty> documentUserPermissions;

  public DocumentUserPermissionEvaluator(
      ReadRepository<Tuple3<UUID, String, Permission>, Empty> documentUserPermissions) {
    this.documentUserPermissions = documentUserPermissions;
  }

  @Override
  public boolean hasPermission(User user, UUID id, Permission permission) {
    return documentUserPermissions
        .count(DocumentUserPermissionCriteria.byId(id, user.getUsername(), permission), user) > 0;
  }

}

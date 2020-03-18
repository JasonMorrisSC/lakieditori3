package fi.vero.lakied.util.security;

/**
 * Grants permission for insert regardless of object or user
 */
public class InsertPermissionEvaluator<E> implements PermissionEvaluator<E> {

  @Override
  public boolean hasPermission(User user, E object, Permission permission) {
    return permission == Permission.INSERT;
  }

}

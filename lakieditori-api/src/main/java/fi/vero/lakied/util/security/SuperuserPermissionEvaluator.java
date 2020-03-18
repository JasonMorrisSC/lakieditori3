package fi.vero.lakied.util.security;

/**
 * Grants permission if user is superuser.
 */
public class SuperuserPermissionEvaluator<E> implements PermissionEvaluator<E> {

  @Override
  public boolean hasPermission(User user, E object, Permission permission) {
    return user.isSuperuser();
  }

}

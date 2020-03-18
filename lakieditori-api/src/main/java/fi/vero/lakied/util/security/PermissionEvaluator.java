package fi.vero.lakied.util.security;

public interface PermissionEvaluator<E> {

  boolean hasPermission(User user, E object, Permission permission);

}

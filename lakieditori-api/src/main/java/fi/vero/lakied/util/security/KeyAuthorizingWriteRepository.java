package fi.vero.lakied.util.security;

import fi.vero.lakied.util.common.WriteRepository;
import org.springframework.security.access.AccessDeniedException;

/**
 * Checks WRITE permission before operation, throws {@code AccessDeniedException} if permission is
 * missing.
 */
public class KeyAuthorizingWriteRepository<K, V> implements WriteRepository<K, V> {

  private final WriteRepository<K, V> delegate;
  private final PermissionEvaluator<K> permissionEvaluator;

  public KeyAuthorizingWriteRepository(
      WriteRepository<K, V> delegate,
      PermissionEvaluator<K> permissionEvaluator) {
    this.delegate = delegate;
    this.permissionEvaluator = permissionEvaluator;
  }

  @Override
  public void insert(K key, V value, User user) {
    if (permissionEvaluator.hasPermission(user, key, Permission.INSERT)) {
      delegate.insert(key, value, user);
    } else {
      throw new AccessDeniedException("Access is denied");
    }
  }

  @Override
  public void update(K key, V value, User user) {
    if (permissionEvaluator.hasPermission(user, key, Permission.UPDATE)) {
      delegate.update(key, value, user);
    } else {
      throw new AccessDeniedException("Access is denied");
    }
  }

  @Override
  public void delete(K key, User user) {
    if (permissionEvaluator.hasPermission(user, key, Permission.DELETE)) {
      delegate.delete(key, user);
    } else {
      throw new AccessDeniedException("Access is denied");
    }
  }

}

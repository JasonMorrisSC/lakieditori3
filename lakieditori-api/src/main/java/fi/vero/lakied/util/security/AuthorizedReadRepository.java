package fi.vero.lakied.util.security;

import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.Criteria;
import java.util.stream.Stream;

/**
 * Filters out values that the user has no READ permission.
 */
public class AuthorizedReadRepository<K, V> implements ReadRepository<K, V> {

  private final ReadRepository<K, V> delegate;
  private final PermissionEvaluator<K> permissionEvaluator;

  public AuthorizedReadRepository(
      ReadRepository<K, V> delegate,
      PermissionEvaluator<K> permissionEvaluator) {
    this.delegate = delegate;
    this.permissionEvaluator = permissionEvaluator;
  }

  @Override
  public Stream<Tuple2<K, V>> entries(Criteria<K, V> criteria, User user) {
    return delegate.entries(criteria, user)
        .filter(t -> permissionEvaluator.hasPermission(user, t._1, Permission.READ));
  }

}

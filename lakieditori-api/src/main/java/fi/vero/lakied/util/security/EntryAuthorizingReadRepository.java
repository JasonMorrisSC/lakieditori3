package fi.vero.lakied.util.security;

import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.Criteria;
import java.util.stream.Stream;

/**
 * Filters out entries that the user has no READ permission.
 */
public class EntryAuthorizingReadRepository<K, V> implements ReadRepository<K, V> {

  private final ReadRepository<K, V> delegate;
  private final PermissionEvaluator<Tuple2<K, V>> permissionEvaluator;

  public EntryAuthorizingReadRepository(
      ReadRepository<K, V> delegate,
      PermissionEvaluator<Tuple2<K, V>> permissionEvaluator) {
    this.delegate = delegate;
    this.permissionEvaluator = permissionEvaluator;
  }

  @Override
  public Stream<Tuple2<K, V>> entries(Criteria<K, V> criteria, User user) {
    return delegate.entries(criteria, user)
        .filter(t -> permissionEvaluator.hasPermission(user, t, Permission.READ));
  }

}

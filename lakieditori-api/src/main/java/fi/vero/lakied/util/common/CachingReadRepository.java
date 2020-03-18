package fi.vero.lakied.util.common;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.collect.ImmutableList;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.security.User;
import java.util.concurrent.ExecutionException;
import java.util.stream.Stream;

/**
 * Caches queried entry sets.
 * <p>
 * Warning: when values are returned from the cache no authorization is done.
 */
public class CachingReadRepository<K, V> implements ReadRepository<K, V> {

  private final ReadRepository<K, V> delegate;
  private final Cache<Criteria<K, V>, ImmutableList<Tuple2<K, V>>> cache;

  public CachingReadRepository(ReadRepository<K, V> delegate) {
    this(delegate, CacheBuilder.newBuilder().softValues().build());
  }

  public CachingReadRepository(ReadRepository<K, V> delegate,
      Cache<Criteria<K, V>, ImmutableList<Tuple2<K, V>>> cache) {
    this.delegate = delegate;
    this.cache = cache;
  }

  @Override
  public Stream<Tuple2<K, V>> entries(Criteria<K, V> criteria, User user) {
    try {
      return cache.get(criteria, () -> {
        try (Stream<Tuple2<K, V>> stream = delegate.entries(criteria, user)) {
          return stream.collect(ImmutableList.toImmutableList());
        }
      }).stream();
    } catch (ExecutionException e) {
      throw new RuntimeException(e);
    }
  }

}

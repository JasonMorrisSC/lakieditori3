package fi.vero.lakied.util.common;

import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.security.User;
import java.util.Optional;
import java.util.function.BiConsumer;
import java.util.stream.Stream;

public interface ReadRepository<K, V> {

  default long count(Criteria<K, V> criteria, User user) {
    try (Stream<K> keyStream = keys(criteria, user)) {
      return keyStream.count();
    }
  }

  default Stream<K> keys(Criteria<K, V> criteria, User user) {
    return entries(criteria, user).map(t -> t._1);
  }

  default Optional<V> value(Criteria<K, V> criteria, User user) {
    try (Stream<V> values = values(criteria, user)) {
      return values.findFirst();
    }
  }

  default Stream<V> values(Criteria<K, V> criteria, User user) {
    return entries(criteria, user).map(t -> t._2);
  }

  default void forEachEntry(Criteria<K, V> criteria, User user, BiConsumer<K, V> consumer) {
    try (Stream<Tuple2<K, V>> entries = entries(criteria, user)) {
      entries.forEach(e -> consumer.accept(e._1, e._2));
    }
  }

  Stream<Tuple2<K, V>> entries(Criteria<K, V> criteria, User user);

}

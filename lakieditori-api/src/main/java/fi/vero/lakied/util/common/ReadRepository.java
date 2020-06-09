package fi.vero.lakied.util.common;

import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.security.User;
import java.util.Optional;
import java.util.function.BiConsumer;
import java.util.function.Consumer;
import java.util.stream.Collector;
import java.util.stream.Stream;

public interface ReadRepository<K, V> {

  default boolean isEmpty(Criteria<K, V> criteria, User user) {
    return !key(criteria, user).isPresent();
  }

  default long count(Criteria<K, V> criteria, User user) {
    try (Stream<K> keyStream = keys(criteria, user)) {
      return keyStream.count();
    }
  }

  default Stream<K> keys(Criteria<K, V> criteria, User user) {
    return entries(criteria, user).map(t -> t._1);
  }

  default Stream<V> values(Criteria<K, V> criteria, User user) {
    return entries(criteria, user).map(t -> t._2);
  }

  default Optional<K> key(Criteria<K, V> criteria, User user) {
    try (Stream<K> keys = keys(criteria, user)) {
      return keys.findFirst();
    }
  }

  default Optional<V> value(Criteria<K, V> criteria, User user) {
    try (Stream<V> values = values(criteria, user)) {
      return values.findFirst();
    }
  }

  default void forEachKey(Criteria<K, V> criteria, User user, Consumer<K> consumer) {
    try (Stream<K> keys = keys(criteria, user)) {
      keys.forEach(consumer);
    }
  }

  default void forEachValue(Criteria<K, V> criteria, User user, Consumer<V> consumer) {
    try (Stream<V> values = values(criteria, user)) {
      values.forEach(consumer);
    }
  }

  default void forEachEntry(Criteria<K, V> criteria, User user, BiConsumer<K, V> consumer) {
    try (Stream<Tuple2<K, V>> entries = entries(criteria, user)) {
      entries.forEach(e -> consumer.accept(e._1, e._2));
    }
  }

  default <A, R> R collectKeys(Criteria<K, V> criteria, User user,
      Collector<K, A, R> collector) {
    try (Stream<K> keys = keys(criteria, user)) {
      return keys.collect(collector);
    }
  }

  default <A, R> R collectValues(Criteria<K, V> criteria, User user,
      Collector<V, A, R> collector) {
    try (Stream<V> values = values(criteria, user)) {
      return values.collect(collector);
    }
  }

  default <A, R> R collectEntries(Criteria<K, V> criteria, User user,
      Collector<Tuple2<K, V>, A, R> collector) {
    try (Stream<Tuple2<K, V>> entries = entries(criteria, user)) {
      return entries.collect(collector);
    }
  }


  Stream<Tuple2<K, V>> entries(Criteria<K, V> criteria, User user);

}

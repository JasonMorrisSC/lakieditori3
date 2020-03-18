package fi.vero.lakied.util.common;

import fi.vero.lakied.util.security.User;

public interface WriteRepository<K, V> {

  void insert(K key, V value, User user);

  void update(K key, V value, User user);

  void delete(K key, User user);

}

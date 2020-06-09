package fi.vero.lakied.util.common;

import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import fi.vero.lakied.util.security.User;
import java.util.stream.Stream;

public interface SqlReadRepository<K, V> extends ReadRepository<K, V> {

  default Stream<Tuple2<K, V>> entries(Criteria<K, V> criteria, User user) {
    return entries((SqlCriteria<K, V>) criteria, user);
  }

  Stream<Tuple2<K, V>> entries(SqlCriteria<K, V> criteria, User user);

}

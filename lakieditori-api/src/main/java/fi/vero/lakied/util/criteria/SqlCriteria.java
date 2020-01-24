package fi.vero.lakied.util.criteria;

public interface SqlCriteria<K, V> extends Criteria<K, V> {

  String sql();

  default Object[] args() {
    return new Object[]{};
  }

}

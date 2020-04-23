package fi.vero.lakied.util.criteria;

import com.google.common.collect.ObjectArrays;
import java.util.function.BiPredicate;

public interface Criteria<K, V> extends BiPredicate<K, V> {

  /**
   * Create "inline" SQL criteria.
   */
  static <K, V> SqlCriteria<K, V> sql(Criteria<K, V> criteria, String sql, Object... args) {
    return new SqlCriteria<K, V>() {
      @Override
      public String sql() {
        return sql;
      }

      @Override
      public Object[] args() {
        return args;
      }

      @Override
      public boolean test(K k, V v) {
        return criteria.test(k, v);
      }
    };
  }

  static <K, V> Criteria<K, V> and(Criteria<K, V> left, Criteria<K, V> right) {
    return (k, v) -> left.test(k, v) && right.test(k, v);
  }

  static <K, V> SqlCriteria<K, V> and(SqlCriteria<K, V> left, SqlCriteria<K, V> right) {
    return new SqlCriteria<K, V>() {
      @Override
      public String sql() {
        return "(" + left.sql() + ") AND (" + right.sql() + ")";
      }

      @Override
      public Object[] args() {
        return ObjectArrays.concat(left.args(), right.args(), Object.class);
      }

      @Override
      public boolean test(K k, V v) {
        return left.test(k, v) && right.test(k, v);
      }
    };
  }

  static <K, V> SqlCriteria<K, V> matchAll() {
    return new MatchAll<>();
  }

  static <K, V> SqlCriteria<K, V> matchNone() {
    return new MatchNone<>();
  }

  final class MatchAll<K, V> implements SqlCriteria<K, V> {

    @Override
    public String sql() {
      return "1 = 1";
    }

    @Override
    public boolean test(K k, V v) {
      return true;
    }

    @Override
    public int hashCode() {
      return MatchAll.class.hashCode();
    }

    @Override
    public boolean equals(Object that) {
      return that instanceof MatchAll;
    }

  }

  final class MatchNone<K, V> implements SqlCriteria<K, V> {

    @Override
    public String sql() {
      return "1 = 0";
    }

    @Override
    public boolean test(K k, V v) {
      return false;
    }

    @Override
    public int hashCode() {
      return MatchNone.class.hashCode();
    }

    @Override
    public boolean equals(Object that) {
      return that instanceof MatchNone;
    }

  }

}

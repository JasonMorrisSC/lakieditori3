package fi.vero.lakied.util.criteria;

import com.google.common.base.MoreObjects;
import com.google.common.collect.ImmutableMultimap;
import com.google.common.collect.Multimap;
import java.util.Objects;

public class StringMultimapCriteria<K, V> implements Criteria<K, V> {

  private final ImmutableMultimap<String, String> multimap;

  public StringMultimapCriteria(Multimap<String, String> multimap) {
    this.multimap = ImmutableMultimap.copyOf(multimap);
  }

  public static <K, V> StringMultimapCriteria<K, V> of(Multimap<String, String> multimap) {
    return new StringMultimapCriteria<>(multimap);
  }

  public ImmutableMultimap<String, String> getMultimap() {
    return multimap;
  }

  @Override
  public boolean test(K k, V v) {
    throw new UnsupportedOperationException();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    StringMultimapCriteria<?, ?> that = (StringMultimapCriteria<?, ?>) o;
    return Objects.equals(multimap, that.multimap);
  }

  @Override
  public int hashCode() {
    return Objects.hash(multimap);
  }

  @Override
  public String toString() {
    return MoreObjects.toStringHelper(this)
        .add("multimap", multimap)
        .toString();
  }

}

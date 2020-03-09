package fi.vero.lakied.util.criteria;

import com.google.common.base.MoreObjects;
import com.google.gson.JsonObject;
import fi.vero.lakied.util.json.JsonElementFactory;
import java.util.Objects;

/**
 * Criteria that is expressed as JSON object.
 */
public class JsonCriteria<K, V> implements Criteria<K, V> {

  private final JsonObject criteria;

  private JsonCriteria(JsonObject criteria) {
    this.criteria = criteria;
  }

  public static <K, V> JsonCriteria<K, V> of(String key, String value) {
    return of(JsonElementFactory.object(key, JsonElementFactory.primitive(value)));
  }

  public static <K, V> JsonCriteria<K, V> of(JsonObject jsonObject) {
    return new JsonCriteria<>(jsonObject);
  }

  public JsonObject criteria() {
    return criteria;
  }

  @Override
  public boolean test(K s, V v) {
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
    JsonCriteria<?, ?> that = (JsonCriteria<?, ?>) o;
    return Objects.equals(criteria, that.criteria);
  }

  @Override
  public int hashCode() {
    return Objects.hash(criteria);
  }

  @Override
  public String toString() {
    return MoreObjects.toStringHelper(this)
        .add("criteria", criteria)
        .toString();
  }

}

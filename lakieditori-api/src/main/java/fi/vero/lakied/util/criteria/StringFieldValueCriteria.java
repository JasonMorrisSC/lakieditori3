package fi.vero.lakied.util.criteria;

import com.google.common.base.MoreObjects;
import java.util.Objects;

public abstract class StringFieldValueCriteria<K, V> implements Criteria<K, V> {

  private final String fieldName;
  private final String fieldValue;

  public StringFieldValueCriteria(String fieldName, String fieldValue) {
    this.fieldName = fieldName;
    this.fieldValue = fieldValue;
  }

  public String getFieldName() {
    return fieldName;
  }

  public String getFieldValue() {
    return fieldValue;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    StringFieldValueCriteria<?, ?> that = (StringFieldValueCriteria<?, ?>) o;
    return Objects.equals(fieldName, that.fieldName) &&
        Objects.equals(fieldValue, that.fieldValue);
  }

  @Override
  public int hashCode() {
    return Objects.hash(fieldName, fieldValue);
  }

  @Override
  public String toString() {
    return MoreObjects.toStringHelper(this)
        .add("fieldName", fieldName)
        .add("fieldValue", fieldValue)
        .toString();
  }

}

package fi.vero.lakied.service.document;

import java.util.Objects;
import java.util.UUID;

public final class DocumentKey {

  public final String schemaName;
  public final UUID id;

  private DocumentKey(String schemaName, UUID id) {
    this.schemaName = Objects.requireNonNull(schemaName);
    this.id = Objects.requireNonNull(id);
  }

  public static DocumentKey of(String schemaName, UUID id) {
    return new DocumentKey(schemaName, id);
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    DocumentKey that = (DocumentKey) o;
    return Objects.equals(schemaName, that.schemaName) &&
        Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return Objects.hash(schemaName, id);
  }

  @Override
  public String toString() {
    return "(" + schemaName + ", " + id + ")";
  }

}

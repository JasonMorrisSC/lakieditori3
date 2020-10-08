package fi.vero.lakied.repository.document;

import java.util.Objects;
import java.util.UUID;

public final class DocumentPropertyKey {

  public final DocumentKey documentKey;
  public final String key;

  public DocumentPropertyKey(DocumentKey documentKey, String key) {
    this.documentKey = Objects.requireNonNull(documentKey);
    this.key = Objects.requireNonNull(key);
  }

  public static DocumentPropertyKey of(String documentSchemaName, UUID documentId, String key) {
    return new DocumentPropertyKey(DocumentKey.of(documentSchemaName, documentId), key);
  }

  public static DocumentPropertyKey of(DocumentKey documentKey, String key) {
    return new DocumentPropertyKey(documentKey, key);
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    DocumentPropertyKey that = (DocumentPropertyKey) o;
    return Objects.equals(documentKey, that.documentKey) &&
        Objects.equals(key, that.key);
  }

  @Override
  public int hashCode() {
    return Objects.hash(documentKey, key);
  }

  @Override
  public String toString() {
    return "(" + documentKey + ", " + key + ")";
  }

}

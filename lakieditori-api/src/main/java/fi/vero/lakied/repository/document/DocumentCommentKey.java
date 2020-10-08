package fi.vero.lakied.repository.document;

import java.util.Objects;
import java.util.UUID;

public final class DocumentCommentKey {

  public final DocumentKey documentKey;
  public final UUID id;

  public DocumentCommentKey(DocumentKey documentKey, UUID id) {
    this.documentKey = Objects.requireNonNull(documentKey);
    this.id = Objects.requireNonNull(id);
  }

  public static DocumentCommentKey of(String documentSchemaName, UUID documentId, UUID id) {
    return new DocumentCommentKey(DocumentKey.of(documentSchemaName, documentId), id);
  }

  public static DocumentCommentKey of(DocumentKey documentKey, UUID id) {
    return new DocumentCommentKey(documentKey, id);
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    DocumentCommentKey that = (DocumentCommentKey) o;
    return Objects.equals(documentKey, that.documentKey) &&
        Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return Objects.hash(documentKey, id);
  }

  @Override
  public String toString() {
    return "(" + documentKey + ", " + id + ")";
  }

}

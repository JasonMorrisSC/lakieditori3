package fi.vero.lakied.service.document;

import java.util.Objects;
import java.util.UUID;

public final class DocumentCommentKey {

  public final String documentSchemaName;
  public final UUID documentId;
  public final UUID id;

  public DocumentCommentKey(
      String documentSchemaName,
      UUID documentId,
      UUID id) {
    this.documentSchemaName = documentSchemaName;
    this.documentId = documentId;
    this.id = id;
  }

  public static DocumentCommentKey of(
      String documentSchemaName,
      UUID documentId,
      UUID id) {
    return new DocumentCommentKey(documentSchemaName, documentId, id);
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
    return Objects.equals(documentSchemaName, that.documentSchemaName) &&
        Objects.equals(documentId, that.documentId) &&
        Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return Objects.hash(documentSchemaName, documentId, id);
  }

  @Override
  public String toString() {
    return "("
        + documentSchemaName + ", "
        + documentId + ", "
        + id + ")";
  }

}

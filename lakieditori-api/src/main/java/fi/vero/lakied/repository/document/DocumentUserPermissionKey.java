package fi.vero.lakied.repository.document;

import fi.vero.lakied.util.security.Permission;
import java.util.Objects;
import java.util.UUID;

public final class DocumentUserPermissionKey {

  public final DocumentKey documentKey;
  public final String username;
  public final Permission permission;

  public DocumentUserPermissionKey(
      DocumentKey documentKey,
      String username,
      Permission permission) {
    this.documentKey = Objects.requireNonNull(documentKey);
    this.username = Objects.requireNonNull(username);
    this.permission = Objects.requireNonNull(permission);
  }

  public static DocumentUserPermissionKey of(String documentSchemaName, UUID documentId,
      String username, Permission permission) {
    return new DocumentUserPermissionKey(
        DocumentKey.of(documentSchemaName, documentId),
        username,
        permission);
  }

  public static DocumentUserPermissionKey of(DocumentKey documentKey, String key,
      Permission permission) {
    return new DocumentUserPermissionKey(documentKey, key, permission);
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    DocumentUserPermissionKey that = (DocumentUserPermissionKey) o;
    return Objects.equals(documentKey, that.documentKey) &&
        Objects.equals(username, that.username) &&
        Objects.equals(permission, that.permission);
  }

  @Override
  public int hashCode() {
    return Objects.hash(documentKey, username, permission);
  }

  @Override
  public String toString() {
    return "(" + documentKey + ", " + username + ", " + permission + ")";
  }

}

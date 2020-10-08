package fi.vero.lakied.repository.document;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;

public class JdbcDocumentUserPermissionWriteRepository implements
    WriteRepository<DocumentUserPermissionKey, Empty> {

  private final JdbcTemplate jdbc;

  public JdbcDocumentUserPermissionWriteRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
  }

  @Override
  public void insert(DocumentUserPermissionKey key, Empty value, User user) {
    jdbc.update(
        "insert into document_user_permission ("
            + "document_schema_name, "
            + "document_id, "
            + "username, "
            + "permission) values (?, ?, ?, ?)",
        key.documentKey.schemaName, key.documentKey.id, key.username, key.permission.toString());
  }

  @Override
  public void update(DocumentUserPermissionKey key, Empty value, User user) {
    // Can't update an empty value
  }

  @Override
  public void delete(DocumentUserPermissionKey key, User user) {
    jdbc.update(
        "delete from document_user_permission where "
            + "document_schema_name = ? and "
            + "document_id = ? and "
            + "username = ? and "
            + "permission = ?",
        key.documentKey.schemaName, key.documentKey.id, key.username, key.permission.toString());
  }

}

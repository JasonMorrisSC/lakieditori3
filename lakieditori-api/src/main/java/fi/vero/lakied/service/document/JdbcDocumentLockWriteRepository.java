package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import java.time.LocalDateTime;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;

public class JdbcDocumentLockWriteRepository implements
    WriteRepository<DocumentKey, Empty> {

  private final JdbcTemplate jdbc;

  public JdbcDocumentLockWriteRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
  }

  @Override
  public void insert(DocumentKey key, Empty empty, User user) {
    jdbc.update(
        "insert into document_lock ("
            + "document_schema_name, "
            + "document_id, "
            + "username, "
            + "date) values (?, ?, ?, ?)",
        key.schemaName, key.id, user.getUsername(), LocalDateTime.now());
  }

  @Override
  public void update(DocumentKey key, Empty empty, User user) {
    jdbc.update(
        "update document_lock "
            + "set username = ?, "
            + "    date = ? "
            + "where document_schema_name = ? and document_id = ?",
        user.getUsername(), LocalDateTime.now(), key.schemaName, key.id);
  }

  @Override
  public void delete(DocumentKey key, User user) {
    jdbc.update("delete from document_lock where document_schema_name = ? and document_id = ?",
        key.schemaName, key.id);
  }

}

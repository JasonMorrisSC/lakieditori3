package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import java.util.UUID;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;

public class JdbcDocumentLockWriteRepository implements
    WriteRepository<UUID, Empty> {

  private final JdbcTemplate jdbc;

  public JdbcDocumentLockWriteRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
  }

  @Override
  public void insert(UUID id, Empty empty, User user) {
    jdbc.update("insert into document_lock (id) values (?)", id, empty);
  }

  @Override
  public void update(UUID id, Empty empty, User user) {
    throw new UnsupportedOperationException();
  }

  @Override
  public void delete(UUID id, User user) {
    jdbc.update("delete from document_lock where id = ?", id);
  }

}

package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.Tuple3;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.Permission;
import fi.vero.lakied.util.security.User;
import java.util.UUID;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;

public class JdbcDocumentUserPermissionWriteRepository implements
    WriteRepository<Tuple3<UUID, String, Permission>, Empty> {

  private final JdbcTemplate jdbc;

  public JdbcDocumentUserPermissionWriteRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
  }

  @Override
  public void insert(Tuple3<UUID, String, Permission> key, Empty value, User user) {
    jdbc.update(
        "insert into document_user_permission ("
            + "document_id, "
            + "username, "
            + "permission) values (?, ?, ?)",
        key._1, key._2, key._3.toString());
  }

  @Override
  public void update(Tuple3<UUID, String, Permission> key, Empty value, User user) {
    // Can't update an empty value
  }

  @Override
  public void delete(Tuple3<UUID, String, Permission> key, User user) {
    jdbc.update(
        "delete from document_user_permission where "
            + "document_id = ? and "
            + "username = ? and "
            + "permission = ?",
        key._1, key._2, key._3.toString());
  }

}

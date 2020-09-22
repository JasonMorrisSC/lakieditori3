package fi.vero.lakied.repository.user;

import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import java.util.UUID;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;

public class JdbcUserWriteRepository implements WriteRepository<UUID, User> {

  private final JdbcTemplate jdbc;

  public JdbcUserWriteRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
  }

  @Override
  public void insert(UUID id, User value, User user) {
    jdbc.update(
        "insert into users ("
            + "id, "
            + "username, "
            + "password, "
            + "first_name, "
            + "last_name, "
            + "superuser, "
            + "enabled) values (?, ?, ?, ?, ?, ?, ?)",
        id,
        value.getUsername(),
        value.getPassword(),
        value.getFirstName().orElse(null),
        value.getLastName().orElse(null),
        value.isSuperuser(),
        value.isEnabled());
  }

  @Override
  public void update(UUID id, User value, User user) {
    if (value.getPassword().isEmpty()) {
      jdbc.update(
          "update users "
              + "set username = ?, "
              + "    first_name = ?, "
              + "    last_name = ?, "
              + "    superuser = ?, "
              + "    enabled = ? "
              + "where id = ?",
          value.getUsername(),
          value.getFirstName().orElse(null),
          value.getLastName().orElse(null),
          value.isSuperuser(),
          value.isEnabled(),
          id);
    } else {
      jdbc.update(
          "update users "
              + "set username = ?, "
              + "    password = ?, "
              + "    first_name = ?, "
              + "    last_name = ?, "
              + "    superuser = ?, "
              + "    enabled = ? "
              + "where id = ?",
          value.getUsername(),
          value.getPassword(),
          value.getFirstName().orElse(null),
          value.getLastName().orElse(null),
          value.isSuperuser(),
          value.isEnabled(),
          id);
    }
  }

  @Override
  public void delete(UUID id, User user) {
    jdbc.update("delete from users where id = ?", id);
  }

}

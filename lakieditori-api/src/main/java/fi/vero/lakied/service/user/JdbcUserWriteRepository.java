package fi.vero.lakied.service.user;

import fi.vero.lakied.util.common.User;
import fi.vero.lakied.util.common.WriteRepository;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;

public class JdbcUserWriteRepository implements WriteRepository<String, User> {

  private final JdbcTemplate jdbc;

  public JdbcUserWriteRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
  }

  @Override
  public void insert(String key, User value, User user) {
    jdbc.update("insert into users (username, password, enabled) values (?, ?, ?)",
        key, value.getPassword(), value.isEnabled());
  }

  @Override
  public void update(String key, User value, User user) {
    jdbc.update("update users set password = ?, enabled = ? where username = ?",
        value.getPassword(), value.isEnabled(), key);
  }

  @Override
  public void delete(String key, User user) {
    jdbc.update("delete from users where username = ?", key);
  }

}

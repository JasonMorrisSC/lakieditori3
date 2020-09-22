package fi.vero.lakied.repository.user;

import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import java.util.UUID;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;

public class JdbcUserPropertiesWriteRepository implements
    WriteRepository<Tuple2<UUID, String>, String> {

  private final JdbcTemplate jdbc;

  public JdbcUserPropertiesWriteRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
  }

  @Override
  public void insert(Tuple2<UUID, String> id, String value, User user) {
    jdbc.update(
        "insert into user_properties ("
            + "user_id, "
            + "key, "
            + "value) values (?, ?, ?)",
        id._1,
        id._2,
        value);
  }

  @Override
  public void update(Tuple2<UUID, String> id, String value, User user) {
    jdbc.update(
        "update user_properties "
            + "set value = ?"
            + "where user_id = ? and key = ?",
        value,
        id._1, id._2);
  }

  @Override
  public void delete(Tuple2<UUID, String> id, User user) {
    jdbc.update("delete from user_properties where user_id = ? and key = ?", id._1, id._2);
  }

}

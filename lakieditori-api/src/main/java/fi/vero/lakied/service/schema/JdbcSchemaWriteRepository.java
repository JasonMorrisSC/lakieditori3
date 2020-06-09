package fi.vero.lakied.service.schema;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;

public class JdbcSchemaWriteRepository implements WriteRepository<String, Empty> {

  private final JdbcTemplate jdbc;

  public JdbcSchemaWriteRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
  }

  @Override
  public void insert(String name, Empty schema, User user) {
    jdbc.update("insert into schema (name) values (?)", name);
  }

  @Override
  public void update(String name, Empty schema, User user) {
    // NOP
  }

  @Override
  public void delete(String name, User user) {
    jdbc.update("delete from schema where name = ?", name);
  }

}

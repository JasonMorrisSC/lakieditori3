package fi.vero.lakied.service.user;

import fi.vero.lakied.util.common.SqlReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.SqlCriteria;
import fi.vero.lakied.util.jdbc.JdbcUtils;
import fi.vero.lakied.util.security.User;
import java.util.UUID;
import java.util.stream.Stream;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

public class JdbcUserReadRepository implements SqlReadRepository<UUID, User> {

  private final JdbcTemplate jdbc;
  private final RowMapper<Tuple2<UUID, User>> rowMapper;

  public JdbcUserReadRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
    this.rowMapper = (rs, rowNum) -> Tuple.of(
        UUID.fromString(rs.getString("id")),
        User.builder()
            .id(UUID.fromString(rs.getString("id")))
            .username(rs.getString("username"))
            .password(rs.getString("password"))
            .firstName(rs.getString("first_name"))
            .lastName(rs.getString("last_name"))
            .superuser(rs.getBoolean("superuser"))
            .enabled(rs.getBoolean("enabled"))
            .build());
  }

  @Override
  public Stream<Tuple2<UUID, User>> entries(SqlCriteria<UUID, User> criteria, User user) {
    return JdbcUtils.queryForStream(jdbc.getDataSource(),
        "select * from users where " + criteria.sql(), criteria.args(), rowMapper);
  }

}

package fi.vero.lakied.repository.user;

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

public class JdbcUserPropertiesReadRepository implements
    SqlReadRepository<Tuple2<UUID, String>, String> {

  private final JdbcTemplate jdbc;
  private final RowMapper<Tuple2<Tuple2<UUID, String>, String>> rowMapper;

  public JdbcUserPropertiesReadRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
    this.rowMapper = (rs, rowNum) -> Tuple.of(
        Tuple.of(UUID.fromString(rs.getString("user_id")), rs.getString("key")),
        rs.getString("value"));
  }

  @Override
  public Stream<Tuple2<Tuple2<UUID, String>, String>> entries(
      SqlCriteria<Tuple2<UUID, String>, String> criteria, User user) {
    return JdbcUtils.queryForStream(jdbc.getDataSource(),
        "select * from user_properties where " + criteria.sql(), criteria.args(), rowMapper);
  }

}

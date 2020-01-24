package fi.vero.lakied.service.user;

import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.User;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import fi.vero.lakied.util.jdbc.JdbcUtils;
import java.util.stream.Stream;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

public class JdbcUserReadRepository implements ReadRepository<String, User> {

  private final JdbcTemplate jdbc;
  private final RowMapper<Tuple2<String, User>> rowMapper;

  public JdbcUserReadRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
    this.rowMapper = (rs, rowNum) -> Tuple.of(
        rs.getString("username"),
        User.of(rs.getString("username"), rs.getString("password"), rs.getBoolean("enabled")));
  }

  @Override
  public Stream<Tuple2<String, User>> entries(Criteria<String, User> criteria, User user) {
    SqlCriteria<String, User> sqlCriteria = (SqlCriteria<String, User>) criteria;
    return JdbcUtils.queryForStream(jdbc.getDataSource(),
        "select * from users where " + sqlCriteria.sql(), sqlCriteria.args(), rowMapper);
  }

}

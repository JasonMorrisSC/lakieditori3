package fi.vero.lakied.service.schema;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.SqlReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.SqlCriteria;
import fi.vero.lakied.util.jdbc.JdbcUtils;
import fi.vero.lakied.util.security.User;
import java.util.stream.Stream;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

public class JdbcSchemaReadRepository implements SqlReadRepository<String, Empty> {

  private final JdbcTemplate jdbc;
  private final RowMapper<Tuple2<String, Empty>> rowMapper;

  public JdbcSchemaReadRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
    this.rowMapper = (rs, rowNum) -> Tuple.of(
        rs.getString("name"),
        Empty.INSTANCE);
  }


  @Override
  public Stream<Tuple2<String, Empty>> entries(SqlCriteria<String, Empty> criteria, User user) {
    return JdbcUtils.queryForStream(jdbc.getDataSource(),
        "select * from schema where " + criteria.sql(), criteria.args(), rowMapper);
  }

}

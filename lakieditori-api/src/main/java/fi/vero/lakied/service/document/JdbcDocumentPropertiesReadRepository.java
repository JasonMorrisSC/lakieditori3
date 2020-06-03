package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import fi.vero.lakied.util.jdbc.JdbcUtils;
import fi.vero.lakied.util.security.User;
import java.util.UUID;
import java.util.stream.Stream;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

public class JdbcDocumentPropertiesReadRepository implements
    ReadRepository<Tuple2<UUID, String>, String> {

  private final JdbcTemplate jdbc;
  private final RowMapper<Tuple2<Tuple2<UUID, String>, String>> rowMapper;

  public JdbcDocumentPropertiesReadRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
    this.rowMapper = (rs, rowNum) -> Tuple.of(
        Tuple.of(UUID.fromString(rs.getString("document_id")), rs.getString("key")),
        rs.getString("value"));
  }

  @Override
  public Stream<Tuple2<Tuple2<UUID, String>, String>> entries(
      Criteria<Tuple2<UUID, String>, String> criteria, User user) {
    SqlCriteria<Tuple2<UUID, String>, String> sqlCriteria = (SqlCriteria<Tuple2<UUID, String>, String>) criteria;
    return JdbcUtils.queryForStream(jdbc.getDataSource(),
        "select * from document_properties where " + sqlCriteria.sql(), sqlCriteria.args(),
        rowMapper);
  }

}

package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.SqlReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.SqlCriteria;
import fi.vero.lakied.util.jdbc.JdbcUtils;
import fi.vero.lakied.util.security.User;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Stream;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

public class JdbcDocumentLockReadRepository implements
    SqlReadRepository<DocumentKey, Tuple2<String, LocalDateTime>> {

  private final JdbcTemplate jdbc;
  private final RowMapper<Tuple2<DocumentKey, Tuple2<String, LocalDateTime>>> rowMapper;

  public JdbcDocumentLockReadRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
    this.rowMapper = (rs, rowNum) -> Tuple.of(
        DocumentKey.of(
            rs.getString("document_schema_name"),
            UUID.fromString(rs.getString("document_id"))),
        Tuple.of(
            rs.getString("username"),
            rs.getTimestamp("date").toLocalDateTime()));
  }

  @Override
  public Stream<Tuple2<DocumentKey, Tuple2<String, LocalDateTime>>> entries(
      SqlCriteria<DocumentKey, Tuple2<String, LocalDateTime>> criteria, User user) {
    return JdbcUtils.queryForStream(jdbc.getDataSource(),
        "select * from document_lock where " + criteria.sql(), criteria.args(), rowMapper);
  }

}

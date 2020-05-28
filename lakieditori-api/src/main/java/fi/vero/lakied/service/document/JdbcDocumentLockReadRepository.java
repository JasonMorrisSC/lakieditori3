package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.Criteria;
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
    ReadRepository<UUID, Tuple2<String, LocalDateTime>> {

  private final JdbcTemplate jdbc;
  private final RowMapper<Tuple2<UUID, Tuple2<String, LocalDateTime>>> rowMapper;

  public JdbcDocumentLockReadRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
    this.rowMapper = (rs, rowNum) -> Tuple.of(
        UUID.fromString(rs.getString("document_id")),
        Tuple.of(
            rs.getString("username"),
            rs.getTimestamp("date").toLocalDateTime()));
  }

  @Override
  public Stream<Tuple2<UUID, Tuple2<String, LocalDateTime>>> entries(
      Criteria<UUID, Tuple2<String, LocalDateTime>> criteria, User user) {
    SqlCriteria<UUID, Tuple2<String, LocalDateTime>> sqlCriteria =
        (SqlCriteria<UUID, Tuple2<String, LocalDateTime>>) criteria;
    return JdbcUtils.queryForStream(jdbc.getDataSource(),
        "select * from document_lock where " + sqlCriteria.sql(), sqlCriteria.args(), rowMapper);
  }

}

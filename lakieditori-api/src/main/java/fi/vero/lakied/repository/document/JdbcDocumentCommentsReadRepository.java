package fi.vero.lakied.repository.document;

import fi.vero.lakied.util.common.Audited;
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

public class JdbcDocumentCommentsReadRepository implements
    SqlReadRepository<DocumentCommentKey, Audited<Tuple2<String, String>>> {

  private final JdbcTemplate jdbc;
  private final RowMapper<Tuple2<DocumentCommentKey, Audited<Tuple2<String, String>>>> rowMapper;

  public JdbcDocumentCommentsReadRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
    this.rowMapper = (rs, rowNum) -> Tuple.of(
        DocumentCommentKey.of(
            DocumentKey.of(
                rs.getString("document_schema_name"),
                UUID.fromString(rs.getString("document_id"))),
            UUID.fromString(rs.getString("id"))),
        new Audited<>(
            rs.getString("created_by"),
            rs.getTimestamp("created_date").toLocalDateTime(),
            rs.getString("last_modified_by"),
            rs.getTimestamp("last_modified_date").toLocalDateTime(),
            Tuple.of(
                rs.getString("path"),
                rs.getString("comment"))));
  }


  @Override
  public Stream<Tuple2<DocumentCommentKey, Audited<Tuple2<String, String>>>> entries(
      SqlCriteria<DocumentCommentKey, Audited<Tuple2<String, String>>> criteria, User user) {
    return JdbcUtils.queryForStream(jdbc.getDataSource(),
        "select * from document_comments where " + criteria.sql(), criteria.args(), rowMapper);
  }

}

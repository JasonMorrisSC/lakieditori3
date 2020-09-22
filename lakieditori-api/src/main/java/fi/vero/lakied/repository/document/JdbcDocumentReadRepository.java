package fi.vero.lakied.repository.document;

import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.SqlReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.SqlCriteria;
import fi.vero.lakied.util.jdbc.JdbcUtils;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.XmlUtils;
import java.util.UUID;
import java.util.stream.Stream;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.w3c.dom.Document;

public class JdbcDocumentReadRepository implements
    SqlReadRepository<DocumentKey, Audited<Document>> {

  private final JdbcTemplate jdbc;
  private final RowMapper<Tuple2<DocumentKey, Audited<Document>>> rowMapper;

  public JdbcDocumentReadRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
    this.rowMapper = (rs, rowNum) -> Tuple.of(
        DocumentKey.of(
            rs.getString("schema_name"),
            UUID.fromString(rs.getString("id"))),
        new Audited<Document>(
            rs.getString("created_by"),
            rs.getTimestamp("created_date").toLocalDateTime(),
            rs.getString("last_modified_by"),
            rs.getTimestamp("last_modified_date").toLocalDateTime(),
            XmlUtils.parseUnchecked(rs.getString("document"))));
  }

  @Override
  public Stream<Tuple2<DocumentKey, Audited<Document>>> entries(
      SqlCriteria<DocumentKey, Audited<Document>> criteria, User user) {
    return JdbcUtils.queryForStream(jdbc.getDataSource(),
        "select * from document where " + criteria.sql(), criteria.args(), rowMapper);
  }

}

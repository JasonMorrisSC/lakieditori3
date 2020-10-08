package fi.vero.lakied.repository.document;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.SqlReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.SqlCriteria;
import fi.vero.lakied.util.jdbc.JdbcUtils;
import fi.vero.lakied.util.security.Permission;
import fi.vero.lakied.util.security.User;
import java.util.UUID;
import java.util.stream.Stream;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

public class JdbcDocumentUserPermissionReadRepository implements
    SqlReadRepository<DocumentUserPermissionKey, Empty> {

  private final JdbcTemplate jdbc;
  private final RowMapper<Tuple2<DocumentUserPermissionKey, Empty>> rowMapper;

  public JdbcDocumentUserPermissionReadRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
    this.rowMapper = (rs, rowNum) -> Tuple.of(
        DocumentUserPermissionKey.of(
            rs.getString("document_schema_name"),
            UUID.fromString(rs.getString("document_id")),
            rs.getString("username"),
            Permission.valueOf(rs.getString("permission"))),
        Empty.INSTANCE);
  }

  @Override
  public Stream<Tuple2<DocumentUserPermissionKey, Empty>> entries(
      SqlCriteria<DocumentUserPermissionKey, Empty> criteria, User user) {
    return JdbcUtils.queryForStream(jdbc.getDataSource(),
        "select * from document_user_permission where " + criteria.sql()
            + " order by permission", criteria.args(),
        rowMapper);
  }

}

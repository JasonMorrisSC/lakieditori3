package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.Tuple3;
import fi.vero.lakied.util.criteria.Criteria;
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
    ReadRepository<Tuple3<UUID, String, Permission>, Empty> {

  private final JdbcTemplate jdbc;
  private final RowMapper<Tuple2<Tuple3<UUID, String, Permission>, Empty>> rowMapper;

  public JdbcDocumentUserPermissionReadRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
    this.rowMapper = (rs, rowNum) -> Tuple.of(
        Tuple.of(
            UUID.fromString(rs.getString("document_id")),
            rs.getString("username"),
            Permission.valueOf(rs.getString("permission"))),
        Empty.INSTANCE);
  }

  @Override
  public Stream<Tuple2<Tuple3<UUID, String, Permission>, Empty>> entries(
      Criteria<Tuple3<UUID, String, Permission>, Empty> criteria, User user) {
    SqlCriteria<Tuple3<UUID, String, Permission>, Empty> sqlCriteria =
        (SqlCriteria<Tuple3<UUID, String, Permission>, Empty>) criteria;
    return JdbcUtils.queryForStream(jdbc.getDataSource(),
        "select * from document_user_permission where " + sqlCriteria.sql()
            + " order by permission", sqlCriteria.args(),
        rowMapper);
  }

}

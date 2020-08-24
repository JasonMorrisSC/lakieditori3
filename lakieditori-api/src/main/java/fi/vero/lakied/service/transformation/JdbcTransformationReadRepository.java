package fi.vero.lakied.service.transformation;

import fi.vero.lakied.util.common.SqlReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.SqlCriteria;
import fi.vero.lakied.util.jdbc.JdbcUtils;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.XmlUtils;
import java.util.stream.Stream;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.w3c.dom.Document;

public class JdbcTransformationReadRepository implements SqlReadRepository<String, Document> {

  private final JdbcTemplate jdbc;
  private final RowMapper<Tuple2<String, Document>> rowMapper;

  public JdbcTransformationReadRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
    this.rowMapper = (rs, rowNum) -> Tuple.of(
        rs.getString("name"),
        XmlUtils.parseUnchecked(rs.getString("definition")));
  }


  @Override
  public Stream<Tuple2<String, Document>> entries(SqlCriteria<String, Document> criteria,
      User user) {
    return JdbcUtils.queryForStream(jdbc.getDataSource(),
        "select * from transformation where " + criteria.sql(), criteria.args(), rowMapper);
  }

}

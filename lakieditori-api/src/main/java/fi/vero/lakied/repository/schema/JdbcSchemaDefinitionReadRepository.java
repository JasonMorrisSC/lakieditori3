package fi.vero.lakied.repository.schema;

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

public class JdbcSchemaDefinitionReadRepository implements
    SqlReadRepository<Tuple2<String, Integer>, Tuple2<String, Document>> {

  private final JdbcTemplate jdbc;
  private final RowMapper<Tuple2<Tuple2<String, Integer>, Tuple2<String, Document>>> rowMapper;

  public JdbcSchemaDefinitionReadRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
    this.rowMapper = (rs, rowNum) -> Tuple.of(
        Tuple.of(
            rs.getString("schema_name"),
            rs.getInt("index")),
        Tuple.of(
            rs.getString("name"),
            XmlUtils.parseUnchecked(rs.getString("definition")))
    );
  }


  @Override
  public Stream<Tuple2<Tuple2<String, Integer>, Tuple2<String, Document>>> entries(
      SqlCriteria<Tuple2<String, Integer>, Tuple2<String, Document>> criteria, User user) {
    return JdbcUtils.queryForStream(jdbc.getDataSource(),
        "select * from schema_definition where " + criteria.sql() + " order by index",
        criteria.args(), rowMapper);
  }

}

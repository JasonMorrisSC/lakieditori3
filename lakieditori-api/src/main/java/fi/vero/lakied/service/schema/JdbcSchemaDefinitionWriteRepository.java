package fi.vero.lakied.service.schema;

import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.XmlUtils;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.w3c.dom.Document;

public class JdbcSchemaDefinitionWriteRepository implements
    WriteRepository<Tuple2<String, Integer>, Tuple2<String, Document>> {

  private final JdbcTemplate jdbc;

  public JdbcSchemaDefinitionWriteRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
  }

  @Override
  public void insert(Tuple2<String, Integer> key, Tuple2<String, Document> value, User user) {
    jdbc.update(
        "insert into schema_definition (schema_name, index, name, definition) values (?, ?, ?, ?)",
        key._1, key._2, value._1, XmlUtils.print(value._2));
  }

  @Override
  public void update(Tuple2<String, Integer> key, Tuple2<String, Document> value, User user) {
    jdbc.update(
        "update schema_definition set name = ?, definition = ? where schema_name = ? and index = ?",
        value._1, XmlUtils.print(value._2), key._1, key._2);
  }

  @Override
  public void delete(Tuple2<String, Integer> key, User user) {
    jdbc.update(
        "delete from schema_definition where schema_name = ? and index = ?",
        key._1, key._2);
  }

}

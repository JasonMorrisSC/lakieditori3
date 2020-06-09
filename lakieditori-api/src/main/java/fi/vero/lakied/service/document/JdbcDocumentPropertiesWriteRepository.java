package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.Tuple3;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import java.util.UUID;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;

public class JdbcDocumentPropertiesWriteRepository implements
    WriteRepository<Tuple3<String, UUID, String>, String> {

  private final JdbcTemplate jdbc;

  public JdbcDocumentPropertiesWriteRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
  }

  @Override
  public void insert(Tuple3<String, UUID, String> id, String value, User user) {
    jdbc.update(
        "insert into document_properties ("
            + "document_schema_name, "
            + "document_id, "
            + "key, "
            + "value) values (?, ?, ?, ?)",
        id._1,
        id._2,
        id._3,
        value);
  }

  @Override
  public void update(Tuple3<String, UUID, String> id, String value, User user) {
    jdbc.update(
        "update document_properties "
            + "set value = ?"
            + "where document_schema_name = ? and document_id = ? and key = ?",
        value,
        id._1, id._2, id._3);
  }

  @Override
  public void delete(Tuple3<String, UUID, String> id, User user) {
    jdbc.update(
        "delete from document_properties where document_schema_name = ? and document_id = ? and key = ?",
        id._1, id._2, id._3);
  }

}

package fi.vero.lakied.repository.document;

import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;

public class JdbcDocumentPropertiesWriteRepository implements
    WriteRepository<DocumentPropertyKey, String> {

  private final JdbcTemplate jdbc;

  public JdbcDocumentPropertiesWriteRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
  }

  @Override
  public void insert(DocumentPropertyKey propertyKey, String value, User user) {
    jdbc.update(
        "insert into document_properties ("
            + "document_schema_name, "
            + "document_id, "
            + "key, "
            + "value) values (?, ?, ?, ?)",
        propertyKey.documentKey.schemaName,
        propertyKey.documentKey.id,
        propertyKey.key,
        value);
  }

  @Override
  public void update(DocumentPropertyKey propertyKey, String value, User user) {
    jdbc.update(
        "update document_properties "
            + "set value = ?"
            + "where document_schema_name = ? and document_id = ? and key = ?",
        value,
        propertyKey.documentKey.schemaName,
        propertyKey.documentKey.id,
        propertyKey.key);
  }

  @Override
  public void delete(DocumentPropertyKey propertyKey, User user) {
    jdbc.update(
        "delete from document_properties where document_schema_name = ? and document_id = ? and key = ?",
        propertyKey.documentKey.schemaName,
        propertyKey.documentKey.id,
        propertyKey.key);
  }

}

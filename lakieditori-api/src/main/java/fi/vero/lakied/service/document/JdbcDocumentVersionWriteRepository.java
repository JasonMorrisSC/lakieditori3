package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.XmlUtils;
import java.time.LocalDateTime;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.w3c.dom.Document;

public class JdbcDocumentVersionWriteRepository implements
    WriteRepository<DocumentKey, Document> {

  private final JdbcTemplate jdbc;

  public JdbcDocumentVersionWriteRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
  }

  @Override
  public void insert(DocumentKey key, Document document, User user) {
    LocalDateTime now = LocalDateTime.now();
    jdbc.update(
        "insert into document_version ("
            + "schema_name, "
            + "id, "
            + "created_by, "
            + "created_date, "
            + "last_modified_by, "
            + "last_modified_date, "
            + "document) values (?, ?, ?, ?, ?, ?, ?)",
        key.schemaName,
        key.id,
        user.getUsername(),
        now,
        user.getUsername(),
        now,
        document != null ? XmlUtils.print(document) : null);
  }

  @Override
  public void update(DocumentKey key, Document document, User user) {
    throw new UnsupportedOperationException();
  }

  @Override
  public void delete(DocumentKey key, User user) {
    throw new UnsupportedOperationException();
  }

}

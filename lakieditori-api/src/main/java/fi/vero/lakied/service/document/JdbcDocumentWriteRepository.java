package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.XmlUtils;
import java.time.LocalDateTime;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.w3c.dom.Document;

public class JdbcDocumentWriteRepository implements
    WriteRepository<DocumentKey, Document> {

  private final JdbcTemplate jdbc;

  public JdbcDocumentWriteRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
  }

  @Override
  public void insert(DocumentKey id, Document document, User user) {
    LocalDateTime now = LocalDateTime.now();
    jdbc.update(
        "insert into document ("
            + "schema_name, "
            + "id, "
            + "created_by, "
            + "created_date, "
            + "last_modified_by, "
            + "last_modified_date, "
            + "document) values (?, ?, ?, ?, ?, ?, ?)",
        id.schemaName,
        id.id,
        user.getUsername(),
        now,
        user.getUsername(),
        now,
        XmlUtils.print(document));
  }

  @Override
  public void update(DocumentKey id, Document document, User user) {
    jdbc.update(
        "update document "
            + "set document = ?,"
            + "    last_modified_by = ?,"
            + "    last_modified_date = ? "
            + "where schema_name = ? and id = ?",
        XmlUtils.print(document),
        user.getUsername(),
        LocalDateTime.now(),
        id.schemaName,
        id.id);
  }

  @Override
  public void delete(DocumentKey key, User user) {
    jdbc.update("delete from document where schema_name = ? and id = ?",
        key.schemaName, key.id);
  }

}

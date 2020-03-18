package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.XmlUtils;
import java.time.LocalDateTime;
import java.util.UUID;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.w3c.dom.Document;

public class JdbcDocumentWriteRepository implements
    WriteRepository<UUID, Document> {

  private final JdbcTemplate jdbc;

  public JdbcDocumentWriteRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
  }

  @Override
  public void insert(UUID id, Document document, User user) {
    LocalDateTime now = LocalDateTime.now();
    jdbc.update(
        "insert into document ("
            + "id, "
            + "created_by, "
            + "created_date, "
            + "last_modified_by, "
            + "last_modified_date, "
            + "document) values (?, ?, ?, ?, ?, ?)",
        id,
        user.getUsername(),
        now,
        user.getUsername(),
        now,
        XmlUtils.print(document));
  }

  @Override
  public void update(UUID id, Document document, User user) {
    jdbc.update(
        "update document "
            + "set document = ?,"
            + "    last_modified_by = ?,"
            + "    last_modified_date = ? "
            + "where id = ?",
        XmlUtils.print(document),
        user.getUsername(),
        LocalDateTime.now(),
        id);
  }

  @Override
  public void delete(UUID id, User user) {
    jdbc.update("delete from document where id = ?", id);
  }

}

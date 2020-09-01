package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import java.time.LocalDateTime;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;

public class JdbcDocumentCommentsWriteRepository implements
    WriteRepository<DocumentCommentKey, Tuple2<String, String>> {

  private final JdbcTemplate jdbc;

  public JdbcDocumentCommentsWriteRepository(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
  }

  @Override
  public void insert(DocumentCommentKey key, Tuple2<String, String> pathAndComment, User user) {
    LocalDateTime now = LocalDateTime.now();

    jdbc.update(
        "insert into document_comments ("
            + "document_schema_name, "
            + "document_id, "
            + "id ,"
            + "created_by, "
            + "created_date, "
            + "last_modified_by, "
            + "last_modified_date, "
            + "path, "
            + "comment) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        key.documentSchemaName,
        key.documentId,
        key.id,
        user.getUsername(),
        now,
        user.getUsername(),
        now,
        pathAndComment._1,
        pathAndComment._2);
  }

  @Override
  public void update(DocumentCommentKey key, Tuple2<String, String> pathAndComment, User user) {
    jdbc.update(
        "update document_comments "
            + "set path = ?, "
            + "    comment = ?,"
            + "    last_modified_by = ?,"
            + "    last_modified_date = ? "
            + "where document_schema_name = ? "
            + "  and document_id = ? "
            + "  and id = ?",
        pathAndComment._1,
        pathAndComment._2,
        user.getUsername(),
        LocalDateTime.now(),
        key.documentSchemaName,
        key.documentId,
        key.id);
  }

  @Override
  public void delete(DocumentCommentKey key, User user) {
    jdbc.update(
        "delete from document_comments "
            + "where document_schema_name = ? "
            + "  and document_id = ? "
            + "  and id = ?",
        key.documentSchemaName,
        key.documentId,
        key.id);
  }

}

package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import java.time.LocalDateTime;
import java.util.UUID;

public final class DocumentLockCriteria {

  private DocumentLockCriteria() {
  }

  public static SqlCriteria<UUID, Tuple2<String, LocalDateTime>> byDocumentId(UUID id) {
    return Criteria.sql((k, v) -> id.equals(k), "document_id = ?", id);
  }

  public static SqlCriteria<UUID, Tuple2<String, LocalDateTime>> byUsername(String username) {
    return Criteria.sql((k, v) -> v._1.equals(username), "username = ?", username);
  }

}

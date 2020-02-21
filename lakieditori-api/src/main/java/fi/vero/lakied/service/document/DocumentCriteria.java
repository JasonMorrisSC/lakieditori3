package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import java.util.UUID;
import org.w3c.dom.Document;

public final class DocumentCriteria {

  private DocumentCriteria() {
  }

  public static SqlCriteria<UUID, Audited<Document>> byId(UUID id) {
    return Criteria.sql((k, v) -> id.equals(k), "id = ?", id);
  }

}

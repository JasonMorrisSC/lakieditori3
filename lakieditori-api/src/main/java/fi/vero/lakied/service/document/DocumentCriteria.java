package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import org.w3c.dom.Document;

public final class DocumentCriteria {

  private DocumentCriteria() {
  }

  public static SqlCriteria<String, Audited<Document>> byId(String id) {
    return Criteria.sql((k, v) -> id.equals(k), "id = ?", id);
  }

}

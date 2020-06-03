package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import java.util.UUID;

public final class DocumentPropertiesCriteria {

  private DocumentPropertiesCriteria() {
  }

  public static SqlCriteria<Tuple2<UUID, String>, String> byDocumentId(UUID id) {
    return Criteria.sql((k, v) -> id.equals(k._1), "document_id = ?", id);
  }

  public static SqlCriteria<Tuple2<UUID, String>, String> byKey(String id) {
    return Criteria.sql((k, v) -> id.equals(k._2), "key = ?", id);
  }

}

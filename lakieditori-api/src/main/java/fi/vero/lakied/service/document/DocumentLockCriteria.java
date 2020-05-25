package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import java.util.UUID;

public final class DocumentLockCriteria {

  private DocumentLockCriteria() {
  }

  public static SqlCriteria<UUID, Empty> byId(UUID id) {
    return Criteria.sql((k, v) -> id.equals(k), "id = ?", id);
  }

}

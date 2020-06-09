package fi.vero.lakied.service.schema;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;

public final class SchemaCriteria {

  private SchemaCriteria() {
  }

  public static SqlCriteria<String, Empty> byName(String name) {
    return Criteria.sql((k, v) -> name.equals(k), "name = ?", name);
  }

}

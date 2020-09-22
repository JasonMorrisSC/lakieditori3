package fi.vero.lakied.repository.transformation;

import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import org.w3c.dom.Document;

public final class TransformationCriteria {

  private TransformationCriteria() {
  }

  public static SqlCriteria<String, Document> byName(String name) {
    return Criteria.sql((k, v) -> k.equals(name), "name = ?", name);
  }

}

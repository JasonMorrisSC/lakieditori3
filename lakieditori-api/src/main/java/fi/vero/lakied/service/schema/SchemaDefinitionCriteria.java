package fi.vero.lakied.service.schema;

import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import org.w3c.dom.Document;

public final class SchemaDefinitionCriteria {

  private SchemaDefinitionCriteria() {
  }

  public static SqlCriteria<Tuple2<String, Integer>, Tuple2<String, Document>> byKey(
      Tuple2<String, Integer> key) {
    return byKey(key._1, key._2);
  }

  public static SqlCriteria<Tuple2<String, Integer>, Tuple2<String, Document>> byKey(
      String schemaName,
      Integer index) {
    return Criteria.and(bySchemaName(schemaName), byIndex(index));
  }

  public static SqlCriteria<Tuple2<String, Integer>, Tuple2<String, Document>> bySchemaName(
      String schemaName) {
    return Criteria.sql((k, v) -> schemaName.equals(k._1), "schema_name = ?", schemaName);
  }

  public static SqlCriteria<Tuple2<String, Integer>, Tuple2<String, Document>> byName(
      String name) {
    return Criteria.sql((k, v) -> name.equals(v._1), "name = ?", name);
  }

  public static SqlCriteria<Tuple2<String, Integer>, Tuple2<String, Document>> byIndex(
      Integer index) {
    return Criteria.sql((k, v) -> index.equals(k._2), "index = ?", index);
  }

}

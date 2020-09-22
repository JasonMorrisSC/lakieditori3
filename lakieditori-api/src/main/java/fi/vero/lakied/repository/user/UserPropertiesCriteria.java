package fi.vero.lakied.repository.user;

import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import java.util.UUID;

public final class UserPropertiesCriteria {

  private UserPropertiesCriteria() {
  }

  public static SqlCriteria<Tuple2<UUID, String>, String> byUserId(UUID userId) {
    return Criteria.sql((k, v) -> k._1.equals(userId), "user_id = ?", userId);
  }

}

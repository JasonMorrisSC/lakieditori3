package fi.vero.lakied.service.user;

import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.SqlCriteria;
import fi.vero.lakied.util.security.User;
import java.util.Objects;
import java.util.UUID;

public final class UserCriteria {

  private UserCriteria() {
  }

  public static SqlCriteria<UUID, User> byId(UUID id) {
    return Criteria.sql((k, v) -> id.equals(k), "id = ?", id);
  }

  public static SqlCriteria<UUID, User> byUsername(String username) {
    Objects.requireNonNull(username);
    return Criteria.sql((k, v) -> username.equals(v.getUsername()), "username = ?", username);
  }

  public static SqlCriteria<UUID, User> isEnabled() {
    return Criteria.sql((k, v) -> v.isEnabled(), "enabled = ?", true);
  }

}

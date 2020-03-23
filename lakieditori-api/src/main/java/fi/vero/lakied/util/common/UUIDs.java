package fi.vero.lakied.util.common;

import java.util.UUID;

public final class UUIDs {

  private UUIDs() {
  }

  public static UUID nilUuid() {
    return new UUID(0, 0);
  }

}

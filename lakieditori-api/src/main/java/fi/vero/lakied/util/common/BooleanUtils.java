package fi.vero.lakied.util.common;

public final class BooleanUtils {

  private BooleanUtils() {
  }

  /**
   * Returns {@code false} if the string argument equals ignore case "false", otherwise returns
   * {@code true}. Returns {@code true} e.g. on {@code null} value or on "foo".
   */
  public static boolean parseWithDefaultTrue(String s) {
    return s == null || !s.equalsIgnoreCase("false");
  }

}

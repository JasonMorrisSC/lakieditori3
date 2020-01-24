package fi.vero.lakied.util.common;

import java.util.function.Supplier;

public final class ObjectUtils {

  private ObjectUtils() {
  }

  public static void requireNonNull(Supplier<RuntimeException> exceptionSupplier,
      Object first, Object... rest) {

    if (first == null || rest == null) {
      throw exceptionSupplier.get();
    }

    for (Object o : rest) {
      if (o == null) {
        throw exceptionSupplier.get();
      }
    }
  }

}

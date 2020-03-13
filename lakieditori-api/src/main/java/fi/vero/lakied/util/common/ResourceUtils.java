package fi.vero.lakied.util.common;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.function.BiConsumer;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@SuppressWarnings("UnstableApiUsage")
public final class ResourceUtils {

  private ResourceUtils() {
  }

  public static String resourceToString(String resourceName) {
    try {
      return Resources.toString(Resources.getResource(resourceName), Charsets.UTF_8);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  public static void forAllResourcesAsString(String directoryName, Predicate<Path> filter,
      BiConsumer<Path, String> consumer) {
    try (Stream<Path> paths = Files.walk(Paths.get(Resources.getResource(directoryName).toURI()))) {
      paths
          .filter(Files::isRegularFile)
          .filter(filter)
          .forEach(path -> {
            try {
              consumer.accept(
                  path,
                  Files.lines(path).collect(Collectors.joining("\n")));
            } catch (IOException e) {
              throw new RuntimeException(e);
            }
          });
    } catch (IOException | URISyntaxException e) {
      throw new RuntimeException(e);
    }
  }

}

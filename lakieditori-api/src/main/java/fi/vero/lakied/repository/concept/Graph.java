package fi.vero.lakied.repository.concept;

import com.google.common.collect.ImmutableMap;
import java.util.Map;

public class Graph {

  public final String uri;
  public final ImmutableMap<String, String> label;

  public Graph(
      String uri,
      Map<String, String> label) {
    this.uri = uri;
    this.label = ImmutableMap.copyOf(label);
  }

}

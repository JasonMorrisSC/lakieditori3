package fi.vero.lakied.repository.concept;

import com.google.common.collect.ImmutableMap;
import java.util.Map;

public class Resource {

  public final String uri;
  public final Type type;
  public final Graph graph;
  public final ImmutableMap<String, String> label;

  public Resource(
      String uri,
      Type type,
      Graph graph,
      Map<String, String> label) {
    this.uri = uri;
    this.type = type;
    this.graph = graph;
    this.label = ImmutableMap.copyOf(label);
  }

}

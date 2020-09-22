package fi.vero.lakied.repository.concept;

import com.google.common.collect.ImmutableMultimap;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.StringMultimapCriteria;
import java.util.List;
import org.w3c.dom.Document;

public final class ConceptCriteria {

  private ConceptCriteria() {
  }

  public static Criteria<String, Document> byUri(String uri) {
    return new StringMultimapCriteria<>(
        ImmutableMultimap.of("uri", uri, "pageSize", "10"));
  }

  public static Criteria<String, Document> byQuery(String query, List<String> terminologyUris) {
    return new StringMultimapCriteria<>(ImmutableMultimap.<String, String>builder()
        .put("searchTerm", query)
        .putAll("container", terminologyUris)
        .put("pageSize", "50")
        .build());
  }

}
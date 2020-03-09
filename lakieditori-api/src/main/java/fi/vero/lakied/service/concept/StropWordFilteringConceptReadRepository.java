package fi.vero.lakied.service.concept;

import com.google.common.collect.ImmutableSet;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.User;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.JsonCriteria;
import java.util.stream.Stream;
import org.w3c.dom.Document;

/**
 * Returns empty stream for queries made with stop words.
 */
public class StropWordFilteringConceptReadRepository implements ReadRepository<String, Document> {

  private final ReadRepository<String, Document> delegate;
  private final ImmutableSet<String> stopWords;

  public StropWordFilteringConceptReadRepository(ReadRepository<String, Document> delegate) {
    // few default words
    this(delegate, "ja", "tai", "kui", "luku", "noja", "voi", "jolla", "luki");
  }

  public StropWordFilteringConceptReadRepository(ReadRepository<String, Document> delegate,
      String... stopWords) {
    this.delegate = delegate;
    this.stopWords = ImmutableSet.copyOf(stopWords);
  }

  @Override
  public Stream<Tuple2<String, Document>> entries(Criteria<String, Document> criteria, User user) {
    if (!(criteria instanceof JsonCriteria)) {
      throw new IllegalArgumentException(
          "This repository supports only " + JsonCriteria.class.getCanonicalName() + " criteria.");
    }

    JsonCriteria<String, Document> jsonCriteria = (JsonCriteria<String, Document>) criteria;

    if (jsonCriteria.criteria().has("query") &&
        jsonCriteria.criteria().get("query").isJsonPrimitive() &&
        !stopWords.contains(jsonCriteria.criteria().get("query").getAsString())) {
      return delegate.entries(criteria, user);
    }

    return Stream.empty();
  }

}

package fi.vero.lakied.repository.concept;

import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Multimap;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.StringMultimapCriteria;
import fi.vero.lakied.util.security.User;
import java.util.Collection;
import java.util.Collections;
import java.util.stream.Stream;
import org.w3c.dom.Document;

/**
 * Returns an empty stream for queries containing stop words.
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
    if (criteria instanceof StringMultimapCriteria) {
      Multimap<String, String> args =
          ((StringMultimapCriteria<String, Document>) criteria).getMultimap();

      Collection<String> searchTerms = args.get("searchTerm");

      if (!searchTerms.isEmpty()) {
        if (Collections.disjoint(searchTerms, stopWords)) {
          return delegate.entries(criteria, user);
        } else {
          return Stream.empty();
        }
      }
    }

    return delegate.entries(criteria, user);
  }

}

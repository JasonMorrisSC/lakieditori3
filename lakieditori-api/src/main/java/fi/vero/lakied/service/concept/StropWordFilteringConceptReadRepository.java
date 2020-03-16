package fi.vero.lakied.service.concept;

import com.google.common.collect.ImmutableSet;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.User;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.StringFieldValueCriteria;
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
    if (criteria instanceof StringFieldValueCriteria) {
      StringFieldValueCriteria<String, Document> stringFieldValueCriteria =
          (StringFieldValueCriteria<String, Document>) criteria;

      String field = stringFieldValueCriteria.getFieldName();
      String value = stringFieldValueCriteria.getFieldValue();

      if (field.equals("query")) {
        if (!stopWords.contains(value)) {
          return delegate.entries(criteria, user);
        } else {
          return Stream.empty();
        }
      }
    }

    return delegate.entries(criteria, user);
  }

}

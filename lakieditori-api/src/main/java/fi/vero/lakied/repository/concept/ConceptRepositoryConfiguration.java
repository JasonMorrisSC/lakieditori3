package fi.vero.lakied.repository.concept;

import static org.springframework.http.HttpHeaders.ACCEPT;

import com.google.common.collect.ImmutableMap;
import fi.vero.lakied.util.common.CachingReadRepository;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.http.HttpJsonReadRepository;
import fi.vero.lakied.util.security.User;
import java.util.function.Consumer;
import java.util.function.Supplier;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.w3c.dom.Document;

@Configuration
public class ConceptRepositoryConfiguration {

  @Value("${fi.vero.lakieditori.terminologyApiUrl:}")
  private String terminologyApiUrl;

  @Value("${fi.vero.lakieditori.datamodelApiUrl:}")
  private String datamodelApiUrl;

  @Bean
  public ReadRepository<String, Document> conceptReadRepository() {
    Supplier<Stream<Tuple2<String, Document>>> terminologiesSupplier =
        () -> terminologyReadRepository()
            .entries(Criteria.matchAll(), User.superuser("terminologies-loader"));

    return
        new CachingReadRepository<>(
            new StropWordFilteringConceptReadRepository(
                new HttpJsonReadRepository<>(terminologyApiUrl + "integration/resources",
                    new ConceptsJsonToXmlStream(terminologiesSupplier))));
  }

  @Bean
  public ReadRepository<String, Document> conceptUsageReadRepository() {
    return
        new CachingReadRepository<>(
            new HttpJsonReadRepository<>(
                datamodelApiUrl + "usage",
                new DataVocabsJsonldToXmlStream(),
                ImmutableMap.of(ACCEPT, "application/ld+json")));
  }

  @Bean
  public WriteRepository<Consumer<String>, Document> conceptWriteRepository() {
    return
        new SuomiFiRemoteConceptWriteRepository(terminologyApiUrl);
  }

  @Bean
  public ReadRepository<String, Document> terminologyReadRepository() {
    return
        new CachingReadRepository<>(
            new HttpJsonReadRepository<>(terminologyApiUrl + "integration/containers",
                new TerminologiesJsonToXmlStream()));
  }

}

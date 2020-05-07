package fi.vero.lakied.service.concept;

import fi.vero.lakied.util.common.CachingReadRepository;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.security.User;
import java.util.function.Consumer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.w3c.dom.Document;

@Configuration
public class ConceptRepositoryConfiguration {

  @Value("${fi.vero.lakieditori.terminologyIntegrationApiUrl:}")
  private String terminologyIntegrationApiUrl;

  @Bean
  public ReadRepository<String, Document> conceptReadRepository() {
    return
        new CachingReadRepository<>(
            new StropWordFilteringConceptReadRepository(
                new SuomiFiRemoteConceptReadRepository(
                    terminologyIntegrationApiUrl,
                    () -> terminologyReadRepository()
                        .entries(Criteria.matchAll(), User.superuser("terminologies-loader")))));
  }

  @Bean
  public WriteRepository<Consumer<String>, Document> conceptWriteRepository() {
    return
        new SuomiFiRemoteConceptWriteRepository(terminologyIntegrationApiUrl);
  }

  @Bean
  public ReadRepository<String, Document> terminologyReadRepository() {
    return
        new CachingReadRepository<>(
            new SuomiFiRemoteTerminologyReadRepository(terminologyIntegrationApiUrl));
  }

}

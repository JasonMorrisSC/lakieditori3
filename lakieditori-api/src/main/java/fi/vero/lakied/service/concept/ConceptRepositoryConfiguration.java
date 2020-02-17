package fi.vero.lakied.service.concept;

import fi.vero.lakied.util.common.ReadRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.w3c.dom.Document;

@Configuration
public class ConceptRepositoryConfiguration {

  @Bean
  public ReadRepository<String, Document> conceptReadRepository() {
    return new SuomiFiRemoteConceptReadRepository();
  }

}

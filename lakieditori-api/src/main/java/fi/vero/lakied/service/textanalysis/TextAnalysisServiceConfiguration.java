package fi.vero.lakied.service.textanalysis;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TextAnalysisServiceConfiguration {

  @Value("${fi.vero.lakieditori.textAnalysisService.url:}")
  private String remoteAnalysisServiceUrl;

  @Value("${fi.vero.lakieditori.textAnalysisService.username:}")
  private String remoteAnalysisServiceUsername;

  @Value("${fi.vero.lakieditori.textAnalysisService.password:}")
  private String remoteAnalysisServicePassword;

  @Bean
  public TextAnalysisService textAnalysisService() {
    return
        new CachingTextAnalysisService(
            new RemoteTextAnalysisService(
                remoteAnalysisServiceUrl,
                remoteAnalysisServiceUsername,
                remoteAnalysisServicePassword));
  }

}

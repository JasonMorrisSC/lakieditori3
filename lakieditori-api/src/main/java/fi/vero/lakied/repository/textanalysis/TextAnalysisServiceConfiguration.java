package fi.vero.lakied.repository.textanalysis;

import org.apache.logging.log4j.util.Strings;
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
    return Strings.isBlank(remoteAnalysisServiceUrl)
            ? new NopTextAnalysisService()
            : new CachingTextAnalysisService(
                    new RemoteTextAnalysisService(
                            remoteAnalysisServiceUrl,
                            remoteAnalysisServiceUsername,
                            remoteAnalysisServicePassword));
  }

}

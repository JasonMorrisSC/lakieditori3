package fi.vero.lakied.service.textanalysis;

import static com.google.common.base.Charsets.UTF_8;
import static org.springframework.http.HttpHeaders.ACCEPT;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import fi.vero.lakied.util.exception.InternalServerErrorException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Base64;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RemoteTextAnalysisService implements TextAnalysisService {

  @Value("${fi.vero.lakieditori.textAnalysisService.url:}")
  private String remoteAnalysisServiceUrl;

  @Value("${fi.vero.lakieditori.textAnalysisService.username:}")
  private String remoteAnalysisServiceUsername;

  @Value("${fi.vero.lakieditori.textAnalysisService.password:}")
  private String remoteAnalysisServicePassword;

  private final CloseableHttpClient httpClient = HttpClientBuilder.create().build();

  @Override
  public String lemma(String word, String lang) {
    if (remoteAnalysisServiceUrl.isEmpty()) {
      return "";
    }

    HttpGet request;

    try {
      URIBuilder builder = new URIBuilder(remoteAnalysisServiceUrl + "/lemma");

      builder.setParameter("word", word);
      builder.setParameter("lang", lang);

      request = new HttpGet(builder.build());
    } catch (URISyntaxException e) {
      throw new RuntimeException(e);
    }

    request.addHeader(ACCEPT, APPLICATION_JSON_VALUE);
    request.addHeader(AUTHORIZATION,
        basicAuth(remoteAnalysisServiceUsername, remoteAnalysisServicePassword));

    try (CloseableHttpResponse response = httpClient.execute(request)) {
      return EntityUtils.toString(response.getEntity(), UTF_8);
    } catch (IOException e) {
      throw new InternalServerErrorException(e);
    }
  }

  private String basicAuth(String username, String password) {
    String auth = username + ":" + password;
    return "Basic " + Base64.getEncoder().encodeToString(auth.getBytes(UTF_8));
  }

}

package fi.vero.lakied.service.concept;

import static org.springframework.http.HttpHeaders.ACCEPT;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import com.google.common.base.Charsets;
import com.google.gson.JsonParser;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.exception.InternalServerErrorException;
import fi.vero.lakied.util.security.User;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.function.Consumer;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.w3c.dom.Document;

public class SuomiFiRemoteConceptWriteRepository implements
    WriteRepository<Consumer<String>, Document> {

  private final Logger log = LoggerFactory.getLogger(getClass());

  private final String apiUrl;
  private final CloseableHttpClient httpClient;

  public SuomiFiRemoteConceptWriteRepository(String apiUrl) {
    this.apiUrl = apiUrl;
    this.httpClient = HttpClientBuilder.create().build();
  }

  @Override
  public void insert(Consumer<String> key, Document value, User user) {
    HttpPost request = new HttpPost(apiUrl + "terminology/conceptSuggestion");
    request.addHeader(CONTENT_TYPE, APPLICATION_JSON_VALUE);
    request.addHeader(ACCEPT, APPLICATION_JSON_VALUE);
    request.addHeader(AUTHORIZATION,
        "Bearer " + user.getProperties().getOrDefault("SANASTOT_SUOMI_FI_API_TOKEN", ""));
    request.setEntity(new StringEntity(
        new ConceptXmlToJson().apply(value).toString(), StandardCharsets.UTF_8));

    try (CloseableHttpResponse response = httpClient.execute(request)) {
      log.debug(request.toString());

      if (response.getStatusLine().getStatusCode() == 403) {
        throw new AccessDeniedException("Access is denied");
      }

      if (response.getStatusLine().getStatusCode() != 200 ||
          response.getEntity().getContent() == null) {
        log.warn("{} {}", response.getStatusLine().toString(),
            EntityUtils.toString(response.getEntity()));
        return;
      }

      String uri = JsonParser
          .parseReader(new InputStreamReader(response.getEntity().getContent(), Charsets.UTF_8))
          .getAsJsonObject()
          .getAsJsonPrimitive("uri")
          .getAsString();

      key.accept(uri);
    } catch (IOException e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Override
  public void update(Consumer<String> key, Document value, User user) {
    throw new UnsupportedOperationException();
  }

  @Override
  public void delete(Consumer<String> key, User user) {
    throw new UnsupportedOperationException();
  }

}

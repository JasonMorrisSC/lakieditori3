package fi.vero.lakied.service.concept;

import static com.google.common.base.Charsets.UTF_8;
import static org.springframework.http.HttpHeaders.ACCEPT;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import com.google.common.collect.Streams;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.exception.InternalServerErrorException;
import fi.vero.lakied.util.security.User;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.stream.Stream;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;

public class SuomiFiRemoteTerminologyReadRepository implements ReadRepository<String, Document> {

  private final Logger log = LoggerFactory.getLogger(getClass());

  private static final String DEFAULT_API_URL = "https://sanastot.suomi.fi/terminology-api/api/v1/integration/";

  private final String apiUrl;
  private final CloseableHttpClient httpClient;

  public SuomiFiRemoteTerminologyReadRepository() {
    this(DEFAULT_API_URL);
  }

  public SuomiFiRemoteTerminologyReadRepository(String apiUrl) {
    this.apiUrl = apiUrl;
    this.httpClient = HttpClientBuilder.create().build();
  }

  @Override
  public Stream<Tuple2<String, Document>> entries(Criteria<String, Document> criteria, User user) {
    HttpGet request = new HttpGet(apiUrl + "containers");
    request.addHeader(ACCEPT, APPLICATION_JSON_VALUE);

    try (CloseableHttpResponse response = httpClient.execute(request)) {
      log.debug(request.toString());

      if (response.getStatusLine().getStatusCode() != 200 ||
          response.getEntity().getContent() == null) {
        log.warn(response.getStatusLine().toString());
        return Stream.empty();
      }

      JsonArray resultArray = JsonParser
          .parseReader(new InputStreamReader(response.getEntity().getContent(), UTF_8))
          .getAsJsonObject()
          .getAsJsonArray("results");

      return Streams.stream(resultArray.iterator())
          .map(JsonElement::getAsJsonObject)
          .map(object -> Tuple.of(
              object.get("uri").getAsString(),
              new TerminologyJsonToXml().apply(object)));
    } catch (IOException e) {
      throw new InternalServerErrorException(e);
    }
  }

}

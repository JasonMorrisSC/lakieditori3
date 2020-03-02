package fi.vero.lakied.service.concept;

import static com.google.common.base.Charsets.UTF_8;
import static org.springframework.http.HttpHeaders.ACCEPT;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import com.google.common.collect.Streams;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.User;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.JsonCriteria;
import fi.vero.lakied.util.exception.InternalServerErrorException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.stream.Stream;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;

public class SuomiFiRemoteConceptReadRepository implements ReadRepository<String, Document> {

  private static final String DEFAULT_REMOTE_URL =
      "https://sanastot.suomi.fi/terminology-api/api/v1/frontend/searchConcept";

  private final CloseableHttpClient httpClient = HttpClientBuilder.create().build();
  private final String remoteUrl;

  private final Logger log = LoggerFactory.getLogger(getClass());

  public SuomiFiRemoteConceptReadRepository() {
    this(DEFAULT_REMOTE_URL);
  }

  public SuomiFiRemoteConceptReadRepository(String remoteUrl) {
    this.remoteUrl = remoteUrl;
  }

  @Override
  public Stream<Tuple2<String, Document>> entries(Criteria<String, Document> criteria, User user) {
    if (!(criteria instanceof JsonCriteria)) {
      throw new IllegalArgumentException(
          "This repository supports only " + JsonCriteria.class.getCanonicalName() + " criteria.");
    }

    HttpPost request = new HttpPost(remoteUrl);

    request.addHeader(ACCEPT, APPLICATION_JSON_VALUE);
    request.addHeader(CONTENT_TYPE, APPLICATION_JSON_VALUE);
    request.setEntity(new StringEntity(
        ((JsonCriteria<String, Document>) criteria).query().toString(), UTF_8));

    try (CloseableHttpResponse response = httpClient.execute(request)) {
      log.debug(request.toString());

      JsonObject resultObject = JsonParser
          .parseReader(new InputStreamReader(response.getEntity().getContent(), UTF_8))
          .getAsJsonObject();

      return Streams.stream(resultObject.getAsJsonArray("concepts").iterator())
          .map(e -> {
            JsonObject object = e.getAsJsonObject();
            return Tuple.of(object.get("uri").getAsString(), new ConceptJsonToXml().apply(object));
          });
    } catch (IOException e) {
      throw new InternalServerErrorException(e);
    }
  }

}

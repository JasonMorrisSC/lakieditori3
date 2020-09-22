package fi.vero.lakied.repository.concept;

import static com.google.common.base.Charsets.UTF_8;
import static org.springframework.http.HttpHeaders.ACCEPT;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import com.google.common.collect.Multimap;
import com.google.common.collect.Streams;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.URLs;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.StringMultimapCriteria;
import fi.vero.lakied.util.exception.InternalServerErrorException;
import fi.vero.lakied.util.security.User;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Map;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;

public class SuomiFiRemoteConceptReadRepository implements ReadRepository<String, Document> {

  private final Logger log = LoggerFactory.getLogger(getClass());

  private final String apiUrl;
  private final CloseableHttpClient httpClient;

  private final Map<String, Document> terminologies;

  public SuomiFiRemoteConceptReadRepository(
      String apiUrl,
      Supplier<Stream<Tuple2<String, Document>>> terminologiesSupplier) {
    this.apiUrl = apiUrl;
    this.httpClient = HttpClientBuilder.create().build();
    this.terminologies = terminologiesSupplier.get()
        .collect(Collectors.toMap(t -> t._1, t -> t._2));
  }

  @Override
  public Stream<Tuple2<String, Document>> entries(Criteria<String, Document> criteria, User user) {
    Multimap<String, String> args =
        ((StringMultimapCriteria<String, Document>) criteria).getMultimap();

    String queryParams = args.entries().stream()
        .map(e -> URLs.encode(e.getKey()) + "=" + URLs.encode(e.getValue()))
        .collect(Collectors.joining("&"));

    HttpGet request = new HttpGet(
        apiUrl + "integration/resources?" + queryParams);
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

      return Streams.stream(resultArray.iterator()).map(e -> {
        JsonObject object = e.getAsJsonObject();
        return Tuple.of(
            object.get("uri").getAsString(),
            new ConceptJsonToXml(terminologies).apply(object));
      });
    } catch (IOException e) {
      throw new InternalServerErrorException(e);
    }
  }

}

package fi.vero.lakied.service.concept;

import static com.google.common.base.Charsets.UTF_8;
import static org.springframework.http.HttpHeaders.ACCEPT;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import com.google.common.collect.Streams;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.URLs;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.StringFieldValueCriteria;
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

  private static final String DEFAULT_API_URL = "https://sanastot.suomi.fi/terminology-api/api/v1/integration/";

  private final String apiUrl;
  private final CloseableHttpClient httpClient;

  private final Map<String, Document> terminologies;

  public SuomiFiRemoteConceptReadRepository(
      Supplier<Stream<Tuple2<String, Document>>> terminologiesSupplier) {
    this(DEFAULT_API_URL, terminologiesSupplier);
  }

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
    if (!(criteria instanceof StringFieldValueCriteria)) {
      throw new RuntimeException("Can't handle criteria: " + criteria);
    }

    StringFieldValueCriteria<String, Document> stringFieldValueCriteria =
        (StringFieldValueCriteria<String, Document>) criteria;

    String field = stringFieldValueCriteria.getFieldName();
    String value = URLs.encode(stringFieldValueCriteria.getFieldValue());

    HttpGet request;

    switch (field) {
      case "uri":
        request = new HttpGet(apiUrl + "resources?uri=" + value + "&pageSize=50");
        break;
      case "query":
        request = new HttpGet(apiUrl + "resources?searchTerm=" + value + "&pageSize=50");
        break;
      default:
        throw new RuntimeException("Can't find concepts by unknown field: " + field);
    }

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

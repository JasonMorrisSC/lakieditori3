package fi.vero.lakied.util.http;

import static com.google.common.base.Charsets.UTF_8;
import static org.springframework.http.HttpHeaders.ACCEPT;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import com.google.common.collect.ImmutableMultimap;
import com.google.common.collect.Multimap;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.URLs;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.Criteria.MatchAll;
import fi.vero.lakied.util.criteria.StringMultimapCriteria;
import fi.vero.lakied.util.exception.InternalServerErrorException;
import fi.vero.lakied.util.security.User;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Collections;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HttpJsonReadRepository<K, V> implements ReadRepository<K, V> {

  private final Logger log = LoggerFactory.getLogger(getClass());

  private final String apiUrl;
  private final CloseableHttpClient httpClient;
  private final Function<JsonElement, Stream<Tuple2<K, V>>> responseParser;
  private final Map<String, String> additionalHeaders;

  public HttpJsonReadRepository(String apiUrl,
      Function<JsonElement, Stream<Tuple2<K, V>>> responseParser) {
    this(apiUrl, responseParser, Collections.emptyMap());
  }

  public HttpJsonReadRepository(
      String apiUrl,
      Function<JsonElement, Stream<Tuple2<K, V>>> responseParser,
      Map<String, String> additionalHeaders) {
    this.apiUrl = apiUrl;
    this.responseParser = responseParser;
    this.additionalHeaders = additionalHeaders;
    this.httpClient = HttpClientBuilder.create().build();
  }

  @Override
  public Stream<Tuple2<K, V>> entries(Criteria<K, V> criteria, User user) {
    if (!(criteria instanceof MatchAll) && !(criteria instanceof StringMultimapCriteria)) {
      throw new IllegalArgumentException("Unsupported criteria: " + criteria.getClass());
    }

    Multimap<String, String> args =
        criteria instanceof StringMultimapCriteria
            ? ((StringMultimapCriteria<K, V>) criteria).getMultimap()
            : ImmutableMultimap.of();

    String queryParams = args.entries().stream()
        .map(e -> URLs.encode(e.getKey()) + "=" + URLs.encode(e.getValue()))
        .collect(Collectors.joining("&"));

    HttpGet request = new HttpGet(apiUrl + "?" + queryParams);
    request.addHeader(ACCEPT, APPLICATION_JSON_VALUE);
    additionalHeaders.forEach(request::addHeader);

    try (CloseableHttpResponse response = httpClient.execute(request)) {
      log.debug(request.toString());

      if (response.getStatusLine().getStatusCode() != 200 ||
          response.getEntity().getContent() == null) {
        log.warn(response.getStatusLine().toString());
        return Stream.empty();
      }

      JsonElement responseBody = JsonParser
          .parseReader(new InputStreamReader(response.getEntity().getContent(), UTF_8));

      return responseParser.apply(responseBody);
    } catch (IOException e) {
      throw new InternalServerErrorException(e);
    }
  }

}

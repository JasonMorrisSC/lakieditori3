package fi.vero.lakied.service.concept;

import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import java.util.UUID;
import java.util.function.Consumer;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;

public class SuomiFiRemoteConceptWriteRepository implements
    WriteRepository<Consumer<String>, Document> {

  private final Logger log = LoggerFactory.getLogger(getClass());

  private static final String DEFAULT_API_URL = "https://sanastot.suomi.fi/terminology-api/api/v1/integration/";

  private final String apiUrl;
  private final CloseableHttpClient httpClient;

  public SuomiFiRemoteConceptWriteRepository() {
    this(DEFAULT_API_URL);
  }

  public SuomiFiRemoteConceptWriteRepository(String apiUrl) {
    this.apiUrl = apiUrl;
    this.httpClient = HttpClientBuilder.create().build();
  }


  @Override
  public void insert(Consumer<String> key, Document value, User user) {
    key.accept("suomi:" + UUID.randomUUID());
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

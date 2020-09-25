package fi.vero.lakied.repository.concept;

import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import fi.vero.lakied.util.common.Tuple2;
import java.util.function.Function;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;

public class DataVocabsJsonldToXmlStream implements
    Function<JsonElement, Stream<Tuple2<String, Document>>> {

  private final Logger log = LoggerFactory.getLogger(getClass());

  @Override
  public Stream<Tuple2<String, Document>> apply(JsonElement response) {

    log.info(new GsonBuilder().setPrettyPrinting().create().toJson(response));

    return Stream.empty();
  }

}

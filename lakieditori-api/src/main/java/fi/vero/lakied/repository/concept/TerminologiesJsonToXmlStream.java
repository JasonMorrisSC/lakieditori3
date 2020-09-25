package fi.vero.lakied.repository.concept;

import com.google.common.collect.Streams;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.Option;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import java.util.function.Function;
import java.util.stream.Stream;
import org.w3c.dom.Document;

public class TerminologiesJsonToXmlStream implements
    Function<JsonElement, Stream<Tuple2<String, Document>>> {

  @Override
  public Stream<Tuple2<String, Document>> apply(JsonElement results) {
    JsonArray resultArray = results.getAsJsonObject().getAsJsonArray("results");

    return Streams.stream(resultArray.iterator()).map(e -> {
      JsonObject object = e.getAsJsonObject();
      return Tuple.of(
          object.get("uri").getAsString(),
          terminologyJsonToXml(object));
    });
  }

  private Document terminologyJsonToXml(JsonObject terminologyObject) {
    DocumentContext terminologyJsonContext = JsonPath.parse(terminologyObject.toString(),
        Configuration.defaultConfiguration().addOptions(Option.SUPPRESS_EXCEPTIONS));

    return XmlDocumentBuilder.builder()
        .pushElement("terminology").attribute("uri", terminologyJsonContext.read("$.uri"))
        .pushElement("label").attribute("xml:lang", "fi")
        .text(terminologyJsonContext.read("$.prefLabel.fi"))
        .pop().pop()
        .build();
  }

}

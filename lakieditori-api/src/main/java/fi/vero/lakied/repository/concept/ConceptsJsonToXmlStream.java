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
import java.util.Map;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.w3c.dom.Document;

public class ConceptsJsonToXmlStream implements
    Function<JsonElement, Stream<Tuple2<String, Document>>> {

  private final Map<String, Document> terminologies;

  public ConceptsJsonToXmlStream(
      Supplier<Stream<Tuple2<String, Document>>> terminologiesSupplier) {
    this.terminologies = terminologiesSupplier.get()
        .collect(Collectors.toMap(t -> t._1, t -> t._2));
  }

  @Override
  public Stream<Tuple2<String, Document>> apply(JsonElement results) {
    JsonArray resultArray = results.getAsJsonObject().getAsJsonArray("results");

    return Streams.stream(resultArray.iterator()).map(e -> {
      JsonObject object = e.getAsJsonObject();
      return Tuple.of(
          object.get("uri").getAsString(),
          conceptJsonToXml(object));
    });
  }

  private Document conceptJsonToXml(JsonObject conceptObject) {
    DocumentContext conceptJsonContext = JsonPath.parse(conceptObject.toString(),
        Configuration.defaultConfiguration().addOptions(Option.SUPPRESS_EXCEPTIONS));

    XmlDocumentBuilder builder = XmlDocumentBuilder.builder();

    builder.pushElement("concept")
        .attribute("uri", conceptJsonContext.read("$.uri"));

    builder.pushElement("label")
        .attribute("xml:lang", "fi")
        .text(conceptJsonContext.read("$.prefLabel.fi"))
        .pop();

    builder.pushElement("definition")
        .attribute("xml:lang", "fi")
        .text(conceptJsonContext.read("$.description.fi"))
        .pop();

    String terminologyUri = conceptJsonContext.read("$.container");
    builder.appendExternal(terminologies.get(terminologyUri).getDocumentElement());

    return builder.build();
  }

}

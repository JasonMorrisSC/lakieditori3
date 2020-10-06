package fi.vero.lakied.repository.concept;

import static fi.vero.lakied.repository.concept.JsonldUtils.getString;
import static fi.vero.lakied.repository.concept.JsonldUtils.label;
import static fi.vero.lakied.repository.concept.JsonldUtils.objects;
import static fi.vero.lakied.repository.concept.JsonldUtils.resolve;

import com.google.common.collect.ImmutableMap;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import java.util.Map;
import java.util.Map.Entry;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;

public class DataVocabJsonToXmlStream implements
    Function<JsonElement, Stream<Tuple2<String, Document>>> {

  private final Logger log = LoggerFactory.getLogger(getClass());

  @Override
  public Stream<Tuple2<String, Document>> apply(JsonElement response) {
    log.info(new GsonBuilder().setPrettyPrinting().create().toJson(response));

    JsonObject context = response.getAsJsonObject().getAsJsonObject("@context");
    JsonArray graph = response.getAsJsonObject().getAsJsonArray("@graph");

    Map<String, String> nsMap =
        context.entrySet().stream()
            .filter(e -> e.getValue().isJsonPrimitive())
            .collect(Collectors.toMap(Entry::getKey, e -> e.getValue().getAsString()));

    Map<String, Map<String, String>> ontologyUriLabelMap = objects(graph)
        .filter(JsonldUtils::isOntology)
        .collect(Collectors.toMap(
            e -> e.get("@id").getAsString(),
            e -> label(e.get("label"))));

    Stream<Tuple2<String, Document>> classes = objects(graph)
        .filter(JsonldUtils::isClass)
        .map(o -> Tuple.of(
            resolve(o.get("@id").getAsString(), nsMap),
            XmlDocumentBuilder.builder("class")
                .attribute("uri", resolve(getString(o, "@id", ""), nsMap))
                .pushElement("label").attribute("xml:lang", "fi")
                .text(label(o.get("label")).getOrDefault("fi", ""))
                .pop()
                .pushElement("graph")
                .attribute("uri", getString(o, "isDefinedBy", ""))
                .pushElement("label").attribute("xml:lang", "fi")
                .text(ontologyUriLabelMap
                    .getOrDefault(getString(o, "isDefinedBy", ""), ImmutableMap.of())
                    .getOrDefault("fi", ""))
                .pop()
                .pop()
                .build()
        ));

    Stream<Tuple2<String, Document>> attributes = objects(graph)
        .filter(JsonldUtils::isAttribute)
        .map(o -> Tuple.of(
            resolve(o.get("@id").getAsString(), nsMap),
            XmlDocumentBuilder.builder("attribute")
                .attribute("uri", resolve(getString(o, "@id", ""), nsMap))
                .pushElement("label").attribute("xml:lang", "fi")
                .text(label(o.get("label")).getOrDefault("fi", ""))
                .pop()
                .pushElement("graph")
                .attribute("uri", getString(o, "isDefinedBy", ""))
                .pushElement("label").attribute("xml:lang", "fi")
                .text(ontologyUriLabelMap
                    .getOrDefault(getString(o, "isDefinedBy", ""), ImmutableMap.of())
                    .getOrDefault("fi", ""))
                .pop()
                .pop()
                .build()
        ));

    return Stream.concat(classes, attributes);
  }

}

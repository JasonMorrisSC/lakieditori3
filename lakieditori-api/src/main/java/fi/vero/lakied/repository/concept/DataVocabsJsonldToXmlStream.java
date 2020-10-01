package fi.vero.lakied.repository.concept;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Streams;
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

public class DataVocabsJsonldToXmlStream implements
    Function<JsonElement, Stream<Tuple2<String, Document>>> {

  private final Logger log = LoggerFactory.getLogger(getClass());

  private final ImmutableSet<String> ontologyTypeUris = ImmutableSet.of(
      "http://purl.org/ws-mmi-dc/terms/DCAP",
      "http://purl.org/ws-mmi-dc/terms/MetadataVocabulary",
      "http://www.w3.org/2002/07/owl#Ontology",
      "dcap:DCAP",
      "dcap:MetadataVocabulary",
      "owl:Ontology");

  private final ImmutableSet<String> classTypeUris = ImmutableSet.of(
      "http://www.w3.org/2000/01/rdf-schema#Class",
      "http://www.w3.org/ns/shacl#NodeShape",
      "rdfs:Class",
      "sh:NodeShape");

  private final ImmutableSet<String> attributeTypeUris = ImmutableSet.of(
      "http://www.w3.org/2002/07/owl#ObjectProperty",
      "owl:ObjectProperty");

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
        .filter(this::isOntology)
        .collect(Collectors.toMap(
            e -> e.get("@id").getAsString(),
            e -> label(e.get("label"))));

    Stream<Tuple2<String, Document>> classes = objects(graph)
        .filter(this::isClass)
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
        .filter(this::isAttribute)
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

  // utils

  private Map<String, String> label(JsonElement label) {
    return objects(label)
        .collect(Collectors.toMap(
            e -> e.get("@language").getAsString(),
            e -> e.get("@value").getAsString()));
  }

  private String getString(JsonObject object, String memberName, String defaultValue) {
    JsonElement value = object.get(memberName);
    return value != null && value.isJsonPrimitive() ? value.getAsString() : defaultValue;
  }

  private String resolve(String uri, Map<String, String> nsPrefixes) {
    if (uri.matches("\\w*:.*")) {
      String[] nsAndName = uri.split(":", 2);
      return nsPrefixes.containsKey(nsAndName[0])
          ? nsPrefixes.get(nsAndName[0]) + nsAndName[1]
          : uri;
    } else {
      return uri;
    }
  }

  private boolean isOntology(JsonObject object) {
    return strings(object.get("@type")).anyMatch(ontologyTypeUris::contains);
  }

  private boolean isClass(JsonObject object) {
    return strings(object.get("@type")).anyMatch(classTypeUris::contains);
  }

  private boolean isAttribute(JsonObject object) {
    return strings(object.get("@type")).anyMatch(attributeTypeUris::contains);
  }

  private Stream<String> strings(JsonElement element) {
    if (element == null) {
      return Stream.empty();
    }

    if (element.isJsonPrimitive()) {
      return Stream.of(element.getAsString());
    }

    if (element.isJsonArray()) {
      return Streams.stream(element.getAsJsonArray().iterator())
          .filter(JsonElement::isJsonPrimitive)
          .map(JsonElement::getAsString);
    }

    log.warn("Expected string primitive or string array, got {}", element);

    return Stream.empty();
  }

  private Stream<JsonObject> objects(JsonElement element) {
    if (element == null) {
      return Stream.empty();
    }

    if (element.isJsonObject()) {
      return Stream.of(element.getAsJsonObject());
    }

    if (element.isJsonArray()) {
      return Streams.stream(element.getAsJsonArray().iterator())
          .filter(JsonElement::isJsonObject)
          .map(JsonElement::getAsJsonObject);
    }

    log.warn("Expected object or object array, got {}", element);

    return Stream.empty();
  }

}

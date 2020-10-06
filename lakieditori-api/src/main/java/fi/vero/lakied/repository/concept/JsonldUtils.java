package fi.vero.lakied.repository.concept;

import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Streams;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class JsonldUtils {

  private static final Logger log = LoggerFactory.getLogger(JsonldUtils.class);

  private JsonldUtils() {
  }

  private static final ImmutableSet<String> ontologyTypeUris = ImmutableSet.of(
      "http://purl.org/ws-mmi-dc/terms/DCAP",
      "http://purl.org/ws-mmi-dc/terms/MetadataVocabulary",
      "http://www.w3.org/2002/07/owl#Ontology",
      "dcap:DCAP",
      "dcap:MetadataVocabulary",
      "owl:Ontology");

  private static final ImmutableSet<String> classTypeUris = ImmutableSet.of(
      "http://www.w3.org/2000/01/rdf-schema#Class",
      "http://www.w3.org/ns/shacl#NodeShape",
      "rdfs:Class",
      "sh:NodeShape");

  private static final ImmutableSet<String> attributeTypeUris = ImmutableSet.of(
      "http://www.w3.org/2002/07/owl#ObjectProperty",
      "owl:ObjectProperty");


  public static Map<String, String> label(JsonElement label) {
    return objects(label)
        .collect(Collectors.toMap(
            e -> e.get("@language").getAsString(),
            e -> e.get("@value").getAsString()));
  }

  public static String getString(JsonObject object, String memberName, String defaultValue) {
    JsonElement value = object.get(memberName);
    return value != null && value.isJsonPrimitive() ? value.getAsString() : defaultValue;
  }

  public static String resolve(String uri, Map<String, String> nsPrefixes) {
    if (uri.matches("\\w*:.*")) {
      String[] nsAndName = uri.split(":", 2);
      return nsPrefixes.containsKey(nsAndName[0])
          ? nsPrefixes.get(nsAndName[0]) + nsAndName[1]
          : uri;
    } else {
      return uri;
    }
  }

  public static boolean isOntology(JsonObject object) {
    return strings(object.get("@type")).anyMatch(ontologyTypeUris::contains);
  }

  public static boolean isClass(JsonObject object) {
    return strings(object.get("@type")).anyMatch(classTypeUris::contains);
  }

  public static boolean isAttribute(JsonObject object) {
    return strings(object.get("@type")).anyMatch(attributeTypeUris::contains);
  }

  public static Stream<String> strings(JsonElement element) {
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

  public static Stream<JsonObject> objects(JsonElement element) {
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

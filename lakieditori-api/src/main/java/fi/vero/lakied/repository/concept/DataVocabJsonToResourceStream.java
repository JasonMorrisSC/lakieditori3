package fi.vero.lakied.repository.concept;

import static fi.vero.lakied.repository.concept.JsonldUtils.getString;
import static fi.vero.lakied.repository.concept.JsonldUtils.label;
import static fi.vero.lakied.repository.concept.JsonldUtils.objects;
import static fi.vero.lakied.repository.concept.JsonldUtils.resolve;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import java.util.Map;
import java.util.Map.Entry;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class DataVocabJsonToResourceStream implements
    Function<JsonElement, Stream<Tuple2<String, Resource>>> {

  @Override
  public Stream<Tuple2<String, Resource>> apply(JsonElement response) {
    JsonObject context = response.getAsJsonObject().getAsJsonObject("@context");
    JsonArray graph = response.getAsJsonObject().getAsJsonArray("@graph");

    Map<String, String> nsMap =
        context.entrySet().stream()
            .filter(e -> e.getValue().isJsonPrimitive())
            .collect(Collectors.toMap(Entry::getKey, e -> e.getValue().getAsString()));

    Map<String, Graph> ontologyUriLabelMap = objects(graph)
        .filter(JsonldUtils::isOntology)
        .collect(Collectors.toMap(
            e -> e.get("@id").getAsString(),
            e -> new Graph(e.get("@id").getAsString(), label(e.get("label")))));

    Stream<Tuple2<String, Resource>> classes = objects(graph)
        .filter(JsonldUtils::isClass)
        .map(o -> Tuple.of(
            resolve(o.get("@id").getAsString(), nsMap),
            new Resource(
                resolve(getString(o, "@id", ""), nsMap),
                Type.CLASS,
                ontologyUriLabelMap.get(getString(o, "isDefinedBy", "")),
                label(o.get("label")))));

    Stream<Tuple2<String, Resource>> attributes = objects(graph)
        .filter(JsonldUtils::isAttribute)
        .map(o -> Tuple.of(
            resolve(o.get("@id").getAsString(), nsMap),
            new Resource(
                resolve(getString(o, "@id", ""), nsMap),
                Type.ATTRIBUTE,
                ontologyUriLabelMap.get(getString(o, "isDefinedBy", "")),
                label(o.get("label")))));

    return Stream.concat(classes, attributes);
  }

}

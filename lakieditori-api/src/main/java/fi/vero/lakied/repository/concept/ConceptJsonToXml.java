package fi.vero.lakied.repository.concept;

import com.google.gson.JsonObject;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.Option;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import java.util.Map;
import java.util.function.Function;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;

public class ConceptJsonToXml implements Function<JsonObject, Document> {

  private final Logger log = LoggerFactory.getLogger(getClass());

  private final Map<String, Document> terminologiesByUri;

  public ConceptJsonToXml(Map<String, Document> terminologiesByUri) {
    this.terminologiesByUri = terminologiesByUri;
  }

  @Override
  public Document apply(JsonObject conceptObject) {
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
    builder.appendExternal(terminologiesByUri.get(terminologyUri).getDocumentElement());

    return builder.build();
  }

}

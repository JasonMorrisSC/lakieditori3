package fi.vero.lakied.service.concept;

import com.google.gson.JsonObject;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.Option;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import fi.vero.lakied.util.xml.XmlUtils;
import java.io.IOException;
import java.util.function.Function;
import javax.xml.parsers.ParserConfigurationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

public class ConceptJsonToXml implements Function<JsonObject, Document> {

  private final Logger log = LoggerFactory.getLogger(getClass());

  @Override
  public Document apply(JsonObject conceptObject) {
    DocumentContext context = JsonPath.parse(conceptObject.toString(),
        Configuration.defaultConfiguration()
            .addOptions(Option.SUPPRESS_EXCEPTIONS));

    XmlDocumentBuilder builder = new XmlDocumentBuilder();

    builder.pushElement("concept")
        .attribute("uri", context.read("$.uri"));

    builder.pushElement("label")
        .attribute("xml:lang", "fi")
        .text(context.read("$.label.fi"))
        .pop();

    builder.pushElement("definition")
        .attribute("xml:lang", "fi")
        .text(textContent(context.read("$.definition.fi")))
        .pop();

    builder.pushElement("terminology")
        .attribute("uri", context.read("$.terminology.uri"));

    builder
        .pushElement("label")
        .attribute("xml:lang", "fi")
        .text(context.read("$.terminology.label.fi"))
        .pop();

    // close terminology tag
    builder.pop();

    return builder.build();
  }

  private String textContent(String xml) {
    try {
      return XmlUtils.parse("<root>" + (xml != null ? xml : "") + "</root>")
          .getDocumentElement()
          .getTextContent();
    } catch (SAXException | ParserConfigurationException | IOException e) {
      log.debug("Failed to parse: {}", xml);
      return xml;
    }
  }

}

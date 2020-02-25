package fi.vero.lakied.service.concept;

import com.google.gson.JsonObject;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.Option;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import fi.vero.lakied.util.xml.XmlUtils;
import java.util.function.Function;
import org.w3c.dom.Document;

public class ConceptJsonToXml implements Function<JsonObject, Document> {

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
    Document doc = XmlUtils.parseUnchecked("<root>" + (xml != null ? xml : "") + "</root>");
    return doc.getDocumentElement().getTextContent();
  }

}

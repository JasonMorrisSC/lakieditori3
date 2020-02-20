package fi.vero.lakied.service.concept;

import com.google.gson.JsonObject;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import java.util.function.Function;
import org.w3c.dom.Document;

public class ConceptJsonToXml implements Function<JsonObject, Document> {

  @Override
  public Document apply(JsonObject conceptObject) {
    XmlDocumentBuilder builder = new XmlDocumentBuilder();

    builder.pushElement("concept")
        .attribute("uri", conceptObject.get("uri").getAsString());

    JsonObject labelObject = conceptObject.getAsJsonObject("label");

    builder.pushElement("label")
        .attribute("xml:lang", "fi")
        .text(labelObject.get("fi").getAsString())
        .pop();

    JsonObject terminologyObject = conceptObject.getAsJsonObject("terminology");

    builder.pushElement("terminology")
        .attribute("uri", terminologyObject.get("uri").getAsString());

    JsonObject terminologyLabelObject = terminologyObject.getAsJsonObject("label");
    builder
        .pushElement("label")
        .attribute("xml:lang", "fi")
        .text(terminologyLabelObject.get("fi").getAsString())
        .pop();

    // close terminology tag
    builder.pop();

    return builder.build();
  }

}

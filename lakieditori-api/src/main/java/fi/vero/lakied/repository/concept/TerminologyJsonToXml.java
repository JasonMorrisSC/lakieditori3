package fi.vero.lakied.repository.concept;

import com.google.gson.JsonObject;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.Option;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import java.util.function.Function;
import org.w3c.dom.Document;

public class TerminologyJsonToXml implements Function<JsonObject, Document> {

  @Override
  public Document apply(JsonObject conceptObject) {
    DocumentContext conceptJsonContext = JsonPath.parse(conceptObject.toString(),
        Configuration.defaultConfiguration().addOptions(Option.SUPPRESS_EXCEPTIONS));

    return XmlDocumentBuilder.builder()
        .pushElement("terminology").attribute("uri", conceptJsonContext.read("$.uri"))
        .pushElement("label").attribute("xml:lang", "fi")
        .text(conceptJsonContext.read("$.prefLabel.fi"))
        .pop().pop()
        .build();
  }

}

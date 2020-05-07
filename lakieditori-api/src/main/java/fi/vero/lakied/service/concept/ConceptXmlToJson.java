package fi.vero.lakied.service.concept;

import static fi.vero.lakied.util.json.JsonElementFactory.object;
import static fi.vero.lakied.util.json.JsonElementFactory.primitive;

import com.google.gson.JsonObject;
import fi.vero.lakied.util.xml.XmlUtils;
import java.util.function.Function;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;

public class ConceptXmlToJson implements Function<Document, JsonObject> {

  private final Logger log = LoggerFactory.getLogger(getClass());

  @Override
  public JsonObject apply(Document concept) {
    JsonObject object = object(
        "prefLabel", object(
            "value", primitive(XmlUtils.queryText(concept, "/concept/label")),
            "lang", primitive("fi")),
        "definition", object(
            "value", primitive(XmlUtils.queryText(concept, "/concept/definition")),
            "lang", primitive("fi")),
        "terminologyUri", primitive(
            XmlUtils.queryText(concept, "/concept/terminology/@uri")
                + "terminological-vocabulary-0"));

    log.info(object.toString());

    return object;
  }

}

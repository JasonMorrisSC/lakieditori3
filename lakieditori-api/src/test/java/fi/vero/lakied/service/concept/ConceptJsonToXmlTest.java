package fi.vero.lakied.service.concept;

import static fi.vero.lakied.util.xml.XmlUtils.queryFirstText;
import static org.junit.jupiter.api.Assertions.assertEquals;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.junit.jupiter.api.Test;
import org.w3c.dom.Document;

class ConceptJsonToXmlTest {

  @Test
  void shouldConvertConceptJsonToXml() {
    String conceptJson = "{\n"
        + "  \"id\": \"133f6803-f4b4-49c9-af82-5830fd88c17b\",\n"
        + "  \"uri\": \"http://uri.suomi.fi/terminology/rakymp/c141\",\n"
        + "  \"status\": \"DRAFT\",\n"
        + "  \"label\": {\n"
        + "      \"sv\": \"flervåningsbostadshus\",\n"
        + "      \"fi\": \"asuinkerrostalo\",\n"
        + "      \"en\": \"residential block of flats\"\n"
        + "  },\n"
        + "  \"definition\": {\n"
        + "      \"fi\": \"vähintään kolmikerroksinen <a href='http://uri.suomi.fi/terminology/rakymp/c139' property ='broader'>kerrostalo</a>\"\n"
        + "  },\n"
        + "  \"modified\": \"2019-11-27T14:41:34Z\",\n"
        + "  \"broader\": [\n"
        + "      \"23a19e4e-9295-42b0-8051-87d6a34354c8\"\n"
        + "  ],\n"
        + "  \"terminology\": {\n"
        + "      \"id\": \"95d5a174-01af-4825-bae2-fd5fcaed1774\",\n"
        + "      \"uri\": \"http://uri.suomi.fi/terminology/rakymp/terminological-vocabulary-0\",\n"
        + "      \"status\": \"DRAFT\",\n"
        + "      \"label\": {\n"
        + "          \"fi\": \"Rakennetun ympäristön pääsanasto (master)\"\n"
        + "      }\n"
        + "  }\n"
        + "}";

    JsonObject conceptJsonObject = JsonParser.parseString(conceptJson).getAsJsonObject();

    Document conceptXml = new ConceptJsonToXml().apply(conceptJsonObject);

    assertEquals(
        conceptJsonObject.get("uri").getAsString(),
        queryFirstText(conceptXml, "/concept/@uri"));

    assertEquals(
        conceptJsonObject.getAsJsonObject("label").get("fi").getAsString(),
        queryFirstText(conceptXml, "/concept/label[@lang='fi']"));

    assertEquals(
        conceptJsonObject.getAsJsonObject("definition").get("fi").getAsString(),
        queryFirstText(conceptXml, "/concept/definition[@lang='fi']"));

    assertEquals(
        conceptJsonObject
            .getAsJsonObject("terminology")
            .getAsJsonObject("label")
            .get("fi").getAsString(),
        queryFirstText(conceptXml, "/concept/terminology/label[@lang='fi']"));
  }

}
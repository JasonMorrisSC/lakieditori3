package fi.vero.lakied.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import fi.vero.lakied.util.xml.XmlUtils;
import org.junit.jupiter.api.Test;
import org.w3c.dom.Document;

class XmlUtilsTest {

  @Test
  void shouldParseSimpleXml() {
    Document document = XmlUtils.parseUnchecked("<hello>World!</hello>");
    assertEquals("World!", document.getElementsByTagName("hello").item(0).getTextContent());
  }

  @Test
  void shouldQueryText() {
    Document document = XmlUtils.parseUnchecked("<hello id=\"123\">World!</hello>");

    assertEquals("World!", XmlUtils.queryText(document, "/hello"));
    assertEquals("123", XmlUtils.queryText(document, "/hello/@id"));

    assertTrue(XmlUtils.queryText(document, "/hello/bar").isEmpty());
    assertTrue(XmlUtils.queryText(document, "/hello/@foo").isEmpty());
  }

  @Test
  void shouldQueryBoolean() {
    Document document = XmlUtils.parseUnchecked("<hello id=\"123\">World!</hello>");

    assertTrue(XmlUtils.queryBoolean(document, "/hello = \"World!\""));
    assertTrue(XmlUtils.queryBoolean(document, "/hello = 'World!'"));
    assertTrue(XmlUtils.queryBoolean(document, "/hello/@id = \"123\""));

    assertFalse(XmlUtils.queryBoolean(document, "/hello = \"Wor\""));
    assertFalse(XmlUtils.queryBoolean(document, "/hello/bar = \"World!\""));
    assertFalse(XmlUtils.queryBoolean(document, "/hello/@foo = \"123\""));
  }

}

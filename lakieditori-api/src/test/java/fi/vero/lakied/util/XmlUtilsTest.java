package fi.vero.lakied.util;

import static org.junit.jupiter.api.Assertions.assertEquals;

import fi.vero.lakied.util.xml.XmlUtils;
import org.junit.jupiter.api.Test;
import org.w3c.dom.Document;

class XmlUtilsTest {

  @Test
  void shouldParseSimpleXml() {
    Document document = XmlUtils.parseUnchecked("<hello>World!</hello>");
    assertEquals("World!", document.getElementsByTagName("hello").item(0).getTextContent());
  }

}

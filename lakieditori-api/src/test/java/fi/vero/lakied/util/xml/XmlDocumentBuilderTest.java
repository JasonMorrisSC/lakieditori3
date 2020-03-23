package fi.vero.lakied.util.xml;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.w3c.dom.Document;

class XmlDocumentBuilderTest {

  @Test
  void shouldBuildDocument() {
    XmlDocumentBuilder builder = XmlDocumentBuilder.builder();
    builder.pushElement("root");
    builder.attribute("id", "123");

    Document document = builder.build();

    assertEquals("root", document.getDocumentElement().getNodeName());
    assertEquals("123", document.getDocumentElement().getAttribute("id"));
  }

}
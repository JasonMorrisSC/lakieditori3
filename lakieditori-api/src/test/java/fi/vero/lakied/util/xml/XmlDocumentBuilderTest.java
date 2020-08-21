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

  @Test
  void shouldBuildDocumentWithNamespaces() {
    String exNs = "http://example.org/";
    String someNs = "http://domain.com/";
    XmlDocumentBuilder builder = XmlDocumentBuilder.builder();

    builder.pushElementNs(exNs, "ex:root");
    builder.attributeNs(exNs, "ex:id", "123");

    builder.attributeNs("http://www.w3.org/2000/xmlns/", "xmlns:ex", exNs);
    builder.attributeNs("http://www.w3.org/2000/xmlns/", "xmlns:some", someNs);

    builder.attributeNs(exNs, "ex:id", "123");

    builder.pushElementNs(exNs, "ex:branch");
    builder.pushElementNs(exNs, "ex:leaf").pop();
    builder.pushElementNs(someNs, "some:leaf").pop();

    Document document = builder.build();

    assertEquals("ex:root", document.getDocumentElement().getNodeName());
    assertEquals("123", document.getDocumentElement().getAttribute("ex:id"));

    assertEquals("ex:leaf", document
        .getDocumentElement()
        .getFirstChild()
        .getFirstChild()
        .getNodeName());

    assertEquals("some:leaf", document
        .getDocumentElement()
        .getFirstChild()
        .getLastChild()
        .getNodeName());
  }

}
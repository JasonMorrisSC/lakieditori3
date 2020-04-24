package fi.vero.lakied.util.xml;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

class XmlUtilsTest {

  @Test
  void shouldParseSimpleXml() {
    Document document = XmlUtils.parseUnchecked("<hello>World!</hello>");
    assertEquals("World!", document.getElementsByTagName("hello").item(0).getTextContent());
  }

  @Test
  void shouldParseSimpleXmlLineCountingHandler() {
    LineCountingDocumentHandler handler = new LineCountingDocumentHandler();

    XmlUtils.parseUnchecked("<greetings>\n"
        + "<hello>World!</hello>\n"
        + "</greetings>", handler);

    Document document = handler.getDocument();
    assertEquals("World!", document.getElementsByTagName("hello").item(0).getTextContent());
    assertEquals(2, document.getElementsByTagName("hello").item(0).getUserData("lineNumber"));
  }

  @Test
  void shouldStreamNodesWithXPath() {
    Document document = XmlUtils.parseUnchecked(
        "<example>"
            + "<node>foo</node>"
            + "<node>bar</node>"
            + "<node>baz</node>"
            + "</example>");

    assertEquals("foo,bar,baz",
        XmlUtils.queryNodes(document, "/example/node")
            .map(Node::getTextContent)
            .collect(Collectors.joining(",")));
  }

  @Test
  void shouldReturnEmptyStreamIfNotFoundWithXPath() {
    Document document = XmlUtils.parseUnchecked(
        "<example>"
            + "<node>foo</node>"
            + "<node>bar</node>"
            + "<node>baz</node>"
            + "</example>");

    assertFalse(XmlUtils.queryNodes(document, "/path/not/found").findFirst().isPresent());
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

  @Test
  void shouldFormat() {
    Document document = XmlUtils
        .parseUnchecked("<root><greetings>Hello!</greetings><greetings>Hola!</greetings></root>");

    assertEquals(
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
            + "<root>\n"
            + "  <greetings>Hello!</greetings>\n"
            + "  <greetings>Hola!</greetings>\n"
            + "</root>",
        XmlUtils.print(XmlUtils.format(document)));
  }

  @Test
  void shouldKeepFormatting() {
    String formattedXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        + "<root>\n"
        + "  <greetings>\n"
        + "    Hello!\n"
        + "  </greetings>\n"
        + "  <greetings>\n"
        + "    Hola!\n"
        + "  </greetings>\n"
        + "</root>";

    Document document = XmlUtils.parseUnchecked(formattedXml);

    assertEquals(formattedXml,
        XmlUtils.print(
            XmlUtils.format(
                XmlUtils.removeBlankNodes(document))));
  }

  @Test
  void shouldFormatMixed() {
    Document document = XmlUtils
        .parseUnchecked("<root><greetings>Hello <b>world</b>!</greetings></root>");

    assertEquals(
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
            + "<root>\n"
            + "  <greetings>Hello <b>world</b>!</greetings>\n"
            + "</root>",
        XmlUtils.print(XmlUtils.format(document)));
  }

}

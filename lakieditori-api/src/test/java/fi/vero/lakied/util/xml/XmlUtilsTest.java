package fi.vero.lakied.util.xml;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

class XmlUtilsTest {

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

}

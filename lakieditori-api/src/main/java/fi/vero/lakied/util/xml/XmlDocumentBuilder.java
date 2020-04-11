package fi.vero.lakied.util.xml;

import java.util.stream.Stream;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

public class XmlDocumentBuilder {

  private final Document document;
  private Node currentNode;

  private XmlDocumentBuilder() {
    this.document = XmlUtils.newDocument();
    this.currentNode = document;
  }

  public static XmlDocumentBuilder builder() {
    return new XmlDocumentBuilder();
  }

  public XmlDocumentBuilder pushElement(String name) {
    currentNode = currentNode.appendChild(document.createElement(name));
    return this;
  }

  public XmlDocumentBuilder pushExternal(Document document) {
    return pushExternal(document.getDocumentElement());
  }

  public XmlDocumentBuilder pushExternal(Node node) {
    currentNode = currentNode.appendChild(document.importNode(node, true));
    return this;
  }

  public XmlDocumentBuilder appendExternal(Stream<Node> nodes) {
    nodes.forEach(node -> currentNode.appendChild(document.importNode(node, true)));
    return this;
  }

  public XmlDocumentBuilder appendText(String data) {
    currentNode.appendChild(document.createTextNode(data));
    return this;
  }

  public XmlDocumentBuilder attribute(String name, String value) {
    ((Element) currentNode).setAttribute(name, value);
    return this;
  }

  public XmlDocumentBuilder text(String value) {
    currentNode.setTextContent(value);
    return this;
  }

  public XmlDocumentBuilder userData(String key, Object value) {
    currentNode.setUserData(key, value, null);
    return this;
  }

  public XmlDocumentBuilder pop() {
    currentNode = currentNode.getParentNode();
    return this;
  }

  public Document build() {
    return document;
  }

}

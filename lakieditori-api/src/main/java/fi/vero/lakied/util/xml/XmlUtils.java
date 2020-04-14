package fi.vero.lakied.util.xml;

import com.google.common.base.MoreObjects;
import com.google.common.base.Preconditions;
import com.google.common.collect.AbstractIterator;
import com.google.common.collect.Streams;
import fi.vero.lakied.util.common.StreamUtils;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.xml.XMLConstants;
import javax.xml.namespace.QName;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.Attributes;
import org.xml.sax.ErrorHandler;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;
import org.xml.sax.helpers.DefaultHandler;

public final class XmlUtils {

  private XmlUtils() {
  }

  public static Schema parseSchema(String... schemas) {
    return parseSchema(
        Stream.of(schemas)
            .map(StringReader::new)
            .map(StreamSource::new)
            .toArray(Source[]::new));
  }

  public static Schema parseSchema(Source... sources) {
    try {
      SchemaFactory factory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
      return factory.newSchema(sources);
    } catch (SAXException e) {
      throw new RuntimeException(e);
    }
  }

  public static Document newDocument() {
    try {
      DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
      return builder.newDocument();
    } catch (ParserConfigurationException e) {
      throw new RuntimeException(e);
    }
  }

  public static Document parseUnchecked(String xml) {
    try {
      return parse(xml);
    } catch (ParserConfigurationException | SAXException | IOException e) {
      throw new RuntimeException(e);
    }
  }

  public static Document parseUnchecked(InputStream xml) {
    try {
      return parse(xml);
    } catch (ParserConfigurationException | SAXException | IOException e) {
      throw new RuntimeException(e);
    }
  }

  public static void parseUnchecked(String xml, DefaultHandler handler) {
    try {
      parse(xml, handler);
    } catch (ParserConfigurationException | SAXException | IOException e) {
      throw new RuntimeException(e);
    }
  }

  public static void parseUnchecked(InputStream xml, DefaultHandler handler) {
    try {
      parse(xml, handler);
    } catch (ParserConfigurationException | SAXException | IOException e) {
      throw new RuntimeException(e);
    }
  }

  public static Document parse(String xml)
      throws SAXException, ParserConfigurationException, IOException {
    return parse(new ByteArrayInputStream(xml.getBytes(StandardCharsets.UTF_8)));
  }

  public static Document parse(InputStream xml)
      throws SAXException, ParserConfigurationException, IOException {
    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
    factory.setNamespaceAware(true);
    return factory.newDocumentBuilder().parse(xml);
  }

  public static Document parse(InputStream xml, Schema schema)
      throws SAXException, ParserConfigurationException, IOException {
    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
    factory.setNamespaceAware(true);
    factory.setValidating(true);
    factory.setSchema(schema);
    factory.setIgnoringElementContentWhitespace(true);
    return factory.newDocumentBuilder().parse(xml);
  }

  public static void parse(String xml, DefaultHandler handler)
      throws ParserConfigurationException, SAXException, IOException {
    parse(new ByteArrayInputStream(xml.getBytes(StandardCharsets.UTF_8)), handler);
  }

  public static void parse(InputStream xml, DefaultHandler handler)
      throws ParserConfigurationException, SAXException, IOException {
    SAXParserFactory factory = SAXParserFactory.newInstance();
    SAXParser saxParser = factory.newSAXParser();
    saxParser.parse(xml, handler);
  }

  public static String prettyPrint(Document doc) {
    return print(doc, true);
  }

  public static String print(Document doc) {
    return print(doc, false);
  }

  public static String print(Document doc, boolean pretty) {
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    print(doc, out, pretty);
    return new String(out.toByteArray(), StandardCharsets.UTF_8);
  }

  public static void prettyPrint(Document doc, OutputStream out) {
    print(doc, out, true);
  }

  public static void print(Document doc, OutputStream out) {
    print(doc, out, false);
  }

  public static void print(Document doc, OutputStream out, boolean pretty) {
    try {
      // removes standalone="no" attribute from xml prolog
      doc.setXmlStandalone(true);

      Transformer transformer = TransformerFactory.newInstance().newTransformer();

      if (pretty) {
        transformer.setOutputProperty(OutputKeys.INDENT, "yes");
        transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
      }

      transformer.transform(new DOMSource(doc), new StreamResult(out));
    } catch (TransformerException e) {
      throw new RuntimeException(e);
    }
  }

  public static Node queryNode(Node context, String xPathExpression) {
    return (Node) query(context, xPathExpression, XPathConstants.NODE);
  }

  public static Stream<Node> queryNodes(Node context, String xPathExpression) {
    return asStream((NodeList) query(context, xPathExpression, XPathConstants.NODESET));
  }

  public static boolean queryBoolean(Node context, String xPathExpression) {
    return (boolean) query(context, xPathExpression, XPathConstants.BOOLEAN);
  }

  public static String queryText(Node context, String xPathExpression) {
    return (String) query(context, xPathExpression, XPathConstants.STRING);
  }

  public static Object query(Node context, String xPathExpression, QName returnType) {
    XPath xPath = XPathFactory.newInstance().newXPath();

    try {
      return xPath.compile(xPathExpression).evaluate(context, returnType);
    } catch (XPathExpressionException e) {
      throw new RuntimeException(e);
    }
  }

  public static Stream<Node> asStream(NodeList nodeList) {
    return Streams.stream(new AbstractIterator<Node>() {
      int i = 0;

      @Override
      protected Node computeNext() {
        return i < nodeList.getLength() ? nodeList.item(i++) : endOfData();
      }
    });
  }

  public static Stream<Tuple2<String, String>> asStream(Attributes attrs) {
    return Streams.stream(new AbstractIterator<Tuple2<String, String>>() {
      int i = 0;

      @Override
      protected Tuple2<String, String> computeNext() {
        if (i < attrs.getLength()) {
          Tuple2<String, String> next = Tuple.of(attrs.getLocalName(i), attrs.getValue(i));
          i++;
          return next;
        }
        return endOfData();
      }
    });
  }

  public static boolean isDocumentNode(Node node) {
    return node.getNodeType() == Node.DOCUMENT_NODE;
  }

  public static boolean isTextNode(Node node) {
    return node.getNodeType() == Node.TEXT_NODE;
  }

  public static boolean isElementNode(Node node) {
    return node.getNodeType() == Node.ELEMENT_NODE;
  }

  public static String getPath(Node node) {
    Node parent = node.getParentNode();
    if (parent == null) {
      return isElementNode(node) ? node.getNodeName() : "";
    }
    return getPath(parent) + "/" + node.getNodeName();
  }

  public static List<Difference> textDiff(Document left, Document right) {
    return textDiff(
        left.getDocumentElement(),
        right.getDocumentElement());
  }

  public static List<Difference> textDiff(Element left, Element right) {
    if (left.getTagName().equals(right.getTagName())) {
      return StreamUtils.zipFull(
          asStream(left.getChildNodes()),
          asStream(right.getChildNodes()),
          XmlUtils::textDiff)
          .flatMap(Collection::stream)
          .collect(Collectors.toList());
    }

    if (!left.getTextContent().equals(right.getTextContent())) {
      return Collections.singletonList(
          new Difference(
              getPath(left), left.getTextContent(),
              getPath(right), right.getTextContent()));
    }

    // tag names etc. might differ but text contents are same
    return Collections.emptyList();
  }

  public static List<Difference> textDiff(Node left, Node right) {
    Preconditions
        .checkArgument(left != null || right != null, "Both arguments should not be null.");

    if (left == null) {
      return right.getTextContent().isEmpty()
          ? Collections.emptyList()
          : Collections.singletonList(
              new Difference("", "", getPath(right), right.getTextContent()));
    }

    if (right == null) {
      return left.getTextContent().isEmpty()
          ? Collections.emptyList()
          : Collections.singletonList(
              new Difference(getPath(left), left.getTextContent(), "", ""));
    }

    if (isElementNode(left) && isElementNode(right)) {
      return textDiff((Element) left, (Element) right);
    }

    if (!left.getTextContent().equals(right.getTextContent())) {
      return Collections.singletonList(
          new Difference(
              getPath(left), left.getTextContent(),
              getPath(right), right.getTextContent()));
    }

    return Collections.emptyList();
  }

  public static class Difference {

    private final String leftPath;
    private final String leftText;

    private final String rightPath;
    private final String rightText;

    public Difference(
        String leftPath,
        String leftText,
        String rightPath,
        String rightText) {
      this.leftPath = leftPath;
      this.leftText = leftText;
      this.rightPath = rightPath;
      this.rightText = rightText;
    }

    public String getLeftPath() {
      return leftPath;
    }

    public String getLeftText() {
      return leftText;
    }

    public String getRightPath() {
      return rightPath;
    }

    public String getRightText() {
      return rightText;
    }

    @Override
    public String toString() {
      return MoreObjects.toStringHelper(this)
          .add("leftPath", leftPath)
          .add("leftText", leftText)
          .add("rightPath", rightPath)
          .add("rightText", rightText)
          .toString();
    }

    public Document toDocument() {
      return XmlDocumentBuilder.builder()
          .pushElement("difference")
          .pushElement("left")
          .pushElement("path").text(leftPath).pop()
          .pushElement("text").text(leftText).pop()
          .pop()
          .pushElement("right")
          .pushElement("path").text(rightPath).pop()
          .pushElement("text").text(rightText).pop()
          .pop()
          .build();
    }

  }

}

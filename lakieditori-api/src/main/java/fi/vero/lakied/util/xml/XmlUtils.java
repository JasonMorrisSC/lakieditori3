package fi.vero.lakied.util.xml;

import com.google.common.collect.AbstractIterator;
import com.google.common.collect.Streams;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Stream;
import javax.xml.XMLConstants;
import javax.xml.namespace.QName;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
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
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

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
    NodeList nodeList = (NodeList) query(context, xPathExpression, XPathConstants.NODESET);

    return Streams.stream(new AbstractIterator<Node>() {
      int i = 0;

      @Override
      protected Node computeNext() {
        return i < nodeList.getLength() ? nodeList.item(i++) : endOfData();
      }
    });
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

}

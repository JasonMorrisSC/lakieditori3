package fi.vero.lakied.util.xml;

import org.w3c.dom.Document;
import org.xml.sax.Attributes;
import org.xml.sax.Locator;
import org.xml.sax.helpers.DefaultHandler;

/**
 * Builds a {@code org.w3c.dom.Document} and adds a line number to each {@code Element}. Line number
 * is stored to element used data with key "lineNumber".
 */
public class LineCountingDocumentHandler extends DefaultHandler {

  private XmlDocumentBuilder builder;
  private Document document;
  private Locator locator;

  private boolean storeLineNumberToAttribute;

  public LineCountingDocumentHandler() {
    this(false);
  }

  public LineCountingDocumentHandler(boolean storeLineNumberToAttribute) {
    this.storeLineNumberToAttribute = storeLineNumberToAttribute;
  }

  public Document getDocument() {
    return document;
  }

  @Override
  public void setDocumentLocator(Locator locator) {
    // Receive a Locator object
    this.locator = locator;
  }

  @Override
  public void startDocument() {
    builder = XmlDocumentBuilder.builder();
  }

  @Override
  public void startElement(String uri, String localName, String qName, Attributes attributes) {
    builder.pushElement(qName);

    XmlUtils.asStream(attributes).forEach(t -> builder.attribute(t._1, t._2));

    if (storeLineNumberToAttribute) {
      builder.attribute("lineNumber", String.valueOf(locator.getLineNumber()));
    } else {
      builder.userData("lineNumber", locator.getLineNumber());
    }
  }

  @Override
  public void characters(char[] ch, int start, int length) {
    builder.appendText(new String(ch, start, length));
  }

  @Override
  public void endElement(String uri, String localName, String qName) {
    builder.pop();
  }

  @Override
  public void endDocument() {
    document = builder.build();
  }

}

package fi.vero.lakied.web;

import fi.vero.lakied.util.exception.BadRequestException;
import fi.vero.lakied.util.exception.InternalServerErrorException;
import fi.vero.lakied.util.xml.LineCountingDocumentHandler;
import fi.vero.lakied.util.xml.PostXmlMapping;
import fi.vero.lakied.util.xml.XmlUtils;
import java.io.IOException;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.dom.DOMSource;
import javax.xml.validation.Schema;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

@RestController
@RequestMapping("/api")
public class DocumentUtilsController {

  private final Schema schema;

  @Autowired
  public DocumentUtilsController(Schema schema) {
    this.schema = schema;
  }

  @PostXmlMapping("/validate")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void validate(@RequestBody Document document) {
    try {
      schema.newValidator().validate(new DOMSource(document));
    } catch (SAXException e) {
      throw new BadRequestException(e);
    } catch (IOException e) {
      throw new InternalServerErrorException(e);
    }
  }

  @PostXmlMapping(path = "/annotateLineNumbers", produces = {
      MediaType.TEXT_XML_VALUE,
      MediaType.APPLICATION_XML_VALUE})
  public Document annotateLineNumbers(@RequestBody Document document) {
    try {
      LineCountingDocumentHandler handler = new LineCountingDocumentHandler(true);
      XmlUtils.parse(XmlUtils.print(document), handler);
      return handler.getDocument();
    } catch (SAXException e) {
      throw new BadRequestException(e);
    } catch (IOException | ParserConfigurationException e) {
      throw new InternalServerErrorException(e);
    }
  }

  @PostXmlMapping(path = "/format", produces = {
      MediaType.TEXT_XML_VALUE,
      MediaType.APPLICATION_XML_VALUE})
  public String format(@RequestBody Document document) {
    document.normalizeDocument();
    XmlUtils.deleteMatching(document, "//text()[normalize-space(.) = '']");
    XmlUtils.updateMatching(document, "//text()",
        n -> n.setTextContent(n.getTextContent().trim()));
    return XmlUtils.prettyPrint(document);
  }

}

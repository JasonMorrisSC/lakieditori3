package fi.vero.lakied.web;

import fi.vero.lakied.util.exception.BadRequestException;
import fi.vero.lakied.util.exception.InternalServerErrorException;
import fi.vero.lakied.util.xml.LineCountingDocumentHandler;
import fi.vero.lakied.util.xml.PostXmlMapping;
import fi.vero.lakied.util.xml.XmlUtils;
import java.io.IOException;
import javax.xml.parsers.ParserConfigurationException;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

@RestController
@RequestMapping("/api")
public class XmlUtilsController {

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
    return XmlUtils.print(XmlUtils.format(XmlUtils.removeBlankNodes(document)));
  }


}

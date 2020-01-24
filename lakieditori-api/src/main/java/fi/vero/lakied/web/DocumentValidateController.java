package fi.vero.lakied.web;

import fi.vero.lakied.util.exception.BadRequestException;
import fi.vero.lakied.util.exception.InternalServerErrorException;
import fi.vero.lakied.util.xml.PostXmlMapping;
import java.io.IOException;
import javax.xml.transform.dom.DOMSource;
import javax.xml.validation.Schema;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

@RestController
@RequestMapping("/api/validate")
public class DocumentValidateController {

  private final Schema schema;

  public DocumentValidateController(Schema schema) {
    this.schema = schema;
  }

  @PostXmlMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void post(@RequestBody Document document) {
    try {
      schema.newValidator().validate(new DOMSource(document));
    } catch (SAXException e) {
      throw new BadRequestException(e);
    } catch (IOException e) {
      throw new InternalServerErrorException(e);
    }
  }

}

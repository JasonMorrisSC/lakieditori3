package fi.vero.lakied.util.xml;

import fi.vero.lakied.util.exception.BadRequestException;
import fi.vero.lakied.util.exception.InternalServerErrorException;
import java.io.IOException;
import javax.xml.parsers.ParserConfigurationException;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

public class XmlDocumentMessageConverter extends AbstractHttpMessageConverter<Document> {

  public XmlDocumentMessageConverter() {
    super(MediaType.APPLICATION_XML, MediaType.TEXT_XML);
  }

  @Override
  protected boolean supports(Class<?> cls) {
    return Document.class.isAssignableFrom(cls);
  }

  @Override
  protected Document readInternal(Class<? extends Document> cls, HttpInputMessage input)
      throws IOException, HttpMessageNotReadableException {
    try {
      return XmlUtils.parse(input.getBody());
    } catch (SAXException e) {
      throw new BadRequestException(e);
    } catch (ParserConfigurationException e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Override
  protected void writeInternal(Document document, HttpOutputMessage output)
      throws IOException, HttpMessageNotWritableException {
    XmlUtils.print(document, output.getBody());
  }

}

package fi.vero.lakied.service.document;

import fi.vero.lakied.util.common.User;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.exception.BadRequestException;
import fi.vero.lakied.util.exception.InternalServerErrorException;
import java.io.IOException;
import javax.xml.transform.dom.DOMSource;
import javax.xml.validation.Schema;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

public class ValidatingDocumentWriteRepository implements
    WriteRepository<String, Document> {

  private final WriteRepository<String, Document> delegate;
  private final Schema schema;

  public ValidatingDocumentWriteRepository(
      WriteRepository<String, Document> delegate, Schema schema) {
    this.delegate = delegate;
    this.schema = schema;
  }

  @Override
  public void insert(String key, Document value, User user) {
    validate(value);
    delegate.insert(key, value, user);
  }

  @Override
  public void update(String key, Document value, User user) {
    validate(value);
    delegate.update(key, value, user);
  }

  private void validate(Document value) {
    try {
      schema.newValidator().validate(new DOMSource(value));
    } catch (SAXException e) {
      throw new BadRequestException(e);
    } catch (IOException e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Override
  public void delete(String key, User user) {
    delegate.delete(key, user);
  }

}

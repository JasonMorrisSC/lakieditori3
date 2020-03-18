package fi.vero.lakied.util.xml;

import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.exception.BadRequestException;
import fi.vero.lakied.util.exception.InternalServerErrorException;
import java.io.IOException;
import javax.xml.transform.dom.DOMSource;
import javax.xml.validation.Schema;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

public class DocumentValidatingWriteRepository<K> implements WriteRepository<K, Document> {

  private final WriteRepository<K, Document> delegate;
  private final Schema schema;

  public DocumentValidatingWriteRepository(WriteRepository<K, Document> delegate, Schema schema) {
    this.delegate = delegate;
    this.schema = schema;
  }

  @Override
  public void insert(K key, Document value, User user) {
    validate(value);
    delegate.insert(key, value, user);
  }

  @Override
  public void update(K key, Document value, User user) {
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
  public void delete(K key, User user) {
    delegate.delete(key, user);
  }

}

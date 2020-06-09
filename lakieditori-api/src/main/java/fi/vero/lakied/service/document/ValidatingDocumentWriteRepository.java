package fi.vero.lakied.service.document;

import static fi.vero.lakied.service.schema.SchemaDefinitionCriteria.bySchemaName;
import static java.util.stream.Collectors.toList;

import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.exception.BadRequestException;
import fi.vero.lakied.util.exception.InternalServerErrorException;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.XmlUtils;
import java.io.IOException;
import java.util.List;
import javax.xml.transform.Source;
import javax.xml.transform.dom.DOMSource;
import javax.xml.validation.Schema;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

public class ValidatingDocumentWriteRepository implements WriteRepository<DocumentKey, Document> {

  private final Logger log = LoggerFactory.getLogger(getClass());

  private final WriteRepository<DocumentKey, Document> delegate;
  private final ReadRepository<Tuple2<String, Integer>, Tuple2<String, Document>> schemaDefinitionReadRepository;

  public ValidatingDocumentWriteRepository(
      WriteRepository<DocumentKey, Document> delegate,
      ReadRepository<Tuple2<String, Integer>, Tuple2<String, Document>> schemaDefinitionReadRepository) {
    this.delegate = delegate;
    this.schemaDefinitionReadRepository = schemaDefinitionReadRepository;
  }

  @Override
  public void insert(DocumentKey key, Document value, User user) {
    validate(key, value, user);
    delegate.insert(key, value, user);
  }

  @Override
  public void update(DocumentKey key, Document value, User user) {
    validate(key, value, user);
    delegate.update(key, value, user);
  }

  private void validate(DocumentKey key, Document value, User user) {
    List<Tuple2<String, Document>> definitions = schemaDefinitionReadRepository
        .collectValues(bySchemaName(key.schemaName), user, toList());

    if (definitions.isEmpty()) {
      log.debug("Skipping validation for {}, schema undefined", key);
    }

    Schema schema = XmlUtils.parseSchema(
        definitions.stream()
            .map(t -> t._2)
            .map(DOMSource::new)
            .toArray(Source[]::new));

    try {
      schema.newValidator().validate(new DOMSource(value));
    } catch (SAXException e) {
      throw new BadRequestException(e);
    } catch (IOException e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Override
  public void delete(DocumentKey key, User user) {
    delegate.delete(key, user);
  }

}

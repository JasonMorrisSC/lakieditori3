package fi.vero.lakied.web;

import static fi.vero.lakied.service.schema.SchemaDefinitionCriteria.bySchemaName;
import static java.util.stream.Collectors.toList;

import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.exception.BadRequestException;
import fi.vero.lakied.util.exception.InternalServerErrorException;
import fi.vero.lakied.util.exception.NotFoundException;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.PostXmlMapping;
import fi.vero.lakied.util.xml.XmlUtils;
import java.io.IOException;
import java.util.List;
import javax.xml.transform.Source;
import javax.xml.transform.dom.DOMSource;
import javax.xml.validation.Schema;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

@RestController
@RequestMapping("/api/schemas/{schemaName}/validate")
public class DocumentValidateController {

  private final ReadRepository<Tuple2<String, Integer>, Tuple2<String, Document>> schemaDefinitionReadRepository;

  @Autowired
  public DocumentValidateController(
      ReadRepository<Tuple2<String, Integer>, Tuple2<String, Document>> schemaDefinitionReadRepository) {
    this.schemaDefinitionReadRepository = schemaDefinitionReadRepository;
  }

  @PostXmlMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void validate(
      @PathVariable("schemaName") String schemaName,
      @RequestBody Document document,
      @AuthenticationPrincipal User user) {

    List<Tuple2<String, Document>> definitions = schemaDefinitionReadRepository
        .collectValues(bySchemaName(schemaName), user, toList());

    if (definitions.isEmpty()) {
      throw new NotFoundException("No schema definitions found.");
    }

    Schema schema = XmlUtils.parseSchema(
        definitions.stream()
            .map(t -> t._2)
            .map(DOMSource::new)
            .toArray(Source[]::new));

    try {
      schema.newValidator().validate(new DOMSource(document));
    } catch (SAXException e) {
      throw new BadRequestException(e);
    } catch (IOException e) {
      throw new InternalServerErrorException(e);
    }
  }

}

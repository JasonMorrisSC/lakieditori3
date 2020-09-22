package fi.vero.lakied.web;

import fi.vero.lakied.repository.schema.SchemaCriteria;
import fi.vero.lakied.repository.schema.SchemaDefinitionCriteria;
import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.PutXmlMapping;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api/schemas/{schemaName}")
public class SchemaWriteController {

  private final ReadRepository<String, Empty> schemaReadRepository;
  private final WriteRepository<String, Empty> schemaWriteRepository;
  private final ReadRepository<Tuple2<String, Integer>, Tuple2<String, Document>> schemaDefinitionReadRepository;
  private final WriteRepository<Tuple2<String, Integer>, Tuple2<String, Document>> schemaDefinitionWriteRepository;

  @Autowired
  public SchemaWriteController(
      ReadRepository<String, Empty> schemaReadRepository,
      WriteRepository<String, Empty> schemaWriteRepository,
      ReadRepository<Tuple2<String, Integer>, Tuple2<String, Document>> schemaDefinitionReadRepository,
      WriteRepository<Tuple2<String, Integer>, Tuple2<String, Document>> schemaDefinitionWriteRepository) {
    this.schemaReadRepository = schemaReadRepository;
    this.schemaWriteRepository = schemaWriteRepository;
    this.schemaDefinitionReadRepository = schemaDefinitionReadRepository;
    this.schemaDefinitionWriteRepository = schemaDefinitionWriteRepository;
  }

  @PutMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void put(
      @PathVariable("schemaName") String schemaName,
      @AuthenticationPrincipal User user) {
    if (schemaReadRepository.isEmpty(SchemaCriteria.byName(schemaName), user)) {
      schemaWriteRepository.insert(schemaName, Empty.INSTANCE, user);
    } else {
      schemaWriteRepository.update(schemaName, Empty.INSTANCE, user);
    }
  }

  @PutXmlMapping("/definitions/{definitionName}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void put(
      @PathVariable("schemaName") String schemaName,
      @PathVariable("definitionName") String definitionName,
      @RequestBody Document schemaDefinition,
      @AuthenticationPrincipal User user) {

    Optional<Tuple2<String, Integer>> optionalDefinitionKey =
        schemaDefinitionReadRepository.key(Criteria.and(
            SchemaDefinitionCriteria.bySchemaName(schemaName),
            SchemaDefinitionCriteria.byName(definitionName)), user);

    if (optionalDefinitionKey.isPresent()) {
      schemaDefinitionWriteRepository.update(
          optionalDefinitionKey.get(),
          Tuple.of(definitionName, schemaDefinition),
          user);
    } else {
      long schemaDefinitionCount = schemaDefinitionReadRepository.count(
          SchemaDefinitionCriteria.bySchemaName(schemaName), user);

      schemaDefinitionWriteRepository.insert(
          Tuple.of(schemaName, (int) schemaDefinitionCount + 1),
          Tuple.of(definitionName, schemaDefinition),
          user);
    }
  }

  @DeleteMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(
      @PathVariable("schemaName") String schemaName,
      @AuthenticationPrincipal User user) {
    schemaWriteRepository.delete(schemaName, user);
  }

}

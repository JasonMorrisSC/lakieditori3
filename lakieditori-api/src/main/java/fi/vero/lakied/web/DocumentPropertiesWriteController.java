package fi.vero.lakied.web;

import static fi.vero.lakied.service.document.DocumentPropertiesCriteria.byDocumentKey;
import static fi.vero.lakied.service.document.DocumentPropertiesCriteria.byKey;
import static fi.vero.lakied.util.criteria.Criteria.and;

import com.google.common.collect.MapDifference;
import com.google.common.collect.Maps;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple3;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.json.PostJsonMapping;
import fi.vero.lakied.util.security.User;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/schemas/{schemaName}/documents/{id}/properties")
public class DocumentPropertiesWriteController {

  private final ReadRepository<Tuple3<String, UUID, String>, String> documentPropertiesReadRepository;
  private final WriteRepository<Tuple3<String, UUID, String>, String> documentPropertiesWriteRepository;

  @Autowired
  public DocumentPropertiesWriteController(
      ReadRepository<Tuple3<String, UUID, String>, String> documentPropertiesReadRepository,
      WriteRepository<Tuple3<String, UUID, String>, String> documentPropertiesWriteRepository) {
    this.documentPropertiesReadRepository = documentPropertiesReadRepository;
    this.documentPropertiesWriteRepository = documentPropertiesWriteRepository;
  }

  @PostJsonMapping(produces = {})
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void post(
      @PathVariable("schemaName") String schemaName,
      @PathVariable("id") UUID id,
      @RequestBody Map<String, String> newProps,
      @AuthenticationPrincipal User user) {

    Map<String, String> oldProps = documentPropertiesReadRepository.collectEntries(
        byDocumentKey(schemaName, id), user, Collectors.toMap(e -> e._1._3, e -> e._2));

    MapDifference<String, String> propertiesDiff = Maps
        .difference(newProps, oldProps);

    propertiesDiff.entriesOnlyOnLeft()
        .forEach((k, v) -> documentPropertiesWriteRepository.
            insert(Tuple.of(schemaName, id, k), v, user));
    propertiesDiff.entriesDiffering()
        .forEach((k, v) -> documentPropertiesWriteRepository
            .update(Tuple.of(schemaName, id, k), v.leftValue(), user));
    propertiesDiff.entriesOnlyOnRight()
        .forEach((k, v) -> documentPropertiesWriteRepository
            .delete(Tuple.of(schemaName, id, k), user));
  }

  @PutMapping(value = "/{key}", consumes = MediaType.TEXT_PLAIN_VALUE)
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void put(
      @PathVariable("schemaName") String schemaName,
      @PathVariable("id") UUID id,
      @PathVariable("key") String key,
      @RequestBody String value,
      @AuthenticationPrincipal User user) {
    if (documentPropertiesReadRepository
        .isEmpty(and(byDocumentKey(schemaName, id), byKey(key)), user)) {
      documentPropertiesWriteRepository.insert(Tuple.of(schemaName, id, key), value, user);
    } else {
      documentPropertiesWriteRepository.update(Tuple.of(schemaName, id, key), value, user);
    }
  }

  @DeleteMapping("/{key}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(
      @PathVariable("schemaName") String schemaName,
      @PathVariable("id") UUID id,
      @PathVariable("key") String key,
      @AuthenticationPrincipal User user) {
    documentPropertiesWriteRepository.delete(Tuple.of(schemaName, id, key), user);
  }

  @DeleteMapping()
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteAll(
      @PathVariable("schemaName") String schemaName,
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {
    documentPropertiesReadRepository.forEachKey(byDocumentKey(schemaName, id), user,
        key -> documentPropertiesWriteRepository.delete(key, user));
  }

}

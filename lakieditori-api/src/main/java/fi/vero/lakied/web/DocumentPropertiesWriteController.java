package fi.vero.lakied.web;

import static fi.vero.lakied.repository.document.DocumentPropertiesCriteria.byDocumentKey;
import static fi.vero.lakied.repository.document.DocumentPropertiesCriteria.byKey;
import static fi.vero.lakied.util.criteria.Criteria.and;

import com.google.common.collect.MapDifference;
import com.google.common.collect.Maps;
import fi.vero.lakied.repository.document.DocumentPropertyKey;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.json.PutJsonMapping;
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

  private final ReadRepository<DocumentPropertyKey, String> documentPropertiesReadRepository;
  private final WriteRepository<DocumentPropertyKey, String> documentPropertiesWriteRepository;

  @Autowired
  public DocumentPropertiesWriteController(
      ReadRepository<DocumentPropertyKey, String> documentPropertiesReadRepository,
      WriteRepository<DocumentPropertyKey, String> documentPropertiesWriteRepository) {
    this.documentPropertiesReadRepository = documentPropertiesReadRepository;
    this.documentPropertiesWriteRepository = documentPropertiesWriteRepository;
  }

  @PutJsonMapping(produces = {})
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void put(
      @PathVariable("schemaName") String schemaName,
      @PathVariable("id") UUID id,
      @RequestBody Map<String, String> newProps,
      @AuthenticationPrincipal User user) {

    Map<String, String> oldProps = documentPropertiesReadRepository.collectEntries(
        byDocumentKey(schemaName, id), user, Collectors.toMap(e -> e._1.key, e -> e._2));

    MapDifference<String, String> propertiesDiff = Maps
        .difference(newProps, oldProps);

    propertiesDiff.entriesOnlyOnLeft()
        .forEach((k, v) -> documentPropertiesWriteRepository.
            insert(DocumentPropertyKey.of(schemaName, id, k), v, user));
    propertiesDiff.entriesDiffering()
        .forEach((k, v) -> documentPropertiesWriteRepository
            .update(DocumentPropertyKey.of(schemaName, id, k), v.leftValue(), user));
    propertiesDiff.entriesOnlyOnRight()
        .forEach((k, v) -> documentPropertiesWriteRepository
            .delete(DocumentPropertyKey.of(schemaName, id, k), user));
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
      documentPropertiesWriteRepository
          .insert(DocumentPropertyKey.of(schemaName, id, key), value, user);
    } else {
      documentPropertiesWriteRepository
          .update(DocumentPropertyKey.of(schemaName, id, key), value, user);
    }
  }

  @DeleteMapping("/{key}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(
      @PathVariable("schemaName") String schemaName,
      @PathVariable("id") UUID id,
      @PathVariable("key") String key,
      @AuthenticationPrincipal User user) {
    documentPropertiesWriteRepository.delete(DocumentPropertyKey.of(schemaName, id, key), user);
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

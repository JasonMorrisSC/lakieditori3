package fi.vero.lakied.web;

import static fi.vero.lakied.service.document.DocumentPropertiesCriteria.byDocumentId;
import static fi.vero.lakied.service.document.DocumentPropertiesCriteria.byKey;
import static fi.vero.lakied.util.criteria.Criteria.and;

import com.google.common.collect.MapDifference;
import com.google.common.collect.Maps;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
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
@RequestMapping("/api/documents/{id}/properties")
public class DocumentPropertiesWriteController {

  private final ReadRepository<Tuple2<UUID, String>, String> documentPropertiesReadRepository;
  private final WriteRepository<Tuple2<UUID, String>, String> documentPropertiesWriteRepository;

  @Autowired
  public DocumentPropertiesWriteController(
      ReadRepository<Tuple2<UUID, String>, String> documentPropertiesReadRepository,
      WriteRepository<Tuple2<UUID, String>, String> documentPropertiesWriteRepository) {
    this.documentPropertiesReadRepository = documentPropertiesReadRepository;
    this.documentPropertiesWriteRepository = documentPropertiesWriteRepository;
  }

  @PostJsonMapping(produces = {})
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void post(
      @PathVariable("id") UUID id,
      @RequestBody Map<String, String> newProps,
      @AuthenticationPrincipal User user) {

    Map<String, String> oldProps = documentPropertiesReadRepository.collectEntries(
        byDocumentId(id), user, Collectors.toMap(e -> e._1._2, e -> e._2));

    MapDifference<String, String> propertiesDiff = Maps
        .difference(newProps, oldProps);

    propertiesDiff.entriesOnlyOnLeft()
        .forEach((k, v) -> documentPropertiesWriteRepository.
            insert(Tuple.of(id, k), v, user));
    propertiesDiff.entriesDiffering()
        .forEach((k, v) -> documentPropertiesWriteRepository
            .update(Tuple.of(id, k), v.leftValue(), user));
    propertiesDiff.entriesOnlyOnRight()
        .forEach((k, v) -> documentPropertiesWriteRepository
            .delete(Tuple.of(id, k), user));
  }

  @PutMapping(value = "/{key}", consumes = MediaType.TEXT_PLAIN_VALUE)
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void put(
      @PathVariable("id") UUID id,
      @PathVariable("key") String key,
      @RequestBody String value,
      @AuthenticationPrincipal User user) {
    if (documentPropertiesReadRepository.isEmpty(and(byDocumentId(id), byKey(key)), user)) {
      documentPropertiesWriteRepository.insert(Tuple.of(id, key), value, user);
    } else {
      documentPropertiesWriteRepository.update(Tuple.of(id, key), value, user);
    }
  }

  @DeleteMapping("/{key}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(
      @PathVariable("id") UUID id,
      @PathVariable("key") String key,
      @AuthenticationPrincipal User user) {
    documentPropertiesWriteRepository.delete(Tuple.of(id, key), user);
  }

  @DeleteMapping()
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteAll(
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {
    documentPropertiesReadRepository.collectKeys(byDocumentId(id), user, Collectors.toList())
        .forEach(key -> documentPropertiesWriteRepository.delete(key, user));
  }

}

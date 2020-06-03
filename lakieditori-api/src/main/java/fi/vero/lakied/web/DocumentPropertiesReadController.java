package fi.vero.lakied.web;

import static fi.vero.lakied.service.document.DocumentPropertiesCriteria.byDocumentId;
import static fi.vero.lakied.service.document.DocumentPropertiesCriteria.byKey;
import static fi.vero.lakied.util.criteria.Criteria.and;

import fi.vero.lakied.service.document.DocumentCriteria;
import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.exception.NotFoundException;
import fi.vero.lakied.util.json.GetJsonMapping;
import fi.vero.lakied.util.security.User;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api/documents/{id}/properties")
public class DocumentPropertiesReadController {

  private final ReadRepository<UUID, Audited<Document>> documentReadRepository;
  private final ReadRepository<Tuple2<UUID, String>, String> documentPropertiesReadRepository;

  @Autowired
  public DocumentPropertiesReadController(
      ReadRepository<UUID, Audited<Document>> documentReadRepository,
      ReadRepository<Tuple2<UUID, String>, String> documentPropertiesReadRepository) {
    this.documentReadRepository = documentReadRepository;
    this.documentPropertiesReadRepository = documentPropertiesReadRepository;
  }

  @GetJsonMapping
  public Map<String, String> get(
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {

    if (documentReadRepository.isEmpty(DocumentCriteria.byId(id), user)) {
      throw new NotFoundException();
    }

    return documentPropertiesReadRepository.collectEntries(
        byDocumentId(id), user, Collectors.toMap(e -> e._1._2, e -> e._2));
  }

  @GetMapping(value = "/{key}", produces = MediaType.TEXT_PLAIN_VALUE)
  public String get(
      @PathVariable("id") UUID id,
      @PathVariable("key") String key,
      @AuthenticationPrincipal User user) {
    return documentPropertiesReadRepository
        .value(and(byDocumentId(id), byKey(key)), user)
        .orElseThrow(NotFoundException::new);
  }

}

package fi.vero.lakied.web;

import static fi.vero.lakied.service.document.DocumentPropertiesCriteria.byDocumentKey;

import fi.vero.lakied.service.document.DocumentCriteria;
import fi.vero.lakied.service.document.DocumentKey;
import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple3;
import fi.vero.lakied.util.exception.NotFoundException;
import fi.vero.lakied.util.json.GetJsonMapping;
import fi.vero.lakied.util.security.User;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api/schemas/{schemaName}/documents/{id}/properties")
public class DocumentPropertiesReadController {

  private final ReadRepository<DocumentKey, Audited<Document>> documentReadRepository;
  private final ReadRepository<Tuple3<String, UUID, String>, String> documentPropertiesReadRepository;

  @Autowired
  public DocumentPropertiesReadController(
      ReadRepository<DocumentKey, Audited<Document>> documentReadRepository,
      ReadRepository<Tuple3<String, UUID, String>, String> documentPropertiesReadRepository) {
    this.documentReadRepository = documentReadRepository;
    this.documentPropertiesReadRepository = documentPropertiesReadRepository;
  }

  @GetJsonMapping
  public Map<String, String> get(
      @PathVariable("schemaName") String schemaName,
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {

    if (documentReadRepository.isEmpty(DocumentCriteria.byKey(schemaName, id), user)) {
      throw new NotFoundException();
    }

    return documentPropertiesReadRepository.collectEntries(
        byDocumentKey(schemaName, id), user, Collectors.toMap(e -> e._1._3, e -> e._2));
  }

}

package fi.vero.lakied.web;

import static fi.vero.lakied.repository.document.DocumentLockCriteria.byDocumentKey;

import fi.vero.lakied.repository.document.DocumentKey;
import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.exception.NotFoundException;
import fi.vero.lakied.util.security.User;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/schemas/{schemaName}/documents/{id}/lock")
public class DocumentLockReadController {

  private final Logger log = LoggerFactory.getLogger(getClass());

  private final User documentLockHelper = User.superuser("document-lock-helper");

  private final ReadRepository<DocumentKey, Tuple2<String, LocalDateTime>> documentLockReadRepository;
  private final WriteRepository<DocumentKey, Empty> documentLockWriteRepository;

  @Autowired
  public DocumentLockReadController(
      ReadRepository<DocumentKey, Tuple2<String, LocalDateTime>> documentLockReadRepository,
      WriteRepository<DocumentKey, Empty> documentLockWriteRepository) {
    this.documentLockReadRepository = documentLockReadRepository;
    this.documentLockWriteRepository = documentLockWriteRepository;
  }

  @GetMapping
  public String get(
      @PathVariable("schemaName") String schemaName,
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {

    removeLockIfExpired(schemaName, id);

    return documentLockReadRepository.value(byDocumentKey(schemaName, id), user)
        .map(t -> t._1)
        .orElseThrow(NotFoundException::new);
  }

  private void removeLockIfExpired(String schemaName, UUID id) {
    boolean isExpired = documentLockReadRepository
        .value(byDocumentKey(schemaName, id), documentLockHelper)
        .map(lock -> lock._2)
        .map(lockDate -> ChronoUnit.MINUTES.between(lockDate, LocalDateTime.now()) > 10)
        .orElse(false);

    if (isExpired) {
      log.debug("Removing expired lock for: " + id);
      documentLockWriteRepository.delete(DocumentKey.of(schemaName, id), documentLockHelper);
    }
  }

}

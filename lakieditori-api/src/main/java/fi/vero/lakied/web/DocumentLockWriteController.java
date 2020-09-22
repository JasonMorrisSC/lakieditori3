package fi.vero.lakied.web;

import static fi.vero.lakied.repository.document.DocumentLockCriteria.byDocumentKey;
import static fi.vero.lakied.repository.document.DocumentLockCriteria.byUsername;
import static fi.vero.lakied.util.criteria.Criteria.and;

import fi.vero.lakied.repository.document.DocumentKey;
import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.exception.BadRequestException;
import fi.vero.lakied.util.security.User;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/schemas/{schemaName}/documents/{id}/lock")
public class DocumentLockWriteController {

  private final Logger log = LoggerFactory.getLogger(getClass());

  private final ReadRepository<DocumentKey, Tuple2<String, LocalDateTime>> documentLockReadRepository;
  private final WriteRepository<DocumentKey, Empty> documentLockWriteRepository;

  @Autowired
  public DocumentLockWriteController(
      ReadRepository<DocumentKey, Tuple2<String, LocalDateTime>> documentLockReadRepository,
      WriteRepository<DocumentKey, Empty> documentLockWriteRepository) {
    this.documentLockReadRepository = documentLockReadRepository;
    this.documentLockWriteRepository = documentLockWriteRepository;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void acquire(
      @PathVariable("schemaName") String schemaName,
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {

    DocumentKey documentKey = DocumentKey.of(schemaName, id);

    Optional<Tuple2<String, LocalDateTime>> lock = documentLockReadRepository
        .value(byDocumentKey(schemaName, id), User.superuser("document-lock-helper"));

    if (!lock.isPresent()) {
      log.debug("User {} acquired lock for {}", user.getUsername(), documentKey);
      documentLockWriteRepository.insert(documentKey, Empty.INSTANCE, user);
      return;
    }

    if (Objects.equals(lock.get()._1, user.getUsername())) {
      log.debug("User {} refreshed lock for {}", user.getUsername(), documentKey);
      documentLockWriteRepository.update(documentKey, Empty.INSTANCE, user);
      return;
    }

    throw new BadRequestException("Can't acquire document lock for: " + documentKey);
  }

  @DeleteMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void release(
      @PathVariable("schemaName") String schemaName,
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {
    if (!documentLockReadRepository.isEmpty(
        and(byDocumentKey(schemaName, id), byUsername(user.getUsername())), user)) {
      log.debug("User {} released lock for {}", user.getUsername(), id);
      documentLockWriteRepository.delete(DocumentKey.of(schemaName, id), user);
    }
  }

  @DeleteMapping(params = "force=true")
  public void forceRelease(
      @PathVariable("schemaName") String schemaName,
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {
    documentLockWriteRepository.delete(DocumentKey.of(schemaName, id), user);
  }

}

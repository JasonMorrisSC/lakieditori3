package fi.vero.lakied.web;

import static fi.vero.lakied.service.document.DocumentLockCriteria.byDocumentId;
import static fi.vero.lakied.service.document.DocumentLockCriteria.byUsername;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.criteria.Criteria;
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
@RequestMapping("/api/documents/{documentId}/lock")
public class DocumentLockWriteController {

  private final Logger log = LoggerFactory.getLogger(getClass());

  private final ReadRepository<UUID, Tuple2<String, LocalDateTime>> documentLockReadRepository;
  private final WriteRepository<UUID, Empty> documentLockWriteRepository;

  @Autowired
  public DocumentLockWriteController(
      ReadRepository<UUID, Tuple2<String, LocalDateTime>> documentLockReadRepository,
      WriteRepository<UUID, Empty> documentLockWriteRepository) {
    this.documentLockReadRepository = documentLockReadRepository;
    this.documentLockWriteRepository = documentLockWriteRepository;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void acquire(
      @PathVariable("documentId") UUID documentId,
      @AuthenticationPrincipal User user) {

    Optional<Tuple2<String, LocalDateTime>> lock = documentLockReadRepository
        .value(byDocumentId(documentId), User.superuser("document-lock-helper"));

    if (!lock.isPresent()) {
      log.debug("User {} acquired lock for {}", user.getUsername(), documentId);
      documentLockWriteRepository.insert(documentId, Empty.INSTANCE, user);
      return;
    }

    if (Objects.equals(lock.get()._1, user.getUsername())) {
      log.debug("User {} refreshed lock for {}", user.getUsername(), documentId);
      documentLockWriteRepository.update(documentId, Empty.INSTANCE, user);
      return;
    }

    throw new BadRequestException("Can't acquire document lock for: " + documentId);
  }

  @DeleteMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void release(
      @PathVariable("documentId") UUID documentId,
      @AuthenticationPrincipal User user) {
    if (!documentLockReadRepository.isEmpty(
        Criteria.and(byDocumentId(documentId), byUsername(user.getUsername())), user)) {
      log.debug("User {} released lock for {}", user.getUsername(), documentId);
      documentLockWriteRepository.delete(documentId, user);
    }
  }

  @DeleteMapping(params = "force=true")
  public void forceRelease(
      @PathVariable("documentId") UUID documentId,
      @AuthenticationPrincipal User user) {
    documentLockWriteRepository.delete(documentId, user);
  }

}

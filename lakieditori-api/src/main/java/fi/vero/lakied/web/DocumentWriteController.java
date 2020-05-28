package fi.vero.lakied.web;

import static fi.vero.lakied.service.document.DocumentLockCriteria.byDocumentId;
import static fi.vero.lakied.util.security.User.superuser;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.Tuple3;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.exception.BadRequestException;
import fi.vero.lakied.util.exception.NotFoundException;
import fi.vero.lakied.util.security.Permission;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.PostXmlMapping;
import fi.vero.lakied.util.xml.PutXmlMapping;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api/documents")
public class DocumentWriteController {

  private final ReadRepository<UUID, Tuple2<String, LocalDateTime>> documentLockReadRepository;
  private final WriteRepository<UUID, Document> documentWriteRepository;
  private final WriteRepository<UUID, Document> documentVersionWriteRepository;
  private final WriteRepository<Tuple3<UUID, String, Permission>, Empty> documentUserPermissionWriteRepository;
  private final User documentPermissionInitializer = superuser("documentPermissionInitializer");

  @Autowired
  public DocumentWriteController(
      ReadRepository<UUID, Tuple2<String, LocalDateTime>> documentLockReadRepository,
      WriteRepository<UUID, Document> documentWriteRepository,
      WriteRepository<UUID, Document> documentVersionWriteRepository,
      WriteRepository<Tuple3<UUID, String, Permission>, Empty> documentUserPermissionWriteRepository) {
    this.documentLockReadRepository = documentLockReadRepository;
    this.documentWriteRepository = documentWriteRepository;
    this.documentVersionWriteRepository = documentVersionWriteRepository;
    this.documentUserPermissionWriteRepository = documentUserPermissionWriteRepository;
  }

  @PostXmlMapping
  @ResponseStatus(HttpStatus.CREATED)
  public void post(
      @RequestBody Document document,
      @AuthenticationPrincipal User user,
      HttpServletResponse response) {
    UUID id = UUID.randomUUID();

    documentWriteRepository.insert(id, document, user);
    documentVersionWriteRepository.insert(id, document, user);

    // add read and write permissions to the new document
    documentUserPermissionWriteRepository.insert(
        Tuple.of(id, user.getUsername(), Permission.READ), Empty.INSTANCE,
        documentPermissionInitializer);
    documentUserPermissionWriteRepository.insert(
        Tuple.of(id, user.getUsername(), Permission.UPDATE), Empty.INSTANCE,
        documentPermissionInitializer);
    documentUserPermissionWriteRepository.insert(
        Tuple.of(id, user.getUsername(), Permission.DELETE), Empty.INSTANCE,
        documentPermissionInitializer);

    String resultUrl = "/api/documents/" + id;
    response.setHeader(HttpHeaders.LOCATION, resultUrl);
    response.setHeader("Refresh", "0;url=" + resultUrl);
  }

  @PutXmlMapping(path = "/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void put(
      @PathVariable("id") UUID id,
      @RequestBody Document document,
      @AuthenticationPrincipal User user) {
    tryUpdateLocked(id, user, () -> {
      documentWriteRepository.update(id, document, user);
      documentVersionWriteRepository.insert(id, document, user);
    });
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {
    tryUpdateLocked(id, user, () -> {
      documentWriteRepository.delete(id, user);
      documentVersionWriteRepository.insert(id, null, user);
    });
  }

  private void tryUpdateLocked(UUID id, User user, Runnable updateOperation) {
    Optional<Tuple2<String, LocalDateTime>> lock =
        documentLockReadRepository.value(byDocumentId(id), superuser("document-lock-helper"));
    Optional<Tuple2<String, LocalDateTime>> lockReadableToUser =
        documentLockReadRepository.value(byDocumentId(id), user);

    if (lockReadableToUser.isPresent() &&
        !Objects.equals(lockReadableToUser.get()._1, user.getUsername())) {
      throw new BadRequestException("Document is locked by: " + lockReadableToUser.get()._1);
    }

    if (lock.isPresent() && !Objects.equals(lock.get()._1, user.getUsername())) {
      // resource is locked but user has no read permission for the lock (or the document for that matter)
      throw new NotFoundException();
    }

    updateOperation.run();
  }

}

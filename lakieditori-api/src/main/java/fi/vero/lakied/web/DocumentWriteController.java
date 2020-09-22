package fi.vero.lakied.web;

import static fi.vero.lakied.repository.document.DocumentLockCriteria.byDocumentKey;
import static fi.vero.lakied.util.security.User.superuser;

import fi.vero.lakied.repository.document.DocumentKey;
import fi.vero.lakied.repository.schema.SchemaCriteria;
import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.Tuple4;
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
@RequestMapping("/api/schemas/{schemaName}/documents")
public class DocumentWriteController {

  private final ReadRepository<String, Empty> schemaReadRepository;
  private final ReadRepository<DocumentKey, Tuple2<String, LocalDateTime>> documentLockReadRepository;
  private final WriteRepository<DocumentKey, Document> documentWriteRepository;
  private final WriteRepository<DocumentKey, Document> documentVersionWriteRepository;
  private final WriteRepository<Tuple4<String, UUID, String, Permission>, Empty> documentUserPermissionWriteRepository;
  private final User documentPermissionInitializer = superuser("documentPermissionInitializer");
  private final User documentLockHelper = superuser("documentLockHelper");

  @Autowired
  public DocumentWriteController(
      ReadRepository<String, Empty> schemaReadRepository,
      ReadRepository<DocumentKey, Tuple2<String, LocalDateTime>> documentLockReadRepository,
      WriteRepository<DocumentKey, Document> documentWriteRepository,
      WriteRepository<DocumentKey, Document> documentVersionWriteRepository,
      WriteRepository<Tuple4<String, UUID, String, Permission>, Empty> documentUserPermissionWriteRepository) {
    this.schemaReadRepository = schemaReadRepository;
    this.documentLockReadRepository = documentLockReadRepository;
    this.documentWriteRepository = documentWriteRepository;
    this.documentVersionWriteRepository = documentVersionWriteRepository;
    this.documentUserPermissionWriteRepository = documentUserPermissionWriteRepository;
  }

  @PostXmlMapping
  @ResponseStatus(HttpStatus.CREATED)
  public void post(
      @PathVariable("schemaName") String schemaName,
      @RequestBody Document document,
      @AuthenticationPrincipal User user,
      HttpServletResponse response) {
    UUID id = UUID.randomUUID();

    if (schemaReadRepository.isEmpty(SchemaCriteria.byName(schemaName), user)) {
      throw new NotFoundException("Schema not found");
    }

    documentWriteRepository.insert(DocumentKey.of(schemaName, id), document, user);
    documentVersionWriteRepository.insert(DocumentKey.of(schemaName, id), document, user);

    // add read and write permissions to the new document
    documentUserPermissionWriteRepository.insert(
        Tuple.of(schemaName, id, user.getUsername(), Permission.READ), Empty.INSTANCE,
        documentPermissionInitializer);
    documentUserPermissionWriteRepository.insert(
        Tuple.of(schemaName, id, user.getUsername(), Permission.UPDATE), Empty.INSTANCE,
        documentPermissionInitializer);
    documentUserPermissionWriteRepository.insert(
        Tuple.of(schemaName, id, user.getUsername(), Permission.DELETE), Empty.INSTANCE,
        documentPermissionInitializer);

    String resultUrl = "/api/documents/" + schemaName + "/" + id;
    response.setHeader(HttpHeaders.LOCATION, resultUrl);
    response.setHeader("Refresh", "0;url=" + resultUrl);
  }

  @PutXmlMapping(path = "/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void put(
      @PathVariable("schemaName") String schemaName,
      @PathVariable("id") UUID id,
      @RequestBody Document document,
      @AuthenticationPrincipal User user) {

    if (schemaReadRepository.isEmpty(SchemaCriteria.byName(schemaName), user)) {
      throw new NotFoundException("Schema not found");
    }

    tryUpdateLocked(schemaName, id, user, () -> {
      documentWriteRepository.update(DocumentKey.of(schemaName, id), document, user);
      documentVersionWriteRepository.insert(DocumentKey.of(schemaName, id), document, user);
    });
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(
      @PathVariable("schemaName") String schemaName,
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {

    if (schemaReadRepository.isEmpty(SchemaCriteria.byName(schemaName), user)) {
      throw new NotFoundException("Schema not found");
    }

    tryUpdateLocked(schemaName, id, user, () -> {
      documentWriteRepository.delete(DocumentKey.of(schemaName, id), user);
      documentVersionWriteRepository.insert(DocumentKey.of(schemaName, id), null, user);
    });
  }

  private void tryUpdateLocked(String schemaName, UUID id, User user,
      Runnable updateOperation) {
    Optional<Tuple2<String, LocalDateTime>> lock =
        documentLockReadRepository.value(byDocumentKey(schemaName, id), documentLockHelper);
    Optional<Tuple2<String, LocalDateTime>> lockReadableToUser =
        documentLockReadRepository.value(byDocumentKey(schemaName, id), user);

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

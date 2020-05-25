package fi.vero.lakied.web;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/documents/{documentId}/lock")
public class DocumentLockWriteController {

  private final WriteRepository<UUID, Empty> documentLockWriteRepository;

  @Autowired
  public DocumentLockWriteController(WriteRepository<UUID, Empty> documentLockWriteRepository) {
    this.documentLockWriteRepository = documentLockWriteRepository;
  }

  @PostMapping
  public void acquire(
      @PathVariable("documentId") UUID documentId,
      @AuthenticationPrincipal User user) {
    documentLockWriteRepository.insert(documentId, Empty.INSTANCE, user);
  }

  @DeleteMapping
  public void release(
      @PathVariable("documentId") UUID documentId,
      @AuthenticationPrincipal User user) {
    documentLockWriteRepository.delete(documentId, user);
  }

}

package fi.vero.lakied.web;

import static org.springframework.http.HttpStatus.NO_CONTENT;

import fi.vero.lakied.service.document.DocumentLockCriteria;
import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.exception.NotFoundException;
import fi.vero.lakied.util.security.User;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/documents/{documentId}/lock")
public class DocumentLockReadController {

  private final ReadRepository<UUID, Empty> documentLockReadRepository;

  @Autowired
  public DocumentLockReadController(ReadRepository<UUID, Empty> documentLockReadRepository) {
    this.documentLockReadRepository = documentLockReadRepository;
  }

  @GetMapping
  @ResponseStatus(NO_CONTENT)
  public void get(
      @PathVariable("documentId") UUID documentId,
      @AuthenticationPrincipal User user) {
    if (documentLockReadRepository.isEmpty(DocumentLockCriteria.byId(documentId), user)) {
      throw new NotFoundException();
    }
  }

}

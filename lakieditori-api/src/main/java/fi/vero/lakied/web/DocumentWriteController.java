package fi.vero.lakied.web;

import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple3;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.Permission;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.PostXmlMapping;
import fi.vero.lakied.util.xml.PutXmlMapping;
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

  private final WriteRepository<UUID, Document> documentWriteRepository;
  private final WriteRepository<UUID, Document> documentVersionWriteRepository;
  private final WriteRepository<Tuple3<UUID, String, Permission>, Empty> documentUserPermissionWriteRepository;
  private final User documentPermissionInitializer = User
      .superuser("documentPermissionInitializer");

  @Autowired
  public DocumentWriteController(
      WriteRepository<UUID, Document> documentWriteRepository,
      WriteRepository<UUID, Document> documentVersionWriteRepository,
      WriteRepository<Tuple3<UUID, String, Permission>, Empty> documentUserPermissionWriteRepository) {
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
    documentWriteRepository.update(id, document, user);
    documentVersionWriteRepository.insert(id, document, user);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {
    documentWriteRepository.delete(id, user);
    documentVersionWriteRepository.insert(id, null, user);
  }

}

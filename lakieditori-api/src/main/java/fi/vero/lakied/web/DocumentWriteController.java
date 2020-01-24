package fi.vero.lakied.web;

import fi.vero.lakied.util.common.User;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.xml.PostXmlMapping;
import fi.vero.lakied.util.xml.PutXmlMapping;
import javax.servlet.http.HttpServletResponse;
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

  private final WriteRepository<String, Document> documentWriteRepository;

  public DocumentWriteController(
      WriteRepository<String, Document> documentWriteRepository) {
    this.documentWriteRepository = documentWriteRepository;
  }

  @PostXmlMapping
  @ResponseStatus(HttpStatus.CREATED)
  public void post(
      @RequestBody Document document,
      @AuthenticationPrincipal User user,
      HttpServletResponse response) {
    String id = document.getDocumentElement()
        .getAttribute("number")
        .replaceAll("[./]", "_");

    documentWriteRepository.insert(id, document, user);

    String resultUrl = "/api/documents/" + id;
    response.setHeader(HttpHeaders.LOCATION, resultUrl);
    response.setHeader("Refresh", "0;url=" + resultUrl);
  }

  @PutXmlMapping(path = "/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void put(
      @PathVariable("id") String id,
      @RequestBody Document document,
      @AuthenticationPrincipal User user) {
    documentWriteRepository.update(id, document, user);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(
      @PathVariable("id") String id,
      @AuthenticationPrincipal User user) {
    documentWriteRepository.delete(id, user);
  }

}

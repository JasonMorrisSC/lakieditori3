package fi.vero.lakied.web;

import fi.vero.lakied.service.document.DocumentCriteria;
import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.User;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.exception.NotFoundException;
import fi.vero.lakied.util.xml.GetXmlMapping;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import java.util.stream.Stream;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

@RestController
@RequestMapping("/api/documents")
public class DocumentReadController {

  private final ReadRepository<String, Audited<Document>> documentReadRepository;

  public DocumentReadController(ReadRepository<String, Audited<Document>> documentReadRepository) {
    this.documentReadRepository = documentReadRepository;
  }

  @GetXmlMapping("/{id}")
  public Document get(
      @PathVariable("id") String id,
      @AuthenticationPrincipal User user) {
    try (Stream<Audited<Document>> documents = documentReadRepository
        .values(DocumentCriteria.byId(id), user)) {
      Audited<Document> auditedDocument = documents.findAny().orElseThrow(NotFoundException::new);

      Document document = auditedDocument.value;
      Element rootElement = document.getDocumentElement();
      rootElement.setAttribute("createdBy", auditedDocument.createdBy);
      rootElement.setAttribute("createdDate", auditedDocument.createdDate.toString());
      rootElement.setAttribute("lastModifiedBy", auditedDocument.lastModifiedBy);
      rootElement.setAttribute("lastModifiedDate", auditedDocument.lastModifiedDate.toString());

      return document;
    }
  }

  @GetXmlMapping
  public Document get(@AuthenticationPrincipal User user) {
    XmlDocumentBuilder builder = new XmlDocumentBuilder().pushElement("documents");

    documentReadRepository.forEachEntry(Criteria.matchAll(), user,
        (id, document) -> builder.pushExternal(document.value.getDocumentElement()).pop());

    return builder.build();
  }

}

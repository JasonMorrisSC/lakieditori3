package fi.vero.lakied.web;

import fi.vero.lakied.service.document.DocumentCriteria;
import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.exception.NotFoundException;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.GetXmlMapping;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api/documents")
public class DocumentReadController {

  private final ReadRepository<UUID, Audited<Document>> documentReadRepository;

  @Autowired
  public DocumentReadController(
      ReadRepository<UUID, Audited<Document>> documentReadRepository) {
    this.documentReadRepository = documentReadRepository;
  }

  @GetXmlMapping
  public Document getAll(@AuthenticationPrincipal User user) {
    XmlDocumentBuilder builder = XmlDocumentBuilder.builder().pushElement("documents");

    documentReadRepository.forEachEntry(Criteria.matchAll(), user, (id, auditedDocument) ->
        builder.pushExternal(auditedDocument.value)
            .attribute("id", id.toString())
            .attribute("createdBy", auditedDocument.createdBy)
            .attribute("createdDate", auditedDocument.createdDate.toString())
            .attribute("lastModifiedBy", auditedDocument.lastModifiedBy)
            .attribute("lastModifiedDate", auditedDocument.lastModifiedDate.toString())
            .pop());

    return builder.build();
  }

  @GetXmlMapping("/{id}")
  public Document get(
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {
    return documentReadRepository
        .value(DocumentCriteria.byId(id), user)
        .map(auditedDocument -> XmlDocumentBuilder.builder()
            .pushExternal(auditedDocument.value)
            .attribute("id", id.toString())
            .attribute("createdBy", auditedDocument.createdBy)
            .attribute("createdDate", auditedDocument.createdDate.toString())
            .attribute("lastModifiedBy", auditedDocument.lastModifiedBy)
            .attribute("lastModifiedDate", auditedDocument.lastModifiedDate.toString())
            .build())
        .orElseThrow(NotFoundException::new);
  }

}

package fi.vero.lakied.web;

import fi.vero.lakied.repository.document.DocumentCriteria;
import fi.vero.lakied.repository.document.DocumentKey;
import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.ReadRepository;
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
@RequestMapping("/api/schemas/{schemaName}/documents")
public class DocumentReadController {

  private final ReadRepository<DocumentKey, Audited<Document>> documentReadRepository;

  @Autowired
  public DocumentReadController(
      ReadRepository<DocumentKey, Audited<Document>> documentReadRepository) {
    this.documentReadRepository = documentReadRepository;
  }

  @GetXmlMapping
  public Document getAll(
      @PathVariable("schemaName") String schemaName,
      @AuthenticationPrincipal User user) {

    XmlDocumentBuilder builder = XmlDocumentBuilder.builder().pushElement("documents");

    documentReadRepository.forEachEntry(DocumentCriteria.bySchemaName(schemaName), user,
        (key, auditedDocument) ->
            builder.pushExternal(auditedDocument.value)
                .attribute("id", key.id.toString())
                .attribute("createdBy", auditedDocument.createdBy)
                .attribute("createdDate", auditedDocument.createdDate.toString())
                .attribute("lastModifiedBy", auditedDocument.lastModifiedBy)
                .attribute("lastModifiedDate", auditedDocument.lastModifiedDate.toString())
                .pop());

    return builder.build();
  }

  @GetXmlMapping("/{id}")
  public Document get(
      @PathVariable("schemaName") String schemaName,
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {
    return documentReadRepository
        .value(DocumentCriteria.byKey(schemaName, id), user)
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

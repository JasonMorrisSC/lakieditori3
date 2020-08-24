package fi.vero.lakied.web;

import fi.vero.lakied.service.document.DocumentCriteria;
import fi.vero.lakied.service.document.DocumentKey;
import fi.vero.lakied.service.transformation.TransformationCriteria;
import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.exception.NotFoundException;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.GetXmlMapping;
import fi.vero.lakied.util.xml.XmlUtils;
import java.util.Optional;
import java.util.UUID;
import javax.xml.transform.dom.DOMSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api/schemas/{schemaName}/documents")
public class TransformingDocumentReadController {

  private final ReadRepository<String, Document> transformationReadRepository;
  private final ReadRepository<DocumentKey, Audited<Document>> documentReadRepository;

  @Autowired
  public TransformingDocumentReadController(
      ReadRepository<String, Document> transformationReadRepository,
      ReadRepository<DocumentKey, Audited<Document>> documentReadRepository) {
    this.transformationReadRepository = transformationReadRepository;
    this.documentReadRepository = documentReadRepository;
  }

  @GetXmlMapping(path = "/{id}", params = "transformation")
  public Document get(
      @PathVariable("schemaName") String schemaName,
      @PathVariable("id") UUID id,
      @RequestParam("transformation") String transformationName,
      @AuthenticationPrincipal User user) {

    Optional<Document> transformation = transformationReadRepository
        .value(TransformationCriteria.byName(transformationName), user);

    if (!transformation.isPresent()) {
      throw new NotFoundException("Unknown transformation");
    }

    return documentReadRepository
        .value(DocumentCriteria.byKey(schemaName, id), user)
        .map(auditedDocument -> XmlUtils
            .transform(auditedDocument.value, new DOMSource(transformation.get())))
        .orElseThrow(NotFoundException::new);
  }

}

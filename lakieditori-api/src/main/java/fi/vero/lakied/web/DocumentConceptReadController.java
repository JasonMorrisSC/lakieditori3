package fi.vero.lakied.web;

import static fi.vero.lakied.service.concept.ConceptCriteria.byUri;

import com.google.common.collect.Streams;
import fi.vero.lakied.service.document.DocumentCriteria;
import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.exception.NotFoundException;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.GetXmlMapping;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import fi.vero.lakied.util.xml.XmlUtils;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

@RestController
@RequestMapping("/api/documents")
public class DocumentConceptReadController {

  private final ReadRepository<UUID, Audited<Document>> documentReadRepository;
  private final ReadRepository<String, Document> conceptReadRepository;


  @Autowired
  public DocumentConceptReadController(
      ReadRepository<UUID, Audited<Document>> documentReadRepository,
      ReadRepository<String, Document> conceptReadRepository) {
    this.documentReadRepository = documentReadRepository;
    this.conceptReadRepository = conceptReadRepository;
  }

  @GetXmlMapping("/{id}/concepts")
  public Document get(
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {

    Document document = documentReadRepository.value(DocumentCriteria.byId(id), user)
        .map(auditedDocument -> auditedDocument.value)
        .orElseThrow(NotFoundException::new);

    return XmlDocumentBuilder.builder()
        .pushElement("concepts")
        .appendExternal(XmlUtils.queryNodes(document, "//a/@href")
            .filter(node -> !node.getTextContent().isEmpty())
            .map(Node::getTextContent)
            .flatMap(uri -> Streams.stream(conceptReadRepository.value(byUri(uri), user)))
            .map(Document::getDocumentElement))
        .build();
  }

}

package fi.vero.lakied.web;

import static fi.vero.lakied.util.xml.XmlUtils.queryFirstText;

import fi.vero.lakied.service.document.DocumentCriteria;
import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.exception.NotFoundException;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.GetXmlMapping;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api/documents")
public class DocumentReadController {

  private final ReadRepository<UUID, Audited<Document>> documentReadRepository;

  @Autowired
  public DocumentReadController(ReadRepository<UUID, Audited<Document>> documentReadRepository) {
    this.documentReadRepository = documentReadRepository;
  }

  @GetXmlMapping("/{id}")
  public Document get(
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {
    try (Stream<Tuple2<UUID, Audited<Document>>> entries = documentReadRepository
        .entries(DocumentCriteria.byId(id), user)) {
      return entries
          .map(entry -> new XmlDocumentBuilder()
              .pushExternal(entry._2.value.getDocumentElement())
              .attribute("id", entry._1.toString())
              .attribute("createdBy", entry._2.createdBy)
              .attribute("createdDate", entry._2.createdDate.toString())
              .attribute("lastModifiedBy", entry._2.lastModifiedBy)
              .attribute("lastModifiedDate", entry._2.lastModifiedDate.toString())
              .build())
          .findFirst()
          .orElseThrow(NotFoundException::new);
    }
  }

  @GetXmlMapping(params = "number")
  public Document getByNumber(
      @RequestParam("number") String number,
      @AuthenticationPrincipal User user) {
    try (Stream<Tuple2<UUID, Audited<Document>>> entries = documentReadRepository
        .entries(Criteria.matchAll(), user)) {
      return entries
          .filter(entry -> number.equals(queryFirstText(entry._2.value, "/document/@number")))
          .map(entry -> new XmlDocumentBuilder()
              .pushExternal(entry._2.value.getDocumentElement())
              .attribute("id", entry._1.toString())
              .attribute("createdBy", entry._2.createdBy)
              .attribute("createdDate", entry._2.createdDate.toString())
              .attribute("lastModifiedBy", entry._2.lastModifiedBy)
              .attribute("lastModifiedDate", entry._2.lastModifiedDate.toString())
              .build())
          .findFirst()
          .orElseThrow(NotFoundException::new);
    }
  }

  @GetXmlMapping
  public Document getAll(@AuthenticationPrincipal User user) {
    XmlDocumentBuilder builder = new XmlDocumentBuilder().pushElement("documents");

    documentReadRepository.forEachEntry(Criteria.matchAll(), user, (id, auditedDocument) -> {
      builder.pushExternal(auditedDocument.value.getDocumentElement())
          .attribute("id", id.toString())
          .attribute("createdBy", auditedDocument.createdBy)
          .attribute("createdDate", auditedDocument.createdDate.toString())
          .attribute("lastModifiedBy", auditedDocument.lastModifiedBy)
          .attribute("lastModifiedDate", auditedDocument.lastModifiedDate.toString());
      builder.pop();
    });

    return builder.build();
  }

}

package fi.vero.lakied.web;

import static fi.vero.lakied.service.document.DocumentCommentsCriteria.byDocumentKey;

import fi.vero.lakied.service.document.DocumentCommentKey;
import fi.vero.lakied.service.document.DocumentCriteria;
import fi.vero.lakied.service.document.DocumentKey;
import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
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
@RequestMapping("/api/schemas/{schemaName}/documents/{id}/comments")
public class DocumentCommentsReadController {

  private final ReadRepository<DocumentKey, Audited<Document>> documentReadRepository;
  private final ReadRepository<DocumentCommentKey, Audited<Tuple2<String, String>>> documentCommentsReadRepository;

  @Autowired
  public DocumentCommentsReadController(
      ReadRepository<DocumentKey, Audited<Document>> documentReadRepository,
      ReadRepository<DocumentCommentKey, Audited<Tuple2<String, String>>> documentCommentsReadRepository) {
    this.documentReadRepository = documentReadRepository;
    this.documentCommentsReadRepository = documentCommentsReadRepository;
  }

  @GetXmlMapping
  public Document get(
      @PathVariable("schemaName") String schemaName,
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {

    if (documentReadRepository.isEmpty(DocumentCriteria.byKey(schemaName, id), user)) {
      throw new NotFoundException();
    }

    XmlDocumentBuilder builder = XmlDocumentBuilder.builder();
    builder.pushElement("comments");

    documentCommentsReadRepository
        .forEachEntry(byDocumentKey(schemaName, id), user, (key, value) ->
            builder.pushElement("comment")
                .attribute("id", key.id.toString())
                .attribute("user", value.lastModifiedBy)
                .attribute("date", value.lastModifiedDate.toString())
                .attribute("path", value.value._1)
                .text(value.value._2)
                .pop());

    return builder.build();
  }

}

package fi.vero.lakied.web;

import com.google.common.collect.MapDifference;
import com.google.common.collect.Maps;
import fi.vero.lakied.service.document.DocumentCommentKey;
import fi.vero.lakied.service.document.DocumentCommentsCriteria;
import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.PostXmlMapping;
import fi.vero.lakied.util.xml.PutXmlMapping;
import fi.vero.lakied.util.xml.XmlUtils;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
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
import org.w3c.dom.Element;

@RestController
@RequestMapping("/api/schemas/{documentSchemaName}/documents/{documentId}/comments")
public class DocumentCommentsWriteController {

  private final ReadRepository<DocumentCommentKey, Audited<Tuple2<String, String>>> documentCommentsReadRepository;
  private final WriteRepository<DocumentCommentKey, Tuple2<String, String>> documentCommentsWriteRepository;

  @Autowired
  public DocumentCommentsWriteController(
      ReadRepository<DocumentCommentKey, Audited<Tuple2<String, String>>> documentCommentsReadRepository,
      WriteRepository<DocumentCommentKey, Tuple2<String, String>> documentCommentsWriteRepository) {
    this.documentCommentsReadRepository = documentCommentsReadRepository;
    this.documentCommentsWriteRepository = documentCommentsWriteRepository;
  }

  @PutXmlMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void putAll(
      @PathVariable("documentSchemaName") String docSchemaName,
      @PathVariable("documentId") UUID docId,
      @RequestBody Document comments,
      @AuthenticationPrincipal User user) {

    Map<UUID, Tuple2<String, String>> newComments = XmlUtils
        .queryNodes(comments, "/comments/comment")
        .map(node -> (Element) node)
        .collect(Collectors.toMap(
            e -> UUID.fromString(e.getAttribute("id")),
            e -> Tuple.of(e.getAttribute("path"), e.getTextContent())));

    Map<UUID, Tuple2<String, String>> oldComments = documentCommentsReadRepository
        .collectEntries(
            DocumentCommentsCriteria.byDocumentKey(docSchemaName, docId), user,
            Collectors.toMap(
                e -> e._1.id,
                e -> e._2.value));

    MapDifference<UUID, Tuple2<String, String>> commentsDiff = Maps
        .difference(newComments, oldComments);

    // generate new IDs for new user given entries to ensure key randomness etc.
    commentsDiff.entriesOnlyOnLeft()
        .forEach((k, v) -> documentCommentsWriteRepository.
            insert(DocumentCommentKey.of(docSchemaName, docId, UUID.randomUUID()), v, user));
    commentsDiff.entriesDiffering()
        .forEach((k, v) -> documentCommentsWriteRepository
            .update(DocumentCommentKey.of(docSchemaName, docId, k), v.leftValue(), user));
    commentsDiff.entriesOnlyOnRight()
        .forEach((k, v) -> documentCommentsWriteRepository
            .delete(DocumentCommentKey.of(docSchemaName, docId, k), user));
  }

  @PostXmlMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void post(
      @PathVariable("documentSchemaName") String documentSchemaName,
      @PathVariable("documentId") UUID documentId,
      @RequestBody Document comment,
      @AuthenticationPrincipal User user,
      HttpServletResponse response) {

    UUID id = UUID.randomUUID();

    documentCommentsWriteRepository.insert(
        DocumentCommentKey.of(documentSchemaName, documentId, id),
        Tuple.of(
            XmlUtils.queryText(comment, "/comment/@path"),
            comment.getDocumentElement().getTextContent()),
        user);

    String resultUrl = "/api"
        + "/schemas/" + documentSchemaName
        + "/documents/" + documentId
        + "/comments/" + id;

    response.setHeader(HttpHeaders.LOCATION, resultUrl);
    response.setHeader("Refresh", "0;url=" + resultUrl);
  }

  @PutXmlMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void put(
      @PathVariable("documentSchemaName") String documentSchemaName,
      @PathVariable("documentId") UUID documentId,
      @PathVariable("id") UUID id,
      @RequestBody Document comment,
      @AuthenticationPrincipal User user) {
    documentCommentsWriteRepository.update(
        DocumentCommentKey.of(documentSchemaName, documentId, id),
        Tuple.of(
            XmlUtils.queryText(comment, "/comment/@path"),
            comment.getTextContent()),
        user);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(
      @PathVariable("documentSchemaName") String documentSchemaName,
      @PathVariable("documentId") UUID documentId,
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {
    documentCommentsWriteRepository
        .delete(DocumentCommentKey.of(documentSchemaName, documentId, id), user);
  }

}

package fi.vero.lakied.web;

import com.google.common.collect.Streams;
import fi.vero.lakied.service.document.DocumentCriteria;
import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.exception.BadRequestException;
import fi.vero.lakied.util.exception.InternalServerErrorException;
import fi.vero.lakied.util.exception.NotFoundException;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.GetXmlMapping;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import fi.vero.lakied.util.xml.XmlUtils;
import java.util.UUID;
import java.util.stream.LongStream;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api/documents/{id}")
public class DocumentVersionReadController {

  private final ReadRepository<UUID, Audited<Document>> documentVersionReadRepository;

  @Autowired
  public DocumentVersionReadController(
      ReadRepository<UUID, Audited<Document>> documentVersionReadRepository) {
    this.documentVersionReadRepository = documentVersionReadRepository;
  }

  @GetXmlMapping("/versions")
  public Document getDocumentVersions(
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {

    long versionCount = documentVersionReadRepository.count(DocumentCriteria.byId(id), user);

    if (versionCount == 0) {
      throw new NotFoundException();
    }

    XmlDocumentBuilder builder = XmlDocumentBuilder.builder().pushElement("documents");

    try (Stream<Tuple2<UUID, Audited<Document>>> entries = documentVersionReadRepository
        .entries(DocumentCriteria.byId(id), user)) {

      Stream<Long> indexStream = LongStream.iterate(versionCount, i -> i - 1).boxed();

      Streams
          .zip(entries, indexStream, (idValue, index) -> Tuple.of(idValue._1, index, idValue._2))
          .forEach(idIndexValue -> builder.pushElement("document")
              .attribute("id", idIndexValue._1.toString())
              .attribute("version", idIndexValue._2.toString())
              .attribute("createdBy", idIndexValue._3.createdBy)
              .attribute("createdDate", idIndexValue._3.createdDate.toString())
              .attribute("lastModifiedBy", idIndexValue._3.lastModifiedBy)
              .attribute("lastModifiedDate", idIndexValue._3.lastModifiedDate.toString())
              .appendExternal(idIndexValue._3.value != null ? XmlUtils
                  .queryNodes(idIndexValue._3.value, "/document/title") : Stream.empty())
              .pop());
    }

    return builder.build();
  }

  @GetXmlMapping("/versions/{number}")
  public Document getDocumentVersion(
      @PathVariable("id") UUID id,
      @PathVariable("number") Long number,
      @AuthenticationPrincipal User user) {

    if (number < 1) {
      throw new BadRequestException("Version number can't be less than one.");
    }

    long versionCount = documentVersionReadRepository.count(DocumentCriteria.byId(id), user);

    if (number > versionCount) {
      throw new NotFoundException();
    }

    try (Stream<Tuple2<UUID, Audited<Document>>> entries = documentVersionReadRepository
        .entries(DocumentCriteria.byId(id), user)) {

      return entries
          .skip(versionCount - number)
          .findFirst()
          .map(entry -> {
            XmlDocumentBuilder builder = XmlDocumentBuilder.builder();

            if (entry._2.value != null) {
              builder.pushExternal(entry._2.value);
            } else {
              builder.pushElement("document");
            }

            builder
                .attribute("id", entry._1.toString())
                .attribute("version", number.toString())
                .attribute("createdBy", entry._2.createdBy)
                .attribute("createdDate", entry._2.createdDate.toString())
                .attribute("lastModifiedBy", entry._2.lastModifiedBy)
                .attribute("lastModifiedDate", entry._2.lastModifiedDate.toString());

            return builder.build();
          })
          .orElseThrow(InternalServerErrorException::new);
    }
  }

  @GetXmlMapping(path = "/diff", params = {"leftVersion", "rightVersion"})
  public Document getDocumentVersionDiff(
      @PathVariable("id") UUID id,
      @RequestParam("leftVersion") Long leftVersionNumber,
      @RequestParam("rightVersion") Long rightVersionNumber,
      @AuthenticationPrincipal User user) {

    long versionCount = documentVersionReadRepository.count(DocumentCriteria.byId(id), user);

    if (versionCount == 0) {
      throw new NotFoundException();
    }

    if (leftVersionNumber > versionCount || rightVersionNumber > versionCount) {
      throw new BadRequestException();
    }

    Document left = leftVersionNumber == 0
        ? XmlUtils.parseUnchecked("<document></document>")
        : getDocumentVersion(id, leftVersionNumber, user);
    Document right = rightVersionNumber == 0
        ? XmlUtils.parseUnchecked("<document></document>")
        : getDocumentVersion(id, rightVersionNumber, user);

    XmlDocumentBuilder builder = XmlDocumentBuilder.builder()
        .pushElement("differences")
        .attribute("documentId", id.toString())
        .attribute("leftVersion", leftVersionNumber.toString())
        .attribute("rightVersion", rightVersionNumber.toString());

    XmlUtils.textDiff(left, right).forEach(difference -> {
      builder.pushExternal(difference.toDocument()).pop();
    });

    return builder.build();
  }

}

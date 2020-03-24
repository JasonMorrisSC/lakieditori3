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
import java.util.UUID;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api/documents/{id}/versions")
public class DocumentVersionReadController {

  private final ReadRepository<UUID, Audited<Document>> documentVersionReadRepository;

  @Autowired
  public DocumentVersionReadController(
      ReadRepository<UUID, Audited<Document>> documentVersionReadRepository) {
    this.documentVersionReadRepository = documentVersionReadRepository;
  }

  @GetXmlMapping
  public Document getDocumentVersions(
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {

    if (documentVersionReadRepository.count(DocumentCriteria.byId(id), user) == 0) {
      throw new NotFoundException();
    }

    XmlDocumentBuilder builder = XmlDocumentBuilder.builder().pushElement("documents");

    try (Stream<Tuple2<UUID, Audited<Document>>> entries = documentVersionReadRepository
        .entries(DocumentCriteria.byId(id), user)) {

      Stream<Integer> indexStream = IntStream.iterate(1, i -> i + 1).boxed();

      Streams
          .zip(entries, indexStream, (idValue, index) -> Tuple.of(idValue._1, index, idValue._2))
          .forEach(idIndexValue -> builder.pushElement("document")
              .attribute("id", idIndexValue._1.toString())
              .attribute("version", idIndexValue._2.toString())
              .attribute("createdBy", idIndexValue._3.createdBy)
              .attribute("createdDate", idIndexValue._3.createdDate.toString())
              .attribute("lastModifiedBy", idIndexValue._3.lastModifiedBy)
              .attribute("lastModifiedDate", idIndexValue._3.lastModifiedDate.toString())
              .pop());
    }

    return builder.build();
  }

  @GetXmlMapping("/{number}")
  public Document getDocumentVersionByNumber(
      @PathVariable("id") UUID id,
      @PathVariable("number") Integer number,
      @AuthenticationPrincipal User user) {

    if (number < 1) {
      throw new BadRequestException("Version number can't be less than one.");
    }

    long maxNumber = documentVersionReadRepository.count(DocumentCriteria.byId(id), user);

    if (number > maxNumber) {
      throw new NotFoundException();
    }

    try (Stream<Tuple2<UUID, Audited<Document>>> entries = documentVersionReadRepository
        .entries(DocumentCriteria.byId(id), user)) {

      return entries
          .skip(maxNumber - number)
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

}

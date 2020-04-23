package fi.vero.lakied.web;

import fi.vero.lakied.service.concept.ConceptCriteria;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.exception.NotFoundException;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.GetXmlMapping;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api")
public class ConceptReadController {

  private final ReadRepository<String, Document> terminologyReadRepository;
  private final ReadRepository<String, Document> conceptReadRepository;

  @Autowired
  public ConceptReadController(
      ReadRepository<String, Document> terminologyReadRepository,
      ReadRepository<String, Document> conceptReadRepository) {
    this.terminologyReadRepository = terminologyReadRepository;
    this.conceptReadRepository = conceptReadRepository;
  }

  @GetXmlMapping(path = "/terminologies")
  public Document terminologies(@AuthenticationPrincipal User user) {
    XmlDocumentBuilder builder = XmlDocumentBuilder.builder().pushElement("terminologies");

    terminologyReadRepository.forEachEntry(Criteria.matchAll(), user,
        (id, terminology) -> builder.pushExternal(terminology.getDocumentElement()).pop());

    return builder.build();
  }

  @GetXmlMapping(path = "/concepts", params = "uri")
  public Document byUri(@RequestParam("uri") String uri, @AuthenticationPrincipal User user) {
    return conceptReadRepository.value(ConceptCriteria.byUri(uri), user)
        .orElseThrow(NotFoundException::new);
  }

  @GetXmlMapping(path = "/concepts", params = "query")
  public Document query(@RequestParam("query") String query, @AuthenticationPrincipal User user) {
    XmlDocumentBuilder builder = XmlDocumentBuilder.builder().pushElement("concepts");

    if (!query.isEmpty()) {
      conceptReadRepository.forEachEntry(ConceptCriteria.byQuery(query), user,
          (id, concept) -> builder.pushExternal(concept.getDocumentElement()).pop());
    }

    return builder.build();
  }

}

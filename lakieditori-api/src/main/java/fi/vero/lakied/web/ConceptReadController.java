package fi.vero.lakied.web;

import fi.vero.lakied.service.concept.ConceptCriteria;
import fi.vero.lakied.util.common.ReadRepository;
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
@RequestMapping("/api/concepts")
public class ConceptReadController {

  private final ReadRepository<String, Document> conceptReadRepository;

  @Autowired
  public ConceptReadController(ReadRepository<String, Document> conceptReadRepository) {
    this.conceptReadRepository = conceptReadRepository;
  }

  @GetXmlMapping(params = "uri")
  public Document byUri(@RequestParam("uri") String uri, @AuthenticationPrincipal User user) {
    return conceptReadRepository.value(ConceptCriteria.byUri(uri), user)
        .orElseThrow(NotFoundException::new);
  }

  @GetXmlMapping(params = "query")
  public Document query(@RequestParam("query") String query, @AuthenticationPrincipal User user) {
    XmlDocumentBuilder builder = new XmlDocumentBuilder().pushElement("concepts");

    if (!query.isEmpty()) {
      conceptReadRepository.forEachEntry(ConceptCriteria.byQuery(query), user,
          (id, concept) -> builder.pushExternal(concept.getDocumentElement()).pop());
    }

    return builder.build();
  }

}

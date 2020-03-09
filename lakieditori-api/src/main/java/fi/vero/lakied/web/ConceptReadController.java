package fi.vero.lakied.web;

import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.User;
import fi.vero.lakied.util.criteria.JsonCriteria;
import fi.vero.lakied.util.xml.GetXmlMapping;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api/concepts")
public class ConceptReadController {

  private final ReadRepository<String, Document> conceptReadRepository;

  public ConceptReadController(ReadRepository<String, Document> conceptReadRepository) {
    this.conceptReadRepository = conceptReadRepository;
  }

  @GetXmlMapping
  public Document get(@RequestParam("query") String query, @AuthenticationPrincipal User user) {
    XmlDocumentBuilder builder = new XmlDocumentBuilder().pushElement("concepts");

    if (!query.isEmpty()) {
      conceptReadRepository.forEachEntry(JsonCriteria.of("query", query), user,
          (id, concept) -> builder.pushExternal(concept.getDocumentElement()).pop());
    }

    return builder.build();
  }

}

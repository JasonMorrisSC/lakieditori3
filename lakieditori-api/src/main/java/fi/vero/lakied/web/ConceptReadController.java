package fi.vero.lakied.web;

import fi.vero.lakied.service.concept.ConceptCriteria;
import fi.vero.lakied.service.textanalysis.TextAnalysisService;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.exception.NotFoundException;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.GetXmlMapping;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import java.util.List;
import java.util.Set;
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
  private final TextAnalysisService textAnalysisService;

  @Autowired
  public ConceptReadController(
      ReadRepository<String, Document> conceptReadRepository,
      TextAnalysisService textAnalysisService) {
    this.conceptReadRepository = conceptReadRepository;
    this.textAnalysisService = textAnalysisService;
  }

  @GetXmlMapping(params = "uri")
  public Document byUri(@RequestParam("uri") String uri, @AuthenticationPrincipal User user) {
    return conceptReadRepository.value(ConceptCriteria.byUri(uri), user)
        .orElseThrow(NotFoundException::new);
  }

  @GetXmlMapping(params = "query")
  public Document query(
      @RequestParam("query") String query,
      @RequestParam(value = "terminologyUri", defaultValue = "#{T(java.util.Collections).emptyList()}") List<String> terminologyUris,
      @AuthenticationPrincipal User user) {
    XmlDocumentBuilder builder = XmlDocumentBuilder.builder().pushElement("concepts");

    if (!query.isEmpty()) {
      conceptReadRepository.forEachEntry(
          ConceptCriteria.byQuery(query, terminologyUris), user,
          (id, concept) -> builder.appendExternal(concept.getDocumentElement()));
    }

    return builder.build();
  }

  @GetXmlMapping(params = {"query", "lemmatize=true"})
  public Document queryLemmatized(
      @RequestParam("query") String query,
      @RequestParam(value = "terminologyUri", defaultValue = "#{T(java.util.Collections).emptyList()}") List<String> terminologyUris,
      @RequestParam(name = "tag", defaultValue = "#{T(java.util.Collections).emptySet()}") Set<String> tags,
      @RequestParam(name = "lang", defaultValue = "fi") String lang,
      @AuthenticationPrincipal User user) {
    return query(textAnalysisService.lemma(query, tags, lang), terminologyUris, user);
  }

}

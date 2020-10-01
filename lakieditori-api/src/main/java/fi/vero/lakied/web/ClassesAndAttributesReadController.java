package fi.vero.lakied.web;

import com.google.common.collect.ImmutableMultimap;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.StringMultimapCriteria;
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
@RequestMapping("/api/classesAndAttributes")
public class ClassesAndAttributesReadController {

  private final ReadRepository<String, Document> conceptUsageReadRepository;

  @Autowired
  public ClassesAndAttributesReadController(
      ReadRepository<String, Document> conceptUsageReadRepository) {
    this.conceptUsageReadRepository = conceptUsageReadRepository;
  }

  @GetXmlMapping(params = "conceptUri")
  public Document classesAndAttributesByConceptUri(@RequestParam("conceptUri") String uri,
      @AuthenticationPrincipal User user) {

    XmlDocumentBuilder builder = XmlDocumentBuilder.builder("classesAndAttributes");
    Criteria<String, Document> criteria =
        StringMultimapCriteria.of(ImmutableMultimap.of("concept", uri));

    conceptUsageReadRepository.forEachEntry(criteria, user,
        (key, doc) -> builder.appendExternal(doc.getDocumentElement()));

    return builder.build();
  }

}

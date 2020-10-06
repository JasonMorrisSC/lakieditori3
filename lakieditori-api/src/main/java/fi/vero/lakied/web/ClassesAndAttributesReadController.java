package fi.vero.lakied.web;

import com.google.common.collect.ImmutableMultimap;
import fi.vero.lakied.repository.concept.Resource;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.StringMultimapCriteria;
import fi.vero.lakied.util.json.GetJsonMapping;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.GetXmlMapping;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api/classesAndAttributes")
public class ClassesAndAttributesReadController {

  private final ReadRepository<String, Document> conceptUsageDocumentReadRepository;
  private final ReadRepository<String, Resource> conceptUsageResourceReadRepository;

  @Autowired
  public ClassesAndAttributesReadController(
      ReadRepository<String, Document> conceptUsageDocumentReadRepository,
      ReadRepository<String, Resource> conceptUsageResourceReadRepository) {
    this.conceptUsageDocumentReadRepository = conceptUsageDocumentReadRepository;
    this.conceptUsageResourceReadRepository = conceptUsageResourceReadRepository;
  }

  @GetXmlMapping(params = "conceptUri")
  public Document classesAndAttributesXmlByConceptUri(
      @RequestParam("conceptUri") String uri,
      @AuthenticationPrincipal User user) {

    XmlDocumentBuilder builder = XmlDocumentBuilder.builder("classesAndAttributes");
    Criteria<String, Document> criteria =
        StringMultimapCriteria.of(ImmutableMultimap.of("concept", uri));

    conceptUsageDocumentReadRepository.forEachEntry(criteria, user,
        (key, doc) -> builder.appendExternal(doc.getDocumentElement()));

    return builder.build();
  }

  @GetJsonMapping(params = "conceptUri")
  public List<Resource> classesAndAttributesJsonByConceptUri(
      @RequestParam("conceptUri") String uri,
      @AuthenticationPrincipal User user) {

    Criteria<String, Resource> criteria =
        StringMultimapCriteria.of(ImmutableMultimap.of("concept", uri));

    return conceptUsageResourceReadRepository.collectValues(criteria, user, Collectors.toList());
  }

}

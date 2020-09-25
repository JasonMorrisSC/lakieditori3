package fi.vero.lakied.web;

import com.google.common.collect.ImmutableMultimap;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.criteria.StringMultimapCriteria;
import fi.vero.lakied.util.exception.NotFoundException;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.GetXmlMapping;
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
  public Document byConceptUri(@RequestParam("conceptUri") String uri,
      @AuthenticationPrincipal User user) {
    return conceptUsageReadRepository.value(
        new StringMultimapCriteria<>(ImmutableMultimap.of("concept", uri)), user)
        .orElseThrow(NotFoundException::new);
  }

}

package fi.vero.lakied.web;

import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.GetXmlMapping;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api/terminologies")
public class TerminologyReadController {

  private final ReadRepository<String, Document> terminologyReadRepository;

  @Autowired
  public TerminologyReadController(ReadRepository<String, Document> terminologyReadRepository) {
    this.terminologyReadRepository = terminologyReadRepository;
  }

  @GetXmlMapping
  public Document getAll(@AuthenticationPrincipal User user) {
    XmlDocumentBuilder builder = XmlDocumentBuilder.builder().pushElement("terminologies");

    terminologyReadRepository.forEachEntry(Criteria.matchAll(), user,
        (id, terminology) -> builder.pushExternal(terminology.getDocumentElement()).pop());

    return builder.build();
  }

}

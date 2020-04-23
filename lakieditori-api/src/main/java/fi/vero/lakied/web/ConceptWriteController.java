package fi.vero.lakied.web;

import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.PostXmlMapping;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Consumer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api")
public class ConceptWriteController {

  private final WriteRepository<Consumer<String>, Document> conceptWriteRepository;

  @Autowired
  public ConceptWriteController(
      WriteRepository<Consumer<String>, Document> conceptWriteRepository) {
    this.conceptWriteRepository = conceptWriteRepository;
  }

  @PostXmlMapping(path = "/concepts", produces = {
      MediaType.TEXT_XML_VALUE,
      MediaType.APPLICATION_XML_VALUE})
  public Document post(@RequestBody Document concept, @AuthenticationPrincipal User user) {
    AtomicReference<String> uriRef = new AtomicReference<>();
    conceptWriteRepository.insert(uriRef::set, concept, user);
    return XmlDocumentBuilder.builder()
        .pushExternal(concept.getDocumentElement())
        .attribute("uri", uriRef.get())
        .build();
  }

}
